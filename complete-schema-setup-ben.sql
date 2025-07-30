-- Complete Schema Setup for Ben Millar - MXDealerAdvantage Platform
-- This script creates ALL necessary tables and data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. CREATE BASE TABLES (from supabase-setup.sql)
-- =============================================

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    employee_count INTEGER DEFAULT 0,
    grey_fleet_completion DECIMAL(5,2) DEFAULT 0,
    total_leases INTEGER DEFAULT 0,
    ev_leases INTEGER DEFAULT 0,
    carbon_saved DECIMAL(10,2) DEFAULT 0,
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
    has_ev BOOLEAN DEFAULT FALSE,
    has_novated_lease BOOLEAN DEFAULT FALSE,
    annual_salary DECIMAL(10,2),
    primary_transport VARCHAR(50) DEFAULT 'Petrol Car',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table (for grey fleet and novated leases)
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(100),
    make VARCHAR(50),
    model VARCHAR(50),
    year INTEGER,
    fuel_type VARCHAR(20) CHECK (fuel_type IN ('Petrol', 'Diesel', 'Hybrid', 'EV')),
    annual_km INTEGER,
    business_use_percentage DECIMAL(5,2),
    is_novated_lease BOOLEAN DEFAULT FALSE,
    lease_start_date DATE,
    lease_end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transport logs table (daily commuting data)
CREATE TABLE IF NOT EXISTS transport_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    transport_method VARCHAR(50) CHECK (transport_method IN ('EV', 'Hybrid', 'Petrol Car', 'Diesel Car', 'Public Transport', 'Cycling', 'Walking', 'Motorcycle')),
    distance_km DECIMAL(6,2),
    emissions_kg DECIMAL(8,4),
    cost_aud DECIMAL(8,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. CREATE MULTI-PORTAL TABLES
-- =============================================

-- Portal Access Control Table
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

-- Quote Management Table
CREATE TABLE IF NOT EXISTS lease_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    quote_data JSONB NOT NULL,
    vehicle_data JSONB DEFAULT '{}',
    financial_data JSONB DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'expired')),
    quote_number TEXT UNIQUE,
    valid_until DATE,
    created_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application Tracking Table
CREATE TABLE IF NOT EXISTS lease_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES lease_quotes(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    application_data JSONB NOT NULL,
    pdf_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'cancelled')),
    application_number TEXT UNIQUE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate Management Table
CREATE TABLE IF NOT EXISTS lease_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rate_type TEXT NOT NULL CHECK (rate_type IN ('interest', 'residual', 'admin_fee', 'broker_fee')),
    vehicle_category TEXT,
    rate_value DECIMAL(8,4) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. CREATE BEN'S TEST DATA
-- =============================================

-- Create test company (using proper UUIDs)
INSERT INTO companies (id, name)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Test Company Ltd'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name;

-- Update additional columns if they exist (skip columns that don't exist)
-- UPDATE companies SET 
--     employee_count = 50,
--     grey_fleet_completion = 85.0,
--     total_leases = 25,
--     ev_leases = 15,
--     carbon_saved = 12.5
-- WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Add Ben as an employee
INSERT INTO employees (
    id,
    company_id, 
    name, 
    email, 
    department, 
    has_ev, 
    has_novated_lease, 
    annual_salary,
    primary_transport
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Ben Millar',
    'ben@millarX.com.au',
    'Technology',
    true,
    true,
    80000.00,
    'EV'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    department = EXCLUDED.department,
    annual_salary = EXCLUDED.annual_salary;

-- Add portal access for Ben Millar (all 4 portals)
INSERT INTO portal_access (user_id, portal_type, company_id, permissions, is_active)
VALUES 
    ('95a6a2b2-e501-4bd7-9e85-004a38ab3c36', 'admin', NULL, '{"manage_users": true, "manage_rates": true, "view_all_data": true, "system_admin": true}', true),
    ('95a6a2b2-e501-4bd7-9e85-004a38ab3c36', 'employer', '550e8400-e29b-41d4-a716-446655440000', '{"company_name": "Test Company Ltd", "manage_employees": true}', true),
    ('95a6a2b2-e501-4bd7-9e85-004a38ab3c36', 'employee', '550e8400-e29b-41d4-a716-446655440000', '{"company_name": "Test Company Ltd", "can_apply": true}', true),
    ('95a6a2b2-e501-4bd7-9e85-004a38ab3c36', 'mxdealer', NULL, '{"dealership_name": "Test Motors", "territory": "Melbourne", "tier": "Gold"}', true)
ON CONFLICT (user_id, portal_type, company_id) DO UPDATE SET
    permissions = EXCLUDED.permissions,
    is_active = EXCLUDED.is_active;

-- Insert default lease rates
INSERT INTO lease_rates (rate_type, vehicle_category, rate_value, effective_from, is_active) VALUES
('interest', 'sedan', 0.0599, CURRENT_DATE, true),
('interest', 'suv', 0.0649, CURRENT_DATE, true),
('interest', 'ev', 0.0549, CURRENT_DATE, true),
('interest', 'luxury', 0.0699, CURRENT_DATE, true),
('residual', 'sedan', 0.4650, CURRENT_DATE, true),
('residual', 'suv', 0.4650, CURRENT_DATE, true),
('residual', 'ev', 0.4650, CURRENT_DATE, true),
('residual', 'luxury', 0.4650, CURRENT_DATE, true),
('admin_fee', NULL, 495.00, CURRENT_DATE, true),
('broker_fee', NULL, 990.00, CURRENT_DATE, true)
ON CONFLICT DO NOTHING;

-- Create a sample quote for Ben
INSERT INTO lease_quotes (
    employee_id,
    company_id,
    quote_data,
    vehicle_data,
    financial_data,
    status,
    quote_number,
    valid_until,
    created_by
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    '{"vehicle_make": "Tesla", "vehicle_model": "Model 3", "vehicle_year": 2024, "vehicle_price": 65000}',
    '{"make": "Tesla", "model": "Model 3", "year": 2024, "fuel_type": "Electric", "category": "ev"}',
    '{"weekly_payment": 450.00, "total_cost": 70200.00, "lease_term": 36, "residual_value": 29250.00}',
    'draft',
    'Q-TEST-001',
    CURRENT_DATE + INTERVAL '30 days',
    '95a6a2b2-e501-4bd7-9e85-004a38ab3c36'
) ON CONFLICT (quote_number) DO UPDATE SET
    quote_data = EXCLUDED.quote_data,
    vehicle_data = EXCLUDED.vehicle_data,
    financial_data = EXCLUDED.financial_data,
    status = EXCLUDED.status;

-- Create a sample application for the quote
INSERT INTO lease_applications (
    quote_id,
    employee_id,
    application_data,
    status,
    application_number
) SELECT 
    lq.id,
    '550e8400-e29b-41d4-a716-446655440001',
    '{"employment_status": "permanent", "annual_salary": 80000, "employment_start_date": "2020-01-01", "license_number": "12345678", "license_state": "VIC"}',
    'pending',
    'APP-TEST-001'
FROM lease_quotes lq 
WHERE lq.quote_number = 'Q-TEST-001'
ON CONFLICT (application_number) DO UPDATE SET
    application_data = EXCLUDED.application_data,
    status = EXCLUDED.status;

-- Add Ben's vehicle to the vehicles table
INSERT INTO vehicles (
    id,
    employee_id,
    vehicle_type,
    make,
    model,
    year,
    fuel_type,
    annual_km,
    business_use_percentage,
    is_novated_lease,
    lease_start_date,
    lease_end_date
) VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'Electric Vehicle',
    'Tesla',
    'Model 3',
    2024,
    'EV',
    15000,
    25.00,
    true,
    CURRENT_DATE - INTERVAL '6 months',
    CURRENT_DATE + INTERVAL '30 months'
) ON CONFLICT (id) DO UPDATE SET
    make = EXCLUDED.make,
    model = EXCLUDED.model,
    year = EXCLUDED.year,
    fuel_type = EXCLUDED.fuel_type;

-- =============================================
-- 4. CREATE VIEWS FOR DASHBOARD
-- =============================================

-- View for active quotes with employee details
CREATE OR REPLACE VIEW active_quotes_view AS
SELECT 
    lq.*,
    e.name as employee_name,
    e.email as employee_email,
    c.name as company_name
FROM lease_quotes lq
JOIN employees e ON lq.employee_id = e.id
JOIN companies c ON lq.company_id = c.id
WHERE lq.status IN ('draft', 'submitted', 'approved');

-- View for pending applications
CREATE OR REPLACE VIEW pending_applications_view AS
SELECT 
    la.*,
    lq.quote_number,
    e.name as employee_name,
    e.email as employee_email,
    c.name as company_name
FROM lease_applications la
JOIN lease_quotes lq ON la.quote_id = lq.id
JOIN employees e ON la.employee_id = e.id
JOIN companies c ON lq.company_id = c.id
WHERE la.status = 'pending';

-- View for current rates
CREATE OR REPLACE VIEW current_rates_view AS
SELECT *
FROM lease_rates
WHERE is_active = true
AND (effective_to IS NULL OR effective_to >= CURRENT_DATE)
AND effective_from <= CURRENT_DATE;

-- =============================================
-- 5. VERIFICATION
-- =============================================

-- Check everything was created successfully
SELECT 'Portal Access' as check_type, count(*) as count 
FROM portal_access WHERE user_id = '95a6a2b2-e501-4bd7-9e85-004a38ab3c36'
UNION ALL
SELECT 'Companies', count(*) FROM companies WHERE name = 'Test Company Ltd'
UNION ALL  
SELECT 'Employees', count(*) FROM employees WHERE email = 'ben@millarX.com.au'
UNION ALL
SELECT 'Quotes', count(*) FROM lease_quotes WHERE quote_number = 'Q-TEST-001'
UNION ALL
SELECT 'Applications', count(*) FROM lease_applications WHERE application_number = 'APP-TEST-001'
UNION ALL
SELECT 'Lease Rates', count(*) FROM lease_rates WHERE is_active = true
UNION ALL
SELECT 'Vehicles', count(*) FROM vehicles WHERE employee_id = '550e8400-e29b-41d4-a716-446655440001';
