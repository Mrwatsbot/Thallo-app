import { NextResponse } from 'next/server';
import { apiGuard } from '@/lib/api-guard';

export async function POST(request: Request) {
  const guard = await apiGuard(30); // 30 requests per minute
  if (guard.error) return guard.error;
  const { user, supabase } = guard;

  try {
    const body = await request.json();
    const { from_category_id, to_category_id, amount, month } = body;

    // Validate inputs
    if (!from_category_id || !to_category_id || !month) {
      return NextResponse.json(
        { error: 'Missing required fields: from_category_id, to_category_id, month' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    if (from_category_id === to_category_id) {
      return NextResponse.json(
        { error: 'Cannot transfer to the same category' },
        { status: 400 }
      );
    }

    // Validate month format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Invalid month format. Expected YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Fetch both budget entries
    const { data: fromBudget, error: fromError } = await (supabase.from as any)('budgets')
      .select('id, budgeted, category_id')
      .eq('user_id', user.id)
      .eq('category_id', from_category_id)
      .eq('month', month)
      .single();

    if (fromError || !fromBudget) {
      return NextResponse.json(
        { error: 'Source category budget not found for this month' },
        { status: 404 }
      );
    }

    const { data: toBudget, error: toError } = await (supabase.from as any)('budgets')
      .select('id, budgeted, category_id')
      .eq('user_id', user.id)
      .eq('category_id', to_category_id)
      .eq('month', month)
      .single();

    if (toError || !toBudget) {
      return NextResponse.json(
        { error: 'Destination category budget not found for this month' },
        { status: 404 }
      );
    }

    // Check if source has enough budget
    if (fromBudget.budgeted < amount) {
      return NextResponse.json(
        { error: 'Insufficient budget in source category' },
        { status: 400 }
      );
    }

    // Calculate new amounts
    const newFromBudgeted = fromBudget.budgeted - amount;
    const newToBudgeted = toBudget.budgeted + amount;

    // Update both budgets in a transaction
    // First, update the "from" budget
    const { error: updateFromError } = await (supabase.from as any)('budgets')
      .update({ budgeted: newFromBudgeted, updated_at: new Date().toISOString() })
      .eq('id', fromBudget.id)
      .eq('user_id', user.id);

    if (updateFromError) {
      return NextResponse.json(
        { error: 'Failed to update source budget' },
        { status: 500 }
      );
    }

    // Then update the "to" budget
    const { error: updateToError } = await (supabase.from as any)('budgets')
      .update({ budgeted: newToBudgeted, updated_at: new Date().toISOString() })
      .eq('id', toBudget.id)
      .eq('user_id', user.id);

    if (updateToError) {
      // Rollback the first update
      await (supabase.from as any)('budgets')
        .update({ budgeted: fromBudget.budgeted, updated_at: new Date().toISOString() })
        .eq('id', fromBudget.id)
        .eq('user_id', user.id);

      return NextResponse.json(
        { error: 'Failed to update destination budget' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      from: {
        category_id: from_category_id,
        old_budgeted: fromBudget.budgeted,
        new_budgeted: newFromBudgeted,
      },
      to: {
        category_id: to_category_id,
        old_budgeted: toBudget.budgeted,
        new_budgeted: newToBudgeted,
      },
      amount,
    });
  } catch (error) {
    console.error('Transfer error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
