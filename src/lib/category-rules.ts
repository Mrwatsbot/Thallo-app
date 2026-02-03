import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Apply category rules to find matching category for a payee
 * @param supabase Supabase client
 * @param userId User ID
 * @param payee The payee name to match
 * @returns category_id if a rule matches, null otherwise
 */
export async function applyCategoryRules(
  supabase: SupabaseClient,
  userId: string,
  payee: string
): Promise<string | null> {
  if (!payee) return null;

  // Fetch all rules for the user
  const { data: rules } = await (supabase.from as any)('category_rules')
    .select('id, payee_pattern, category_id, match_type')
    .eq('user_id', userId);

  if (!rules || rules.length === 0) return null;

  const payeeLower = payee.toLowerCase().trim();

  // Check rules in order (could be prioritized in future)
  for (const rule of rules) {
    const patternLower = rule.payee_pattern.toLowerCase().trim();

    if (rule.match_type === 'exact') {
      if (payeeLower === patternLower) {
        return rule.category_id;
      }
    } else if (rule.match_type === 'contains') {
      if (payeeLower.includes(patternLower) || patternLower.includes(payeeLower)) {
        return rule.category_id;
      }
    }
  }

  return null;
}
