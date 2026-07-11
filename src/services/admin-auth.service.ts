import { createServerSupabaseClient } from '@/src/lib/supabase/server';

export async function assertAdminRole() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data: profile, error } = await supabase.from('user_profiles').select('role').eq('user_id', user.id).single();

  if (error || profile?.role !== 'admin') {
    throw new Error('Forbidden');
  }

  return user;
}
