import { supabase } from '../../../../supabaseClient';
import type { Profile } from '../../types/profile';
import { v4 as uuidv4 } from 'uuid';

const TABLE = 'business_cards' as const;

// Helper to convert camelCase to snake_case
function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

// Helper to convert snake_case to camelCase
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Convert object keys from camelCase to snake_case
function objectCamelToSnake(obj: any): any {
  if (Array.isArray(obj)) return obj.map(objectCamelToSnake);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = camelToSnake(key);
      acc[snakeKey] = objectCamelToSnake(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

// Convert object keys from snake_case to camelCase
function objectSnakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(objectSnakeToCamel);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = snakeToCamel(key);
      acc[camelKey] = objectSnakeToCamel(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

// Convert database (camelCase) to Profile (snake_case)
function dbToProfile(db: any): Profile {
  return {
    id: db.id,
    owner_id: db.ownerId,
    customer_id: db.customerId,
    name: db.name,
    title: db.title,
    company_name: db.companyName,
    phone1: db.phone1,
    phone2: db.phone2,
    email: db.email,
    facebook: db.facebook,
    instagram: db.instagram,
    twitter: db.twitter,
    linkedin: db.linkedin,
    youtube: db.youtube,
    tiktok: db.tiktok,
    website: db.website,
    description: db.description,
    profile_image: db.profileImage,
    cover_image: db.coverImage,
    background_color: db.backgroundColor,
    text_color: db.textColor,
    created_at: db.createdAt,
  };
}

// Convert Profile (snake_case) to database (camelCase)
function profileToDb(profile: Partial<Profile>): any {
  return {
    ownerId: profile.owner_id,
    customerId: profile.customer_id,
    name: profile.name,
    title: profile.title,
    companyName: profile.company_name,
    phone1: profile.phone1,
    phone2: profile.phone2,
    email: profile.email,
    facebook: profile.facebook,
    instagram: profile.instagram,
    twitter: profile.twitter,
    linkedin: profile.linkedin,
    youtube: profile.youtube,
    tiktok: profile.tiktok,
    website: profile.website,
    description: profile.description,
    profileImage: profile.profile_image,
    coverImage: profile.cover_image,
    backgroundColor: profile.background_color,
    textColor: profile.text_color,
  };
}

export async function fetchProfilesForUser(uid: string): Promise<Profile[]> {
  if (!uid) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('ownerId', uid);

  if (error) {
    console.error('Error fetching profiles:', JSON.stringify(error, null, 2));
    return [];
  }

  return data.map(dbToProfile);
}

export async function fetchAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching all profiles:', JSON.stringify(error, null, 2));
    return [];
  }

  return data.map(dbToProfile);
}

export async function createProfile(profile: Omit<Profile, 'id' | 'created_at'>): Promise<Profile> {
  const dbData = profileToDb(profile);
  const { data, error } = await supabase
    .from(TABLE)
    .insert(dbData)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating profile:', JSON.stringify(error, null, 2));
    throw error;
  }

  if (!data) {
    throw new Error('Failed to create profile');
  }

  return dbToProfile(data);
}

export async function updateProfile(id: string, profile: Partial<Profile>): Promise<Profile> {
  const dbData = profileToDb(profile);
  const { data, error } = await supabase
    .from(TABLE)
    .update(dbData)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating profile:', JSON.stringify(error, null, 2));
    throw error;
  }

  if (!data) {
    throw new Error('Failed to update profile');
  }

  return dbToProfile(data);
}

export async function deleteProfileFromDB(profileId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', profileId);

  if (error) {
    console.error('Error deleting profile:', JSON.stringify(error, null, 2));
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
    console.error('Error uploading image:', JSON.stringify(uploadError, null, 2));
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
