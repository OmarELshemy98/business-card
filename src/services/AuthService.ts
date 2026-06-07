'use client';
import { supabase } from '../../supabaseClient';

export async function CreateUser(email: string, pass: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
  });
  
  if (error) throw error;
  if (!data.user) throw new Error('No user returned');
  
  return { cred: data, uid: data.user.id };
}
