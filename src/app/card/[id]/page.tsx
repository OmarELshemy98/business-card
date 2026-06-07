import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import CardClient from './card-client';
import { Profile } from '../../types/profile';

// Create a Supabase client for server-side rendering
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get profile safely
async function getProfile(id: string): Promise<Profile | null> {
  // Try by id first
  try {
    const { data } = await supabase
      .from('business_cards')
      .select('*')
      .eq('id', id)
      .single();
    if (data) return data as Profile;
  } catch (error) {
    // Ignore error if no data found
  }

  // Try by slug
  try {
    const { data: slugData } = await supabase
      .from('business_cards')
      .select('*')
      .eq('slug', id)
      .single();
    if (slugData) return slugData as Profile;
  } catch (error) {
    // Ignore error if no data found
  }

  return null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;
  const profile = await getProfile(id);

  const cardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/card/${id}`;

  return {
    title: profile?.name ? `${profile.name} - Business Card` : 'Business Card',
    description: profile?.description || `View ${profile?.name || 'this'} business card`,
    openGraph: {
      title: profile?.name ? `${profile.name} - Business Card` : 'Business Card',
      description: profile?.description || `View ${profile?.name || 'this'} business card`,
      url: cardUrl,
      siteName: 'Smart Business Cards',
      images: [
        {
          url: profile?.profileImage || profile?.coverImage || 'https://coresg-normal.trae.ai/api/ide/v1/text-to-image?prompt=professional%20business%20card%20icon&image_size=square',
          width: 800,
          height: 600,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function CardPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const profile = await getProfile(id);
  return <CardClient profile={profile} />;
}
