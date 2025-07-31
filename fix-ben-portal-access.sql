-- Fix Portal Access for Ben Millar - Use Actual Google OAuth User ID
-- Run this script in Supabase SQL Editor after logging in with Google

-- First, let's see what user ID Google OAuth created for you
SELECT 
    id as user_id,
    email,
    created_at,
    'This is your actual Google OAuth user ID' as note
FROM auth.users 
WHERE email IN ('ben@millarx.com.au', 'benmillar79@gmail.com', 'ben@mxdriveiq.com.au')
ORDER BY created_at DESC
LIMIT 3;

-- Now let's add portal access for your actual user ID
-- This will work regardless of what your actual user ID is

DO $$
DECLARE
    ben_user_id UUID;
    company_uuid UUID := '550e8400-e29b-41d4-a716-446655440000';
BEGIN
    -- Get Ben's actual user ID from Google OAuth (try all your email addresses)
    SELECT id INTO ben_user_id 
    FROM auth.users 
    WHERE email IN ('ben@millarx.com.au', 'benmillar79@gmail.com', 'ben@mxdriveiq.com.au')
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- If we found the user, set up portal access
    IF ben_user_id IS NOT NULL THEN
        -- Delete any existing portal access to avoid conflicts
        DELETE FROM portal_access WHERE user_id = ben_user_id;
        
        -- Add portal access for all 4 portals
        INSERT INTO portal_access (user_id, portal_type, company_id, permissions, is_active)
        VALUES 
            (ben_user_id, 'admin', NULL, '{"manage_users": true, "manage_rates": true, "view_all_data": true, "system_admin": true}', true),
            (ben_user_id, 'employer', company_uuid, '{"company_name": "Test Company Ltd", "manage_employees": true}', true),
            (ben_user_id, 'employee', company_uuid, '{"company_name": "Test Company Ltd", "can_apply": true}', true),
            (ben_user_id, 'mxdealer', NULL, '{"dealership_name": "Test Motors", "territory": "Melbourne", "tier": "Gold"}', true);
        
        RAISE NOTICE 'SUCCESS: Portal access set up for user ID: %', ben_user_id;
    ELSE
        RAISE NOTICE 'ERROR: No user found with any of your email addresses - make sure you have logged in with Google OAuth first';
    END IF;
END $$;

-- Verify the setup worked
SELECT 
    pa.portal_type,
    pa.permissions,
    pa.is_active,
    c.name as company_name,
    'Portal access granted' as status
FROM portal_access pa
LEFT JOIN companies c ON pa.company_id = c.id
JOIN auth.users u ON pa.user_id = u.id
WHERE u.email IN ('ben@millarx.com.au', 'benmillar79@gmail.com', 'ben@mxdriveiq.com.au')
ORDER BY pa.portal_type;

-- Show final confirmation
SELECT 
    'SUCCESS: You now have access to all 4 portals!' as message,
    count(*) as portal_count
FROM portal_access pa
JOIN auth.users u ON pa.user_id = u.id
WHERE u.email IN ('ben@millarx.com.au', 'benmillar79@gmail.com', 'ben@mxdriveiq.com.au');
