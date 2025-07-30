-- Live Testing Setup for Supabase
-- Run these commands in your Supabase SQL Editor to set up test data

-- 1. First, sign in with Google to any portal to create your auth.users record
-- Then find your user ID with this query:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@gmail.com';

-- 2. Create test company (replace with your preferred company details)
INSERT INTO companies (id, name, abn, address, contact_email, contact_phone, created_at)
VALUES (
    gen_random_uuid(),
    'Test Company Ltd',
    '12345678901',
    '123 Test Street, Melbourne VIC 3000',
    'admin@testcompany.com',
    '+61 3 9123 4567',
    NOW()
) ON CONFLICT (name) DO UPDATE SET
    abn = EXCLUDED.abn,
    address = EXCLUDED.address,
    contact_email = EXCLUDED.contact_email,
    contact_phone = EXCLUDED.contact_phone;

-- Get the company ID for reference
DO $$
DECLARE
    company_uuid UUID;
    employee_uuid UUID;
BEGIN
    -- Get or create company
    SELECT id INTO company_uuid FROM companies WHERE name = 'Test Company Ltd';
    
    -- 3. Create test employee record (replace email with your Google email)
    INSERT INTO employees (id, company_id, name, email, phone, position, salary, created_at)
    VALUES (
        gen_random_uuid(),
        company_uuid,
        'Ben Millar', -- Replace with your name
        'ben@millarX.com.au', -- Replace with your actual Google email
        '+61 400 000 000',
        'Software Developer',
        80000,
        NOW()
    ) ON CONFLICT (email) DO UPDATE SET
        company_id = EXCLUDED.company_id,
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        position = EXCLUDED.position,
        salary = EXCLUDED.salary;
        
    -- Get employee ID for later use
    SELECT id INTO employee_uuid FROM employees WHERE email = 'ben@millarX.com.au';
END $$;

-- 4. Add portal access for your user
-- Replace '95a6a2b2-e501-4bd7-9e85-004a38ab3c36' with your actual user ID if different

-- Admin access
INSERT INTO portal_access (user_id, portal_type, permissions, is_active)
VALUES (
    '95a6a2b2-e501-4bd7-9e85-004a38ab3c36', -- Your actual user ID
    'admin',
    '{"manage_users": true, "manage_rates": true, "view_all_data": true}',
    true
) ON CONFLICT (user_id, portal_type) DO UPDATE SET
    permissions = EXCLUDED.permissions,
    is_active = EXCLUDED.is_active;

-- Employer access
INSERT INTO portal_access (user_id, portal_type, permissions, is_active)
VALUES (
    '95a6a2b2-e501-4bd7-9e85-004a38ab3c36', -- Your actual user ID
    'employer',
    '{"company_name": "Test Company Ltd", "manage_employees": true}',
    true
) ON CONFLICT (user_id, portal_type) DO UPDATE SET
    permissions = EXCLUDED.permissions,
    is_active = EXCLUDED.is_active;

-- Employee access
INSERT INTO portal_access (user_id, portal_type, permissions, is_active)
VALUES (
    '95a6a2b2-e501-4bd7-9e85-004a38ab3c36', -- Your actual user ID
    'employee',
    '{"company_name": "Test Company Ltd", "can_apply": true}',
    true
) ON CONFLICT (user_id, portal_type) DO UPDATE SET
    permissions = EXCLUDED.permissions,
    is_active = EXCLUDED.is_active;

-- Dealer access
INSERT INTO portal_access (user_id, portal_type, permissions, is_active)
VALUES (
    '95a6a2b2-e501-4bd7-9e85-004a38ab3c36', -- Your actual user ID
    'mxdealer',
    '{"dealership_name": "Test Motors", "territory": "Melbourne", "tier": "Gold"}',
    true
) ON CONFLICT (user_id, portal_type) DO UPDATE SET
    permissions = EXCLUDED.permissions,
    is_active = EXCLUDED.is_active;

-- 5. Create some sample lease rates (if not already present)
INSERT INTO lease_rates (vehicle_type, base_rate, term_months, residual_percentage, created_at)
VALUES 
    ('Electric', 0.065, 36, 0.45, NOW()),
    ('Hybrid', 0.070, 36, 0.40, NOW()),
    ('Petrol', 0.075, 36, 0.35, NOW()),
    ('Electric', 0.060, 48, 0.35, NOW()),
    ('Hybrid', 0.065, 48, 0.30, NOW()),
    ('Petrol', 0.070, 48, 0.25, NOW())
ON CONFLICT (vehicle_type, term_months) DO NOTHING;

-- 6. Verify your setup with these queries:

-- Check your user ID
-- SELECT id, email, created_at FROM auth.users WHERE email = 'your-email@gmail.com';

-- Check your portal access
-- SELECT * FROM portal_access WHERE user_id = 'your-google-user-id';

-- Check company and employee data
-- SELECT * FROM companies WHERE id = 1;
-- SELECT * FROM employees WHERE id = 1;

-- Check lease rates
-- SELECT * FROM lease_rates ORDER BY vehicle_type, term_months;

-- 7. Test data creation (run after setting up above)
-- This creates a sample quote and application for testing

DO $$
DECLARE
    company_uuid UUID;
    employee_uuid UUID;
    quote_uuid UUID;
BEGIN
    -- Get company and employee IDs
    SELECT id INTO company_uuid FROM companies WHERE name = 'Test Company Ltd';
    SELECT id INTO employee_uuid FROM employees WHERE email = 'ben@millarX.com.au';
    
    -- Create sample quote
    INSERT INTO lease_quotes (
        id,
        employee_id,
        company_id,
        quote_number,
        vehicle_make,
        vehicle_model,
        vehicle_year,
        vehicle_price,
        lease_term,
        weekly_payment,
        total_cost,
        status,
        created_at
    ) VALUES (
        gen_random_uuid(),
        employee_uuid,
        company_uuid,
        'Q-TEST-001',
        'Tesla',
        'Model 3',
        2024,
        65000.00,
        36,
        450.00,
        70200.00,
        'draft',
        NOW()
    ) ON CONFLICT (quote_number) DO UPDATE SET
        vehicle_make = EXCLUDED.vehicle_make,
        vehicle_model = EXCLUDED.vehicle_model,
        vehicle_price = EXCLUDED.vehicle_price,
        status = EXCLUDED.status;
    
    -- Get the quote ID for the application
    SELECT id INTO quote_uuid FROM lease_quotes WHERE quote_number = 'Q-TEST-001';
    
    -- Create sample application
    INSERT INTO lease_applications (
        id,
        employee_id,
        quote_id,
        application_number,
        employment_status,
        annual_salary,
        employment_start_date,
        status,
        created_at
    ) VALUES (
        gen_random_uuid(),
        employee_uuid,
        quote_uuid,
        'APP-TEST-001',
        'permanent',
        80000.00,
        '2020-01-01',
        'pending',
        NOW()
    ) ON CONFLICT (application_number) DO UPDATE SET
        employment_status = EXCLUDED.employment_status,
        annual_salary = EXCLUDED.annual_salary,
        status = EXCLUDED.status;
END $$;

-- Final verification queries to run after setup:
-- SELECT * FROM active_quotes_view;
-- SELECT * FROM pending_applications_view;
