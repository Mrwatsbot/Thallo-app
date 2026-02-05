import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // Whitelist allowed redirect paths to prevent open redirect attacks
  const allowedPrefixes = ['/dashboard', '/transactions', '/budgets', '/debts', '/savings', '/settings', '/score', '/coaching', '/review', '/setup', '/import'];
  const safePath = next.startsWith('/') && allowedPrefixes.some(p => next.startsWith(p)) ? next : '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${safePath}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
