-- ==========================================
-- Omra Palon - Admin Management Update
-- ==========================================

-- 1. Add is_approved column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT false;

-- 2. Update existing admin users to be approved (optional, but safe)
-- Manually run this for your specific user ID if needed, 
-- or go to Table Editor in Supabase to check the box for your admin.

-- 3. Update the handle_new_user function to support is_approved
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, is_approved)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Member'),
    'member',
    false -- New users are NOT approved by default
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update Profiles RLS: Allow admins to manage all profiles
-- Drop existing policies first if they conflict, or just add new ones.
-- The existing "Users can update own profile" still applies.

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to see all users (already allowed by "Profiles are viewable by everyone")
