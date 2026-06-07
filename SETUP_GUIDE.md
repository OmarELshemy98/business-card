# Smart Business Cards - Complete Setup & Polish Guide

## 🚀 Current Status
✅ Project migrated from Firebase → Supabase
✅ Dependencies installed
✅ Dev server running at http://localhost:3000

## 📋 Supabase Setup (Critical!)

### 1. Create Tables (if not already done)
Run these SQL queries in your Supabase SQL Editor:

```sql
-- Enable UUID extension (required for tables)
CREATE EXTENSION IF NOT EXISTS uuid_generate_v4;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
    email text,
    name text,
    role text DEFAULT 'user',
    created_at timestamptz DEFAULT now()
);

-- Business Cards table
CREATE TABLE IF NOT EXISTS business_cards (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    ownerId uuid REFERENCES users(id) NOT NULL,
    customerId text,
    name text,
    title text,
    companyName text,
    phone1 text,
    phone2 text,
    email text,
    website text,
    linkedin text,
    twitter text,
    facebook text,
    instagram text,
    youtube text,
    tiktok text,
    description text,
    profileImage text,
    coverImage text,
    backgroundColor text DEFAULT '#0f172a',
    textColor text DEFAULT '#ffffff',
    slug text,
    created_at timestamptz DEFAULT now()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    profileId uuid REFERENCES business_cards(id) ON DELETE CASCADE,
    name text,
    email text,
    phone text,
    message text,
    created_at timestamptz DEFAULT now()
);
```

### 2. Enable & Configure RLS (Row Level Security) 🔐
This is the most important security step!

#### Enable RLS on all tables:
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
```

#### Policies for Users table:
```sql
-- Users can read their own data
CREATE POLICY "Users can view own profile"
    ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
    ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- Only admins can view all users
CREATE POLICY "Admins can view all users"
    ON users
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');
```

#### Policies for Business Cards table:
```sql
-- Anyone can view business cards (publicly available)
CREATE POLICY "Anyone can view business cards"
    ON business_cards
    FOR SELECT
    USING (true);

-- Users can create their own cards
CREATE POLICY "Users can create own cards"
    ON business_cards
    FOR INSERT
    WITH CHECK (auth.uid() = ownerId);

-- Users can update their own cards
CREATE POLICY "Users can update own cards"
    ON business_cards
    FOR UPDATE
    USING (auth.uid() = ownerId);

-- Users can delete their own cards
CREATE POLICY "Users can delete own cards"
    ON business_cards
    FOR DELETE
    USING (auth.uid() = ownerId);
```

#### Policies for Leads table:
```sql
-- Anyone can submit a lead
CREATE POLICY "Anyone can submit leads"
    ON leads
    FOR INSERT
    WITH CHECK (true);

-- Only card owners can view leads for their cards
CREATE POLICY "Card owners can view leads"
    ON leads
    FOR SELECT
    USING (
        (SELECT ownerId FROM business_cards WHERE business_cards.id = profileId) = auth.uid()
    );
```

### 3. Create Storage Bucket for Images 📷
1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Name it `business-cards`
4. Set it to **Public bucket**
5. Add these policies:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'business-cards' AND
        auth.role() = 'authenticated'
    );

-- Allow public to view images
CREATE POLICY "Public can view"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'business-cards');
```

### 4. Configure Environment Variables 🔑
Create `.env.local` file in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🎨 SEO & Open Graph Setup ✅
We already added dynamic Open Graph tags in `src/app/card/[id]/page.tsx`! These will:
- Show the card owner's name
- Show the card description
- Display the profile/cover image
- Work perfectly on WhatsApp, LinkedIn, Facebook, etc.

## 📇 VCF Export (Save to Contacts) ✅
We already added this! The public card page has a "Download vCard" button that:
- Generates a `.vcf` file
- Includes all contact details
- Downloads directly to the user's device

## 🌐 Deploy to Vercel
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to https://vercel.com/new
3. Import your repository
4. Add your environment variables in Vercel settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
5. Click **Deploy**! 🎉

## ✨ Final Features Summary
✅ Supabase Auth & Database
✅ Card Builder with Live Preview
✅ Predefined Themes + Custom Colors
✅ Profile & Cover Image Upload
✅ Public Card Page with VCF Download
✅ QR Code for Each Card
✅ Lead Collection Form
✅ Dynamic SEO/Open Graph
✅ Custom Slugs
✅ Admin Panel

## 📞 Next Steps
1. Set up your Supabase project with the tables/policies above
2. Test the app locally by going to http://localhost:3000
3. Deploy to Vercel!
