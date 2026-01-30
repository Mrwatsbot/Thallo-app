'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

export function useUser() {
  const router = useRouter();

  const { data, error, isLoading } = useSWR('user-profile', async () => {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;

    // Fetch full profile from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return null;
    }

    return profile as Profile;
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  useEffect(() => {
    if (!isLoading && data === null) {
      router.push('/login');
    }
  }, [data, isLoading, router]);

  const userProfile: Partial<Profile> = data || { 
    email: '', 
    full_name: '',
    income_type: null,
  };

  return {
    user: data ?? undefined,
    userProfile: userProfile as Profile,
    isLoading,
    error,
  };
}
