-- Complete Database Setup for Ben Millar - MXDealerAdvantage Platform
-- This script creates ALL necessary tables and sets up portal access

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. CREATE ALL NECESSARY TABLES
-- =============================================

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    abn VARCHAR(20),
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    industry VARCHAR(100),
    employee_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),
    annual_salary DECIMAL(10,2),
    employment_type VARCHAR(50) DEFAULT 'full-time',
    start_date DATE,
    manager_id UUID REFERENCES employees(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portal Access Control Table (ESSENTIAL for multi-portal system)
CREATE TABLE IF NOT EXISTS portal_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    portal_type TEXT NOT NULL CHECK (portal_type IN ('employee', 'employer', 'mxdealer', 'admin')),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, portal_type, company_id)
);

-- Lease applications table
CREATE TABLE IF NOT EXISTS lease_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_year INTEGER,
    vehicle_price DECIMAL(10,2),
    lease_term_months INTEGER,
    annual_salary DECIMAL(10,2),
    tax_bracket DECIMAL(5,2),
    weekly_lease_cost DECIMAL(8,2),
    weekly_tax_savings DECIMAL(8,2),
    net_weekly_cost DECIMAL(8,2),
    total_savings DECIMAL(10,2),
    fbt_value DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'review')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lease rates table
CREATE TABLE IF NOT EXISTS lease_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_category VARCHAR(100) NOT NULL,
    base_rate DECIMAL(5,4) NOT NULL,
    residual_percentage DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. CREATE ESSENTIAL DATA
-- =============================================

-- Create test company
INSERT INTO companies (id, name, abn, address, contact_email, contact_phone, industry, employee_count)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Test Company Ltd',
    '12345678901',
    '123 Business Street, Melbourne VIC 3000',
    'admin@testcompany.com.au',
    '+61 3 9000 0000',
    'Technology',
    50
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    abn = EXCLUDED.abn,
    address = EXCLUDED.address,
    contact_email = EXCLUDED.contact_email,
    contact_phone = EXCLUDED.contact_phone,
    industry = EXCLUDED.industry,
    employee_count = EXCLUDED.employee_count;

-- Add Ben as an employee (for all his email addresses)
INSERT INTO employees (
    id,
    company_id, 
    name, 
    email, 
    department, 
    position,
    annual_salary,
    employment_type,
    start_date,
    is_active
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Ben Millar',
    'ben@millarx.com.au',
    'Technology',
    'Platform Director',
    120000.00,
    'full-time',
    '2024-01-01',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'Ben Millar',
    'benmillar79@gmail.com',
    'Technology',
    'Platform Director',
    120000.00,
    'full-time',
    '2024-01-01',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440000',
    'Ben Millar',
    'ben@mxdriveiq.com.au',
    'Technology',
    'Platform Director',
    120000.00,
    'full-time',
    '2024-01-01',
    true
)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    department = EXCLUDED.department,
    position = EXCLUDED.position,
    annual_salary = EXCLUDED.annual_salary;

-- Add some sample lease rates
INSERT INTO lease_rates (vehicle_category, base_rate, residual_percentage, effective_from)
VALUES 
    ('Electric Vehicle', 0.0650, 65.00, '2024-01-01'),
    ('Hybrid Vehicle', 0.0700, 60.00, '2024-01-01'),
    ('Petrol Vehicle', 0.0750, 55.00, '2024-01-01'),
    ('Luxury Vehicle', 0.0800, 50.00, '2024-01-01')
ON CONFLICT DO NOTHING;

-- =============================================
-- 3. SET UP PORTAL ACCESS FOR BEN'S ACTUAL USER ID
-- =============================================

-- First, show what users exist
SELECT 
    id as user_id,
    email,
    created_at,
    'Found Google OAuth user' as status
FROM auth.users 
WHERE email IN ('ben@millarx.com.au', 'benmillar79@gmail.com', 'ben@mxdriveiq.com.au')
ORDER BY created_at DESC;

-- Now set up portal access for Ben's actual user ID
DO $$
DECLARE
    ben_user_id UUID;
    company_uuid UUID := '550e8400-e29b-41d4-a716-446655440000';
BEGIN
    -- Get Ben's actual user ID from Google OAuth (try all email addresses)
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
            (ben_user_id, 'employer', company_uuid, '{"company_name": "Test Company Ltd", "manage_employees": true, "view_applications": true, "approve_applications": true}', true),
            (ben_user_id, 'employee', company_uuid, '{"company_name": "Test Company Ltd", "can_apply": true, "view_own_applications": true}', true),
            (ben_user_id, 'mxdealer', NULL, '{"dealership_name": "Test Motors", "territory": "Melbourne", "tier": "Gold", "manage_customers": true, "generate_quotes": true}', true);
        
        RAISE NOTICE 'SUCCESS: Portal access set up for user ID: %', ben_user_id;
        RAISE NOTICE 'You now have access to all 4 portals!';
    ELSE
        RAISE NOTICE 'ERROR: No user found - make sure you have logged in with Google OAuth first using one of these emails:';
        RAISE NOTICE '- ben@millarx.com.au';
        RAISE NOTICE '- benmillar79@gmail.com'; 
        RAISE NOTICE '- ben@mxdriveiq.com.au';
    END IF;
END $$;

-- =============================================
-- 4. VERIFICATION AND SUMMARY
-- =============================================

-- Verify the setup worked
SELECT 
    u.email,
    pa.portal_type,
    pa.permissions,
    pa.is_active,
    c.name as company_name,
    'Portal access granted' as status
FROM portal_access pa
LEFT JOIN companies c ON pa.company_id = c.id
JOIN auth.users u ON pa.user_id = u.id
WHERE u.email IN ('ben@millarx.com.au', 'benmillar79@gmail.com', 'ben@mxdriveiq.com.au')
ORDER BY u.email, pa.portal_type;

-- Show final summary
SELECT 
    'SETUP COMPLETE!' as message,
    count(DISTINCT pa.portal_type) as portals_available,
    count(DISTINCT c.id) as companies_created,
    count(DISTINCT e.id) as employees_created,
    count(DISTINCT lr.id) as lease_rates_created
FROM portal_access pa
JOIN auth.users u ON pa.user_id = u.id
CROSS JOIN companies c
CROSS JOIN employees e  
CROSS JOIN lease_rates lr
WHERE u.email IN ('ben@millarx.com.au', 'benmillar79@gmail.com', 'ben@mxdriveiq.com.au')
AND c.name = 'Test Company Ltd'
AND e.email IN ('ben@millarx.com.au', 'benmillar79@gmail.com', 'ben@mxdriveiq.com.au')
AND lr.is_active = true;

-- Final success message
SELECT 
    '🎉 SUCCESS: Complete database setup finished!' as status,
    'You can now access all 4 portals with your Google login' as next_step,
    'Use /mxdealer/login to access your MXIntegratedPlatform' as mxdealer_access;
