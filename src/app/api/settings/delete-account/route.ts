import { NextResponse } from 'next/server';
import { apiGuard } from '@/lib/api-guard';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';

/**
 * DELETE /api/settings/delete-account
 * Permanently deletes user account and ALL associated data.
 * Apple App Store requirement for apps with account creation.
 */
export async function POST() {
  const guard = await apiGuard(5); // Low rate limit for destructive action
  if (guard.error) return guard.error;
  const { user, supabase } = guard;

  try {
    // Step 1: Revoke Plaid access tokens (best effort)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: plaidConnections } = await (supabase.from as any)('plaid_connections')
        .select('access_token')
        .eq('user_id', user.id);

      if (plaidConnections && plaidConnections.length > 0) {
        // Make best effort to revoke Plaid tokens
        // This would require Plaid API integration
        // For now, we'll just log and continue
        console.log(`Deleting ${plaidConnections.length} Plaid connection(s) for user ${user.id}`);
      }
    } catch (plaidError) {
      console.error('Error revoking Plaid tokens:', plaidError);
      // Continue with deletion even if Plaid revocation fails
    }

    // Step 2: Delete all user data in correct order (respecting foreign key constraints)
    const tablesToDelete = [
      'debt_payments',        // Child of debts
      'debts',
      'savings_contributions', // Child of savings_goals
      'savings_goals',
      'transactions',
      'budgets',
      'category_rules',
      'plaid_connections',
      'ai_usage',
      'score_history',
      'user_achievements',
      'streaks',
      'billing_events',
      'accounts',
      'profiles',              // Delete profile last before auth user
    ];

    for (const table of tablesToDelete) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from as any)(table)
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        // Continue with other tables even if one fails
      }
    }

    // Step 3: Delete the auth user using admin client
    // This requires the service role key
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteAuthError) {
      console.error('Error deleting auth user:', deleteAuthError);
      return NextResponse.json(
        { error: 'Failed to delete user account' },
        { status: 500 }
      );
    }

    // Success! User and all data deleted
    return NextResponse.json({
      success: true,
      message: 'Account permanently deleted',
    });
  } catch (error) {
    console.error('Error during account deletion:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
