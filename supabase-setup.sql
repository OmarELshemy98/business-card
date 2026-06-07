-- Smart Business Cards - Supabase Setup SQL

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS uuid_generate_v4;

-- 2. Create Users table
CREATE TABLE IF NOT EXISTS users (
    id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
    email text,
    name text,
    role text DEFAULT 'user',
    created_at timestamptz DEFAULT now()
);

-- 3. Create Business Cards table
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

-- 4. Create Leads table
CREATE TABLE IF NOT EXISTS leads (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    profileId uuid REFERENCES business_cards(id) ON DELETE CASCADE,
    name text,
    email text,
    phone text,
    message text,
    created_at timestamptz DEFAULT now()
);

-- 5. Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 6. Users table policies
CREATE POLICY "Users can view own profile"
    ON users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- 7. Business Cards table policies
CREATE POLICY "Anyone can view business cards"
    ON business_cards
    FOR SELECT
    USING (true);

CREATE POLICY "Users can create own cards"
    ON business_cards
    FOR INSERT
    WITH CHECK (auth.uid() = ownerId);

CREATE POLICY "Users can update own cards"
    ON business_cards
    FOR UPDATE
    USING (auth.uid() = ownerId);

CREATE POLICY "Users can delete own cards"
    ON business_cards
    FOR DELETE
    USING (auth.uid() = ownerId);

-- 8. Leads table policies
CREATE POLICY "Anyone can submit leads"
    ON leads
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Card owners can view leads"
    ON leads
    FOR SELECT
    USING (
        (SELECT ownerId FROM business_cards WHERE business_cards.id = profileId) = auth.uid()
    );

-- 9. Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        'user',
        now()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Trigger to run function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
