-- Complete Fix for Ben Millar's Google OAuth Issue
-- This script addresses the root cause and provides a comprehensive solution

-- First, run the complete database setup
-- (Use complete-company-database-setup.sql first)

-- Step 1: Create a function to get Ben's real Google OAuth user ID
-- This will help us identify his actual user ID from Supabase Auth

-- Step 2: Update Ben's profile with his real Google OAuth user ID
-- Replace 'BEN_REAL_GOOGLE_USER_ID' with his actual user ID from Supabase Auth dashboard

-- Get Ben's real user ID by checking the auth.users table or from the browser console
-- Method 1: Check Supabase Dashboard -> Authentication -> Users
-- Method 2: Add console.log in the app to capture the real user ID

-- Once you have Ben's real Google OAuth user ID, run these updates:

-- Update user_profiles table
UPDATE user_profiles 
SET user_id = 'BEN_REAL_GOOGLE_USER_ID'
WHERE email = 'ben@millarx.com' OR employee_id = 'TF-HR-001';

-- Update portal_access table (ensure he has employer access)
UPDATE portal_access 
SET user_id = 'BEN_REAL_GOOGLE_USER_ID'
WHERE user_id = 'ben-millar-manager';

-- Also ensure he has employer portal access (not employee)
INSERT INTO portal_access (user_id, company_id, portal_type, is_active) 
VALUES ('BEN_REAL_GOOGLE_USER_ID', '550e8400-e29b-41d4-a716-446655440000', 'employer', true)
ON CONFLICT (user_id, company_id, portal_type) DO UPDATE SET
  is_active = true;

-- Remove any employee portal access for Ben (he should be employer only)
DELETE FROM portal_access 
WHERE user_id = 'BEN_REAL_GOOGLE_USER_ID' 
AND portal_type = 'employee';

-- Update company_settings table
UPDATE company_settings 
SET user_id = 'BEN_REAL_GOOGLE_USER_ID'
WHERE user_id = 'ben-millar-manager';

-- Update fleet_vehicles table
UPDATE fleet_vehicles 
SET user_id = 'BEN_REAL_GOOGLE_USER_ID'
WHERE user_id = 'ben-millar-manager';

-- Update carbon_purchases table
UPDATE carbon_purchases 
SET user_id = 'BEN_REAL_GOOGLE_USER_ID'
WHERE user_id = 'ben-millar-manager';

-- Step 3: Create a special entry for Ben's email domain to auto-route to employer portal
-- This ensures future logins automatically go to the right portal

-- Create a function to automatically assign portal access based on email domain
CREATE OR REPLACE FUNCTION assign_portal_access_by_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is Ben Millar's email
  IF NEW.email = 'ben@millarx.com' OR NEW.email = 'ben@millarx.com.au' THEN
    -- Ensure he gets employer portal access
    INSERT INTO portal_access (user_id, company_id, portal_type, is_active)
    VALUES (NEW.id, '550e8400-e29b-41d4-a716-446655440000', 'employer', true)
    ON CONFLICT (user_id, company_id, portal_type) DO UPDATE SET
      is_active = true;
    
    -- Also create/update his user profile
    INSERT INTO user_profiles (user_id, employee_id, full_name, email, company_name, company_id)
    VALUES (NEW.id, 'TF-HR-001', 'Ben Millar', NEW.email, 'TechFlow Solutions Pty Ltd', '550e8400-e29b-41d4-a716-446655440000')
    ON CONFLICT (user_id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      company_name = EXCLUDED.company_name,
      company_id = EXCLUDED.company_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically assign portal access when Ben logs in
-- Note: This requires access to auth.users table which may not be available
-- Alternative: Handle this in the application code

-- Step 4: Verification queries
-- Run these to verify the fix worked:

-- Check Ben's user profile
SELECT * FROM user_profiles WHERE email LIKE '%ben%' OR employee_id = 'TF-HR-001';

-- Check Ben's portal access
SELECT * FROM portal_access WHERE user_id IN (
  SELECT user_id FROM user_profiles WHERE email LIKE '%ben%'
);

-- Check company settings
SELECT * FROM company_settings WHERE user_id IN (
  SELECT user_id FROM user_profiles WHERE email LIKE '%ben%'
);

-- Check fleet vehicles
SELECT COUNT(*) as vehicle_count FROM fleet_vehicles WHERE user_id IN (
  SELECT user_id FROM user_profiles WHERE email LIKE '%ben%'
);

-- Step 5: Alternative approach if you can't get the real user ID easily
-- Create a new profile entry that will be matched when Ben logs in

-- This approach creates a profile that matches Ben's Google email
-- The OAuth callback will find this and use it

INSERT INTO user_profiles (user_id, employee_id, full_name, email, company_name, company_id) 
VALUES ('temp-ben-profile', 'TF-HR-001', 'Ben Millar', 'ben@millarx.com.au', 'TechFlow Solutions Pty Ltd', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (user_id) DO UPDATE SET
  employee_id = EXCLUDED.employee_id,
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  company_id = EXCLUDED.company_id;

INSERT INTO portal_access (user_id, company_id, portal_type, is_active) 
VALUES ('temp-ben-profile', '550e8400-e29b-41d4-a716-446655440000', 'employer', true)
ON CONFLICT (user_id, company_id, portal_type) DO UPDATE SET
  is_active = EXCLUDED.is_active;

-- Step 6: Clean up any duplicate or conflicting entries
-- Remove any old placeholder entries that might conflict

DELETE FROM user_profiles WHERE user_id = 'ben-millar-manager' AND user_id != 'BEN_REAL_GOOGLE_USER_ID';
DELETE FROM portal_access WHERE user_id = 'ben-millar-manager' AND user_id != 'BEN_REAL_GOOGLE_USER_ID';
DELETE FROM company_settings WHERE user_id = 'ben-millar-manager' AND user_id != 'BEN_REAL_GOOGLE_USER_ID';
DELETE FROM fleet_vehicles WHERE user_id = 'ben-millar-manager' AND user_id != 'BEN_REAL_GOOGLE_USER_ID';
DELETE FROM carbon_purchases WHERE user_id = 'ben-millar-manager' AND user_id != 'BEN_REAL_GOOGLE_USER_ID';

-- Step 7: Quick fix if the OAuth callback already created Ben's profile
-- This handles the case where Ben has already logged in and the OAuth callback created his profile

-- Update existing profile to ensure it has the correct data
UPDATE user_profiles 
SET 
  employee_id = 'TF-HR-001',
  full_name = 'Ben Millar',
  company_name = 'TechFlow Solutions Pty Ltd',
  company_id = '550e8400-e29b-41d4-a716-446655440000'
WHERE email = 'ben@millarx.com' OR email = 'ben@millarx.com.au';

-- Ensure he has employer portal access
INSERT INTO portal_access (user_id, company_id, portal_type, is_active)
SELECT user_id, '550e8400-e29b-41d4-a716-446655440000', 'employer', true
FROM user_profiles 
WHERE email = 'ben@millarx.com' OR email = 'ben@millarx.com.au'
ON CONFLICT (user_id, company_id, portal_type) DO UPDATE SET
  is_active = true;

-- Remove any employee portal access for Ben
DELETE FROM portal_access 
WHERE user_id IN (
  SELECT user_id FROM user_profiles 
  WHERE email = 'ben@millarx.com' OR email = 'ben@millarx.com.au'
) AND portal_type = 'employee';

-- Create company settings for Ben if they don't exist
INSERT INTO company_settings (user_id, company_id, ev_target_percentage, carbon_budget, settings_json)
SELECT user_id, '550e8400-e29b-41d4-a716-446655440000', 50, 250000.00, '{"notifications": true, "auto_reporting": true}'
FROM user_profiles 
WHERE email = 'ben@millarx.com' OR email = 'ben@millarx.com.au'
ON CONFLICT (user_id, company_id) DO UPDATE SET
  ev_target_percentage = EXCLUDED.ev_target_percentage,
  carbon_budget = EXCLUDED.carbon_budget,
  settings_json = EXCLUDED.settings_json;

-- Link fleet vehicles to Ben's real user ID
UPDATE fleet_vehicles 
SET user_id = (
  SELECT user_id FROM user_profiles 
  WHERE email = 'ben@millarx.com' OR email = 'ben@millarx.com.au'
  LIMIT 1
)
WHERE user_id = 'ben-millar-manager' OR user_id = 'ben-millar-google-oauth-id';

-- Link carbon purchases to Ben's real user ID
UPDATE carbon_purchases 
SET user_id = (
  SELECT user_id FROM user_profiles 
  WHERE email = 'ben@millarx.com' OR email = 'ben@millarx.com.au'
  LIMIT 1
)
WHERE user_id = 'ben-millar-manager' OR user_id = 'ben-millar-google-oauth-id';

-- Instructions for getting Ben's real Google OAuth user ID:
-- 1. Have Ben log in with Google
-- 2. Check browser console for the user ID
-- 3. Or check Supabase Dashboard -> Authentication -> Users
-- 4. Replace 'BEN_REAL_GOOGLE_USER_ID' in the queries above
-- 5. Run the update queries

-- Expected result after fix:
-- - Ben logs in with Google OAuth
-- - System finds his profile in user_profiles table
-- - He gets redirected to /employer/dashboard
-- - Header shows "Ben Millar" instead of "Michael Thompson"
-- - He can see the full company fleet data (150 employees)
