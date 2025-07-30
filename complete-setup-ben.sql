-- Complete Setup for Ben Millar - MXDealerAdvantage Platform
-- Run this entire script in your Supabase SQL Editor

-- ========================================
-- PART 1: CREATE DATABASE SCHEMA
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    abn VARCHAR(11),
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(255),
    salary DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portal access table
CREATE TABLE IF NOT EXISTS portal_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth.users(id)
    portal_type VARCHAR(50) NOT NULL CHECK (portal_type IN ('employee', 'employer', 'mxdealer', 'admin')),
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, portal_type)
);

-- Lease rates table
CREATE TABLE IF NOT EXISTS lease_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_type VARCHAR(50) NOT NULL,
    base_rate DECIMAL(5,4) NOT NULL,
    term_months INTEGER NOT NULL,
    residual_percentage DECIMAL(4,3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vehicle_type, term_months)
);

-- Lease quotes table
CREATE TABLE IF NOT EXISTS lease_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_year INTEGER,
    vehicle_price DECIMAL(10,2),
    lease_term INTEGER,
    weekly_payment DECIMAL(8,2),
    total_cost DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lease applications table
CREATE TABLE IF NOT EXISTS lease_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    quote_id UUID REFERENCES lease_quotes(id) ON DELETE CASCADE,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    employment_status VARCHAR(50),
    annual_salary DECIMAL(10,2),
    employment_start_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create views for easier data access
CREATE OR REPLACE VIEW active_quotes_view AS
SELECT 
    q.*,
    e.name as employee_name,
    e.email as employee_email,
    c.name as company_name
FROM lease_quotes q
JOIN employees e ON q.employee_id = e.id
JOIN companies c ON q.company_id = c.id
WHERE q.status IN ('draft', 'pending', 'approved');

CREATE OR REPLACE VIEW pending_applications_view AS
SELECT 
    a.*,
    q.vehicle_make,
    q.vehicle_model,
    q.vehicle_year,
    e.name as employee_name,
    e.email as employee_email,
    c.name as company_name
FROM lease_applications a
JOIN lease_quotes q ON a.quote_id = q.id
JOIN employees e ON q.employee_id = e.id
JOIN companies c ON q.company_id = c.id
WHERE a.status = 'pending';

-- ========================================
-- PART 2: INSERT TEST DATA FOR BEN MILLAR
-- ========================================

-- 1. Add portal access for Ben Millar (your Google account)
INSERT INTO portal_access (user_id, portal_type, permissions, is_active)
VALUES 
    ('95a6a2b2-e501-4bd7-9e85-004a38ab3c36', 'admin', '{"manage_users": true, "manage_rates": true, "view_all_data": true}', true),
    ('95a6a2b2-e501-4bd7-9e85-004a38ab3c36', 'employer', '{"company_name": "Test Company Ltd", "manage_employees": true}', true),
    ('95a6a2b2-e501-4bd7-9e85-004a38ab3c36', 'employee', '{"company_name": "Test Company Ltd", "can_apply": true}', true),
    ('95a6a2b2-e501-4bd7-9e85-004a38ab3c36', 'mxdealer', '{"dealership_name": "Test Motors", "territory": "Melbourne", "tier": "Gold"}', true)
ON CONFLICT (user_id, portal_type) DO UPDATE SET
    permissions = EXCLUDED.permissions,
    is_active = EXCLUDED.is_active;

-- 2. Create test company
INSERT INTO companies (name, abn, address, contact_email, contact_phone, created_at)
VALUES (
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

-- 3. Create test employee record
INSERT INTO employees (company_id, name, email, phone, position, salary, created_at)
SELECT 
    c.id,
    'Ben Millar',
    'ben@millarX.com.au',
    '+61 400 000 000',
    'Software Developer',
    80000,
    NOW()
FROM companies c 
WHERE c.name = 'Test Company Ltd'
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    position = EXCLUDED.position,
    salary = EXCLUDED.salary;

-- 4. Create sample lease rates
INSERT INTO lease_rates (vehicle_type, base_rate, term_months, residual_percentage, created_at)
VALUES 
    ('Electric', 0.065, 36, 0.45, NOW()),
    ('Hybrid', 0.070, 36, 0.40, NOW()),
    ('Petrol', 0.075, 36, 0.35, NOW()),
    ('Electric', 0.060, 48, 0.35, NOW()),
    ('Hybrid', 0.065, 48, 0.30, NOW()),
    ('Petrol', 0.070, 48, 0.25, NOW())
ON CONFLICT (vehicle_type, term_months) DO NOTHING;

-- 5. Create sample quote and application
INSERT INTO lease_quotes (employee_id, company_id, quote_number, vehicle_make, vehicle_model, vehicle_year, vehicle_price, lease_term, weekly_payment, total_cost, status, created_at)
SELECT 
    e.id,
    c.id,
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
FROM companies c, employees e 
WHERE c.name = 'Test Company Ltd' AND e.email = 'ben@millarX.com.au'
ON CONFLICT (quote_number) DO UPDATE SET
    vehicle_make = EXCLUDED.vehicle_make,
    vehicle_model = EXCLUDED.vehicle_model,
    vehicle_price = EXCLUDED.vehicle_price,
    status = EXCLUDED.status;

INSERT INTO lease_applications (employee_id, quote_id, application_number, employment_status, annual_salary, employment_start_date, status, created_at)
SELECT 
    e.id,
    q.id,
    'APP-TEST-001',
    'permanent',
    80000.00,
    '2020-01-01',
    'pending',
    NOW()
FROM employees e, lease_quotes q 
WHERE e.email = 'ben@millarX.com.au' AND q.quote_number = 'Q-TEST-001'
ON CONFLICT (application_number) DO UPDATE SET
    employment_status = EXCLUDED.employment_status,
    annual_salary = EXCLUDED.annual_salary,
    status = EXCLUDED.status;

-- ========================================
-- PART 3: VERIFICATION
-- ========================================

-- Check everything was created successfully
SELECT 'Portal Access' as check_type, count(*) as count FROM portal_access WHERE user_id = '95a6a2b2-e501-4bd7-9e85-004a38ab3c36'
UNION ALL
SELECT 'Companies', count(*) FROM companies WHERE name = 'Test Company Ltd'
UNION ALL  
SELECT 'Employees', count(*) FROM employees WHERE email = 'ben@millarX.com.au'
UNION ALL
SELECT 'Quotes', count(*) FROM lease_quotes WHERE quote_number = 'Q-TEST-001'
UNION ALL
SELECT 'Applications', count(*) FROM lease_applications WHERE application_number = 'APP-TEST-001'
UNION ALL
SELECT 'Lease Rates', count(*) FROM lease_rates;
