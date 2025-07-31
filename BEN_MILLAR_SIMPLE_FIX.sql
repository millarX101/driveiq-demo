-- Simple Fix for Ben Millar's OAuth Issue
-- This script handles existing records and avoids duplicate key errors

-- Step 1: First, let's see what's currently in the database for Ben
SELECT 'Current Ben profiles:' as info;
SELECT user_id, email, full_name, employee_id FROM user_profiles 
WHERE email LIKE '%ben%' OR email LIKE '%millar%' OR employee_id = 'TF-HR-001';

SELECT 'Current portal access for Ben:' as info;
SELECT pa.user_id, pa.portal_type, pa.is_active, up.email 
FROM portal_access pa 
LEFT JOIN user_profiles up ON pa.user_id = up.user_id
WHERE up.email LIKE '%ben%' OR up.email LIKE '%millar%' OR pa.user_id LIKE '%ben%';

-- Step 2: Clean up any existing Ben records to avoid conflicts
DELETE FROM portal_access WHERE user_id IN (
  SELECT user_id FROM user_profiles 
  WHERE email LIKE '%ben%' OR email LIKE '%millar%' OR employee_id = 'TF-HR-001'
);

DELETE FROM company_settings WHERE user_id IN (
  SELECT user_id FROM user_profiles 
  WHERE email LIKE '%ben%' OR email LIKE '%millar%' OR employee_id = 'TF-HR-001'
);

DELETE FROM fleet_vehicles WHERE user_id IN (
  SELECT user_id FROM user_profiles 
  WHERE email LIKE '%ben%' OR email LIKE '%millar%' OR employee_id = 'TF-HR-001'
);

DELETE FROM carbon_purchases WHERE user_id IN (
  SELECT user_id FROM user_profiles 
  WHERE email LIKE '%ben%' OR email LIKE '%millar%' OR employee_id = 'TF-HR-001'
);

DELETE FROM user_profiles 
WHERE email LIKE '%ben%' OR email LIKE '%millar%' OR employee_id = 'TF-HR-001';

-- Step 3: Clean up any placeholder records
DELETE FROM portal_access WHERE user_id = 'ben-millar-manager';
DELETE FROM company_settings WHERE user_id = 'ben-millar-manager';
DELETE FROM fleet_vehicles WHERE user_id = 'ben-millar-manager';
DELETE FROM carbon_purchases WHERE user_id = 'ben-millar-manager';
DELETE FROM user_profiles WHERE user_id = 'ben-millar-manager';

DELETE FROM portal_access WHERE user_id = 'ben-millar-google-oauth-id';
DELETE FROM company_settings WHERE user_id = 'ben-millar-google-oauth-id';
DELETE FROM fleet_vehicles WHERE user_id = 'ben-millar-google-oauth-id';
DELETE FROM carbon_purchases WHERE user_id = 'ben-millar-google-oauth-id';
DELETE FROM user_profiles WHERE user_id = 'ben-millar-google-oauth-id';

-- Step 4: Now the OAuth callback will handle creating Ben's profile automatically
-- When Ben logs in with Google, the OAuthCallback.jsx will:
-- 1. Detect his email (ben@millarx.com or ben@millarx.com.au)
-- 2. Create his user profile with his real OAuth user ID
-- 3. Set up employer portal access
-- 4. Create company settings
-- 5. Redirect to employer dashboard

-- Step 5: Verify the cleanup worked
SELECT 'After cleanup - Ben profiles:' as info;
SELECT user_id, email, full_name, employee_id FROM user_profiles 
WHERE email LIKE '%ben%' OR email LIKE '%millar%' OR employee_id = 'TF-HR-001';

SELECT 'After cleanup - Ben portal access:' as info;
SELECT pa.user_id, pa.portal_type, pa.is_active, up.email 
FROM portal_access pa 
LEFT JOIN user_profiles up ON pa.user_id = up.user_id
WHERE up.email LIKE '%ben%' OR up.email LIKE '%millar%' OR pa.user_id LIKE '%ben%';

-- Step 6: Ensure the fleet vehicles are linked to the company (not user-specific initially)
-- The OAuth callback will link them to Ben's real user ID when he logs in
UPDATE fleet_vehicles 
SET user_id = 'PLACEHOLDER_FOR_BEN'
WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE carbon_purchases 
SET user_id = 'PLACEHOLDER_FOR_BEN'
WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';

-- The OAuth callback will replace 'PLACEHOLDER_FOR_BEN' with Ben's real OAuth user ID

SELECT 'Setup complete. Ben should now be able to log in with Google OAuth.' as result;
SELECT 'The OAuth callback will automatically create his profile and set up access.' as next_step;
