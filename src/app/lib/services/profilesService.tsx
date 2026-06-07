import { supabase } from '../../../../supabaseClient';
import type { Profile } from '../../types/profile';
import { v4 as uuidv4 } from 'uuid';

const TABLE = 'business_cards' as const;

export async function fetchProfilesForUser(uid: string): Promise<Profile[]> {
  if (!uid) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('ownerId', uid);

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }

  return data.map(d => ({
    id: d.id,
    ...(d as Omit<Profile, 'id'>),
  }));
}

export async function fetchAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all profiles:', error);
    return [];
  }

  return data.map(d => ({
    id: d.id,
    ...(d as Omit<Profile, 'id'>),
  }));
}

export async function createProfile(profile: Omit<Profile, 'id' | 'createdAt'>): Promise<Profile> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ ...profile, created_at: now })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating profile:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to create profile');
  }

  return data as Profile;
}

export async function updateProfile(id: string, profile: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(profile)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to update profile');
  }

  return data as Profile;
}

export async function deleteProfileFromDB(profileId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', profileId);

  if (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
}

export async function uploadImage(file: File, bucket: string = 'business-cards'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
