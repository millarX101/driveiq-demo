-- Minimal Working Setup for Ben Millar - MXDealerAdvantage Platform
-- This script creates ONLY the essential tables and data needed for Google OAuth

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. CREATE ESSENTIAL TABLES ONLY
-- =============================================

-- Companies table (minimal)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees table (minimal)
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100),
    annual_salary DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portal Access Control Table (essential for OAuth)
CREATE TABLE IF NOT EXISTS portal_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    portal_type TEXT NOT NULL CHECK (portal_type IN ('employee', 'employer', 'mxdealer', 'admin')),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, portal_type, company_id)
);

-- =============================================
-- 2. CREATE ESSENTIAL DATA FOR GOOGLE OAUTH
-- =============================================

-- Create test company
INSERT INTO companies (id, name)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Test Company Ltd'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name;

-- Add Ben as an employee
INSERT INTO employees (
    id,
    company_id, 
    name, 
    email, 
    department, 
    annual_salary
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Ben Millar',
    'ben@millarX.com.au',
    'Technology',
    80000.00
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    department = EXCLUDED.department,
    annual_salary = EXCLUDED.annual_salary;

-- Add portal access for Ben Millar (all 4 portals) - ESSENTIAL FOR OAUTH
INSERT INTO portal_access (user_id, portal_type, company_id, permissions, is_active)
VALUES 
    ('95a6a2b2-e501-4bd7-9e85-004a38ab3c36', 'admin', NULL, '{"manage_users": true, "manage_rates": true, "view_all_data": true, "system_admin": true}', true),
    ('95a6a2b2-e501-4bd7-9e85-004a38ab3c36', 'employer', '550e8400-e29b-41d4-a716-446655440000', '{"company_name": "Test Company Ltd", "manage_employees": true}', true),
    ('95a6a2b2-e501-4bd7-9e85-004a38ab3c36', 'employee', '550e8400-e29b-41d4-a716-446655440000', '{"company_name": "Test Company Ltd", "can_apply": true}', true),
    ('95a6a2b2-e501-4bd7-9e85-004a38ab3c36', 'mxdealer', NULL, '{"dealership_name": "Test Motors", "territory": "Melbourne", "tier": "Gold"}', true)
ON CONFLICT (user_id, portal_type, company_id) DO UPDATE SET
    permissions = EXCLUDED.permissions,
    is_active = EXCLUDED.is_active;

-- =============================================
-- 3. VERIFICATION
-- =============================================

-- Check everything was created successfully
SELECT 'Portal Access' as check_type, count(*) as count 
FROM portal_access WHERE user_id = '95a6a2b2-e501-4bd7-9e85-004a38ab3c36'
UNION ALL
SELECT 'Companies', count(*) FROM companies WHERE name = 'Test Company Ltd'
UNION ALL  
SELECT 'Employees', count(*) FROM employees WHERE email = 'ben@millarX.com.au';

-- Show what was created
SELECT 'SUCCESS: Minimal setup complete for Google OAuth testing' as status;
