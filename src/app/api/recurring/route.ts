import { NextResponse } from 'next/server';
import { apiGuard } from '@/lib/api-guard';
import { detectRecurringCharges, calculateMonthlyTotal } from '@/lib/recurring-detection';

// Cache configuration
const CACHE_KEY_PREFIX = 'recurring_charges_';
const CACHE_DURATION_MS = 1000 * 60 * 30; // 30 minutes

// In-memory cache (simple solution for now)
// In production, you'd use Redis or similar
const cache: Record<string, { data: any; timestamp: number }> = {};

export async function GET() {
  const guard = await apiGuard(30);
  if (guard.error) return guard.error;
  const { user, supabase } = guard;

  try {
    // Check cache first
    const cacheKey = `${CACHE_KEY_PREFIX}${user.id}`;
    const cached = cache[cacheKey];
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      return NextResponse.json(cached.data);
    }

    // Get transactions from last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const dateThreshold = sixMonthsAgo.toISOString().split('T')[0];

    // Fetch transactions and categories
    const [transactionsRes, categoriesRes] = await Promise.all([
      supabase
        .from('transactions')
        .select('id, payee_clean, payee_original, amount, date, category_id')
        .eq('user_id', user.id)
        .gte('date', dateThreshold)
        .lt('amount', 0) // Only expenses (negative amounts)
        .order('date', { ascending: false }),
      
      supabase
        .from('categories')
        .select('id, name, icon, color')
        .or(`user_id.eq.${user.id},is_system.eq.true`),
    ]);

    if (transactionsRes.error) {
      console.error('Error fetching transactions:', transactionsRes.error);
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      );
    }

    if (categoriesRes.error) {
      console.error('Error fetching categories:', categoriesRes.error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    const transactions = transactionsRes.data || [];
    const categories = categoriesRes.data || [];

    // Detect recurring charges
    const recurring = detectRecurringCharges(transactions, categories);
    const monthlyTotal = calculateMonthlyTotal(recurring);

    const result = {
      recurring,
      monthlyTotal,
      count: recurring.length,
    };

    // Cache the result
    cache[cacheKey] = {
      data: result,
      timestamp: Date.now(),
    };

    // Clean up old cache entries (simple garbage collection)
    const now = Date.now();
    for (const key in cache) {
      if (now - cache[key].timestamp > CACHE_DURATION_MS * 2) {
        delete cache[key];
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error detecting recurring charges:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
