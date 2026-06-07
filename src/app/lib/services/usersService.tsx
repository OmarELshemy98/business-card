import { supabase } from '../../../../supabaseClient';

export type AppUser = {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'user';
  created_at?: any;
  disabled?: boolean;
};

export async function fetchUsersFromDB(): Promise<AppUser[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data as AppUser[];
}
