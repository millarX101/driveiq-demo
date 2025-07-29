-- Realistic Company Data for MXDriveIQ Demo
-- Company: TechFlow Solutions Pty Ltd (150 employees)
-- 3% novated uptake (4-5 employees), 15% of those are EV (1 EV)
-- 30% work from home 3 days a week (45 employees)
-- Commute patterns: 50% car, 25% car+train, 25% bike/walk

-- First, clear existing demo data
DELETE FROM commute_data WHERE user_id LIKE 'demo-%' OR user_id LIKE 'techflow-%';
DELETE FROM employee_vehicles WHERE user_id LIKE 'demo-%' OR user_id LIKE 'techflow-%';
DELETE FROM fleet_vehicles WHERE user_id LIKE 'demo-%' OR user_id LIKE 'techflow-%';
DELETE FROM carbon_purchases WHERE user_id LIKE 'demo-%' OR user_id LIKE 'techflow-%';
DELETE FROM sustainability_goals WHERE user_id LIKE 'demo-%' OR user_id LIKE 'techflow-%';
DELETE FROM company_settings WHERE user_id LIKE 'demo-%' OR user_id LIKE 'techflow-%';
DELETE FROM user_profiles WHERE user_id LIKE 'demo-%' OR user_id LIKE 'techflow-%';

-- Insert company profile (HR Manager)
INSERT INTO user_profiles (
  user_id,
  email,
  full_name,
  role,
  portal_type,
  company_name,
  phone,
  employee_id,
  created_at,
  updated_at
) VALUES (
  'techflow-hr-001',
  'hr@techflowsolutions.com.au',
  'Jennifer Walsh',
  'HR Director',
  'employer',
  'TechFlow Solutions Pty Ltd',
  '+61 2 8765 4321',
  'HR001',
  NOW(),
  NOW()
);

-- Insert company settings
INSERT INTO company_settings (
  user_id,
  company_name,
  industry,
  employee_count,
  fleet_size,
  state,
  average_salary,
  ev_target_percentage,
  created_at,
  updated_at
) VALUES (
  'techflow-hr-001',
  'TechFlow Solutions Pty Ltd',
  'Technology Services',
  150,
  5,
  'NSW',
  92000,
  25,
  NOW(),
  NOW()
);

-- Generate 150 employee profiles with realistic distribution
-- 4 employees with novated leases (3% uptake)
-- Employee 1: EV lease (Tesla Model 3)
INSERT INTO user_profiles (
  user_id,
  email,
  full_name,
  role,
  portal_type,
  company_name,
  phone,
  employee_id,
  created_at,
  updated_at
) VALUES (
  'techflow-emp-001',
  'sarah.chen@techflowsolutions.com.au',
  'Sarah Chen',
  'Senior Software Engineer',
  'employee',
  'TechFlow Solutions Pty Ltd',
  '+61 2 8765 4322',
  'EMP001',
  NOW(),
  NOW()
);

INSERT INTO employee_vehicles (
  user_id,
  vehicle_type,
  fuel_type,
  make,
  model,
  year,
  km_per_year,
  fuel_efficiency,
  business_use_percentage,
  has_novated_lease,
  monthly_lease_payment,
  lease_start_date,
  lease_end_date,
  created_at,
  updated_at
) VALUES (
  'techflow-emp-001',
  'Sedan',
  'EV',
  'Tesla',
  'Model 3',
  2024,
  18000,
  0,
  25,
  true,
  1150,
  '2024-03-01',
  '2027-03-01',
  NOW(),
  NOW()
);

-- Employee 2: Hybrid lease (Toyota RAV4)
INSERT INTO user_profiles (
  user_id,
  email,
  full_name,
  role,
  portal_type,
  company_name,
  phone,
  employee_id,
  created_at,
  updated_at
) VALUES (
  'techflow-emp-002',
  'michael.rodriguez@techflowsolutions.com.au',
  'Michael Rodriguez',
  'Product Manager',
  'employee',
  'TechFlow Solutions Pty Ltd',
  '+61 2 8765 4323',
  'EMP002',
  NOW(),
  NOW()
);

INSERT INTO employee_vehicles (
  user_id,
  vehicle_type,
  fuel_type,
  make,
  model,
  year,
  km_per_year,
  fuel_efficiency,
  business_use_percentage,
  has_novated_lease,
  monthly_lease_payment,
  lease_start_date,
  lease_end_date,
  created_at,
  updated_at
) VALUES (
  'techflow-emp-002',
  'SUV',
  'Hybrid',
  'Toyota',
  'RAV4 Hybrid',
  2023,
  22000,
  4.8,
  35,
  true,
  980,
  '2023-08-15',
  '2026-08-15',
  NOW(),
  NOW()
);

-- Employee 3: Petrol lease (Mazda CX-5)
INSERT INTO user_profiles (
  user_id,
  email,
  full_name,
  role,
  portal_type,
  company_name,
  phone,
  employee_id,
  created_at,
  updated_at
) VALUES (
  'techflow-emp-003',
  'emma.thompson@techflowsolutions.com.au',
  'Emma Thompson',
  'Marketing Director',
  'employee',
  'TechFlow Solutions Pty Ltd',
  '+61 2 8765 4324',
  'EMP003',
  NOW(),
  NOW()
);

INSERT INTO employee_vehicles (
  user_id,
  vehicle_type,
  fuel_type,
  make,
  model,
  year,
  km_per_year,
  fuel_efficiency,
  business_use_percentage,
  has_novated_lease,
  monthly_lease_payment,
  lease_start_date,
  lease_end_date,
  created_at,
  updated_at
) VALUES (
  'techflow-emp-003',
  'SUV',
  'Petrol',
  'Mazda',
  'CX-5',
  2023,
  20000,
  7.2,
  40,
  true,
  850,
  '2023-11-01',
  '2026-11-01',
  NOW(),
  NOW()
);

-- Employee 4: Diesel lease (Ford Ranger - field work)
INSERT INTO user_profiles (
  user_id,
  email,
  full_name,
  role,
  portal_type,
  company_name,
  phone,
  employee_id,
  created_at,
  updated_at
) VALUES (
  'techflow-emp-004',
  'james.wilson@techflowsolutions.com.au',
  'James Wilson',
  'Field Operations Manager',
  'employee',
  'TechFlow Solutions Pty Ltd',
  '+61 2 8765 4325',
  'EMP004',
  NOW(),
  NOW()
);

INSERT INTO employee_vehicles (
  user_id,
  vehicle_type,
  fuel_type,
  make,
  model,
  year,
  km_per_year,
  fuel_efficiency,
  business_use_percentage,
  has_novated_lease,
  monthly_lease_payment,
  lease_start_date,
  lease_end_date,
  created_at,
  updated_at
) VALUES (
  'techflow-emp-004',
  'Ute',
  'Diesel',
  'Ford',
  'Ranger',
  2024,
  28000,
  8.5,
  70,
  true,
  1200,
  '2024-01-15',
  '2027-01-15',
  NOW(),
  NOW()
);

-- Employee 5: Regular employee (no lease) - WFH 3 days, bike commuter
INSERT INTO user_profiles (
  user_id,
  email,
  full_name,
  role,
  portal_type,
  company_name,
  phone,
  employee_id,
  created_at,
  updated_at
) VALUES (
  'techflow-emp-005',
  'alex.kim@techflowsolutions.com.au',
  'Alex Kim',
  'UX Designer',
  'employee',
  'TechFlow Solutions Pty Ltd',
  '+61 2 8765 4326',
  'EMP005',
  NOW(),
  NOW()
);

-- Employee 6: Regular employee - car commuter
INSERT INTO user_profiles (
  user_id,
  email,
  full_name,
  role,
  portal_type,
  company_name,
  phone,
  employee_id,
  created_at,
  updated_at
) VALUES (
  'techflow-emp-006',
  'lisa.patel@techflowsolutions.com.au',
  'Lisa Patel',
  'Data Analyst',
  'employee',
  'TechFlow Solutions Pty Ltd',
  '+61 2 8765 4327',
  'EMP006',
  NOW(),
  NOW()
);

-- Employee 7: Regular employee - car+train commuter
INSERT INTO user_profiles (
  user_id,
  email,
  full_name,
  role,
  portal_type,
  company_name,
  phone,
  employee_id,
  created_at,
  updated_at
) VALUES (
  'techflow-emp-007',
  'david.nguyen@techflowsolutions.com.au',
  'David Nguyen',
  'DevOps Engineer',
  'employee',
  'TechFlow Solutions Pty Ltd',
  '+61 2 8765 4328',
  'EMP007',
  NOW(),
  NOW()
);

-- Add fleet vehicles for company overview
INSERT INTO fleet_vehicles (
  user_id,
  employee_id,
  employee_name,
  vehicle_type,
  fuel_type,
  make,
  model,
  km_per_year,
  fuel_efficiency,
  business_use,
  has_novated,
  monthly_payment,
  annual_package_reduction,
  lease_end,
  employee_salary,
  created_at,
  updated_at
) VALUES 
-- Tesla Model 3 (EV)
(
  'techflow-hr-001',
  'EMP001',
  'Sarah Chen',
  'Sedan',
  'EV',
  'Tesla',
  'Model 3',
  18000,
  0,
  25,
  true,
  1150,
  13800,
  '2027-03-01',
  105000,
  NOW(),
  NOW()
),
-- Toyota RAV4 Hybrid
(
  'techflow-hr-001',
  'EMP002',
  'Michael Rodriguez',
  'SUV',
  'Hybrid',
  'Toyota',
  'RAV4 Hybrid',
  22000,
  4.8,
  35,
  true,
  980,
  11760,
  '2026-08-15',
  98000,
  NOW(),
  NOW()
),
-- Mazda CX-5 Petrol
(
  'techflow-hr-001',
  'EMP003',
  'Emma Thompson',
  'SUV',
  'Petrol',
  'Mazda',
  'CX-5',
  20000,
  7.2,
  40,
  true,
  850,
  10200,
  '2026-11-01',
  115000,
  NOW(),
  NOW()
),
-- Ford Ranger Diesel
(
  'techflow-hr-001',
  'EMP004',
  'James Wilson',
  'Ute',
  'Diesel',
  'Ford',
  'Ranger',
  28000,
  8.5,
  70,
  true,
  1200,
  14400,
  '2027-01-15',
  88000,
  NOW(),
  NOW()
);

-- Generate realistic commute data for the past 2 weeks
-- Employee 1 (Sarah Chen) - EV owner, WFH 3 days, bike when in office
INSERT INTO commute_data (user_id, date, distance_km, transport_mode, fuel_cost, emissions_kg, created_at)
SELECT 
  'techflow-emp-001',
  date_series,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (1, 6, 0) THEN 0  -- WFH Mon, Sat, Sun
    WHEN EXTRACT(DOW FROM date_series) IN (2, 3) THEN 12.5  -- Bike Tue, Wed
    ELSE 12.5  -- Bike Thu, Fri
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (1, 6, 0) THEN 'wfh'
    ELSE 'bike'
  END,
  0,  -- No fuel cost for bike/WFH
  0,  -- No emissions for bike/WFH
  NOW()
FROM generate_series(
  CURRENT_DATE - INTERVAL '14 days',
  CURRENT_DATE - INTERVAL '1 day',
  INTERVAL '1 day'
) AS date_series;

-- Employee 2 (Michael Rodriguez) - Hybrid owner, car commuter
INSERT INTO commute_data (user_id, date, distance_km, transport_mode, fuel_cost, emissions_kg, created_at)
SELECT 
  'techflow-emp-002',
  date_series,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 0  -- Weekend
    ELSE 28.5  -- Daily commute
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 'wfh'
    ELSE 'car'
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 0
    ELSE 4.20  -- Fuel cost for hybrid
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 0
    ELSE 3.8  -- Lower emissions for hybrid
  END,
  NOW()
FROM generate_series(
  CURRENT_DATE - INTERVAL '14 days',
  CURRENT_DATE - INTERVAL '1 day',
  INTERVAL '1 day'
) AS date_series;

-- Employee 3 (Emma Thompson) - WFH 3 days, car+train commuter
INSERT INTO commute_data (user_id, date, distance_km, transport_mode, fuel_cost, emissions_kg, created_at)
SELECT 
  'techflow-emp-003',
  date_series,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (1, 3, 5) THEN 0  -- WFH Mon, Wed, Fri
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 0  -- Weekend
    ELSE 32.0  -- Car+train commute Tue, Thu
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (1, 3, 5, 6, 0) THEN 'wfh'
    ELSE 'car'  -- Simplified as car (represents car+train)
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (1, 3, 5, 6, 0) THEN 0
    ELSE 8.50  -- Car portion + train ticket
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (1, 3, 5, 6, 0) THEN 0
    ELSE 4.2  -- Mixed mode emissions
  END,
  NOW()
FROM generate_series(
  CURRENT_DATE - INTERVAL '14 days',
  CURRENT_DATE - INTERVAL '1 day',
  INTERVAL '1 day'
) AS date_series;

-- Employee 4 (James Wilson) - Field work, diesel ute, daily driver
INSERT INTO commute_data (user_id, date, distance_km, transport_mode, fuel_cost, emissions_kg, created_at)
SELECT 
  'techflow-emp-004',
  date_series,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 0  -- Weekend
    ELSE 45.0  -- Longer commute for field work
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 'wfh'
    ELSE 'car'
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 0
    ELSE 12.50  -- Higher fuel cost for diesel ute
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 0
    ELSE 11.8  -- Higher emissions for diesel
  END,
  NOW()
FROM generate_series(
  CURRENT_DATE - INTERVAL '14 days',
  CURRENT_DATE - INTERVAL '1 day',
  INTERVAL '1 day'
) AS date_series;

-- Employee 5 (Alex Kim) - WFH 3 days, bike commuter
INSERT INTO commute_data (user_id, date, distance_km, transport_mode, fuel_cost, emissions_kg, created_at)
SELECT 
  'techflow-emp-005',
  date_series,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (1, 3, 5) THEN 0  -- WFH Mon, Wed, Fri
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 0  -- Weekend
    ELSE 8.5  -- Bike commute Tue, Thu
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (1, 3, 5, 6, 0) THEN 'wfh'
    ELSE 'bike'
  END,
  0,  -- No fuel cost for bike/WFH
  0,  -- No emissions for bike/WFH
  NOW()
FROM generate_series(
  CURRENT_DATE - INTERVAL '14 days',
  CURRENT_DATE - INTERVAL '1 day',
  INTERVAL '1 day'
) AS date_series;

-- Employee 6 (Lisa Patel) - Full-time office, car commuter
INSERT INTO commute_data (user_id, date, distance_km, transport_mode, fuel_cost, emissions_kg, created_at)
SELECT 
  'techflow-emp-006',
  date_series,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 0  -- Weekend
    ELSE 22.0  -- Daily car commute
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 'wfh'
    ELSE 'car'
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 0
    ELSE 6.80  -- Petrol cost
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 0
    ELSE 4.6  -- Standard petrol car emissions
  END,
  NOW()
FROM generate_series(
  CURRENT_DATE - INTERVAL '14 days',
  CURRENT_DATE - INTERVAL '1 day',
  INTERVAL '1 day'
) AS date_series;

-- Employee 7 (David Nguyen) - Car+train commuter
INSERT INTO commute_data (user_id, date, distance_km, transport_mode, fuel_cost, emissions_kg, created_at)
SELECT 
  'techflow-emp-007',
  date_series,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 0  -- Weekend
    ELSE 35.0  -- Car to station + train
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 'wfh'
    ELSE 'train'  -- Represents mixed mode
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 0
    ELSE 9.20  -- Car fuel + train ticket
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series) IN (6, 0) THEN 0
    ELSE 3.2  -- Lower emissions due to train portion
  END,
  NOW()
FROM generate_series(
  CURRENT_DATE - INTERVAL '14 days',
  CURRENT_DATE - INTERVAL '1 day',
  INTERVAL '1 day'
) AS date_series;

-- Add sustainability goals for some employees
INSERT INTO sustainability_goals (
  user_id,
  goal_type,
  target_value,
  current_value,
  target_date,
  created_at,
  updated_at
) VALUES 
-- Sarah Chen (EV owner) - already achieving low emissions
(
  'techflow-emp-001',
  'reduce_emissions',
  200,
  180,
  '2025-12-31',
  NOW(),
  NOW()
),
-- Michael Rodriguez - wants to increase WFH
(
  'techflow-emp-002',
  'increase_wfh',
  40,
  20,
  '2025-06-30',
  NOW(),
  NOW()
),
-- Alex Kim - bike commuter goal
(
  'techflow-emp-005',
  'reduce_emissions',
  150,
  120,
  '2025-12-31',
  NOW(),
  NOW()
);

-- Add carbon purchases for the company
INSERT INTO carbon_purchases (
  user_id,
  date,
  tonnes,
  cost_per_tonne,
  total_cost,
  status,
  created_at,
  updated_at
) VALUES 
(
  'techflow-hr-001',
  '2025-01-15',
  45.8,
  35,
  1603.00,
  'completed',
  NOW(),
  NOW()
),
(
  'techflow-hr-001',
  '2024-12-10',
  52.3,
  34,
  1778.20,
  'completed',
  NOW(),
  NOW()
),
(
  'techflow-hr-001',
  '2024-11-05',
  38.9,
  36,
  1400.40,
  'completed',
  NOW(),
  NOW()
);

-- Add demo authentication credentials for easy login
-- Note: In production, these would be created through Supabase Auth
-- For demo purposes, we'll create user profiles that can be used with simple login

-- Demo Login Credentials for TechFlow Solutions:

-- EMPLOYEE LOGINS:
-- Username: sarah.chen@techflowsolutions.com.au | Password: demo123
-- Username: michael.rodriguez@techflowsolutions.com.au | Password: demo123
-- Username: emma.thompson@techflowsolutions.com.au | Password: demo123
-- Username: james.wilson@techflowsolutions.com.au | Password: demo123
-- Username: alex.kim@techflowsolutions.com.au | Password: demo123
-- Username: lisa.patel@techflowsolutions.com.au | Password: demo123
-- Username: david.nguyen@techflowsolutions.com.au | Password: demo123

-- EMPLOYER LOGIN:
-- Username: hr@techflowsolutions.com.au | Password: admin123

-- MXDEALER LOGIN:
-- Username: dealer@mxdriveiq.com.au | Password: dealer123

-- ADMIN LOGIN:
-- Username: admin@mxdriveiq.com.au | Password: admin123

-- Summary statistics for the demo:
-- Total employees: 150 (7 detailed profiles created as examples)
-- Novated lease uptake: 4 employees (2.7% - close to 3%)
-- EV adoption: 1 out of 4 leases (25% - higher than 15% to show progress)
-- WFH patterns: 3 employees WFH 3 days/week (represented in commute data)
-- Commute patterns: Mix of car (50%), car+train (25%), bike/walk (25%)
-- Realistic emissions and costs based on Australian data
