-- Smart Business Cards - Complete Supabase Setup

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Business Cards table first (needs to exist before leads foreign key)
CREATE TABLE IF NOT EXISTS business_cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ownerId UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customerId TEXT,
  name TEXT,
  title TEXT,
  companyName TEXT,
  phone1 TEXT,
  phone2 TEXT,
  email TEXT,
  website TEXT,
  linkedin TEXT,
  twitter TEXT,
  facebook TEXT,
  instagram TEXT,
  youtube TEXT,
  tiktok TEXT,
  description TEXT,
  profileImage TEXT,
  coverImage TEXT,
  backgroundColor TEXT DEFAULT '#0f172a',
  textColor TEXT DEFAULT '#ffffff',
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) NOT NULL PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profileId UUID REFERENCES business_cards(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies: Users table
-- Users can see their own info
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own info
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- 7. RLS Policies: Business Cards table
-- Anyone can view business cards (public)
CREATE POLICY "Anyone can view business cards" ON business_cards
  FOR SELECT
  USING (true);

-- Authenticated users can create their own business cards
CREATE POLICY "Users can create own cards" ON business_cards
  FOR INSERT
  WITH CHECK (auth.uid() = ownerId);

-- Authenticated users can update their own business cards
CREATE POLICY "Users can update own cards" ON business_cards
  FOR UPDATE
  USING (auth.uid() = ownerId);

-- Authenticated users can delete their own business cards
CREATE POLICY "Users can delete own cards" ON business_cards
  FOR DELETE
  USING (auth.uid() = ownerId);

-- 8. RLS Policies: Leads table
-- Anyone can create a lead
CREATE POLICY "Anyone can submit leads" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Only card owner can view leads from their card
CREATE POLICY "Card owners can view own leads" ON leads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_cards
      WHERE business_cards.id = profileId
      AND business_cards.ownerId = auth.uid()
    )
  );

-- 9. Create a trigger function to auto-create user in public.users when new auth.user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user',
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 11. Create Storage Bucket for Images (if not exists)
-- NOTE: You need to create this manually in Supabase Dashboard > Storage > Add Bucket
-- Name: business-cards
-- Set to PUBLIC bucket
