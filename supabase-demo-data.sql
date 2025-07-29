-- Demo Company Data for MXDriveIQ
-- This script populates the database with realistic demo data for testing

-- Insert demo company profile
INSERT INTO user_profiles (
  user_id,
  email,
  full_name,
  role,
  portal_type,
  company_name,
  phone,
  created_at,
  updated_at
) VALUES (
  'demo-employer-123',
  'hr@company.com',
  'Demo Manager',
  'Fleet Manager',
  'employer',
  'Demo Company Pty Ltd',
  '+61 2 9876 5432',
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  portal_type = EXCLUDED.portal_type,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Insert demo employee profile
INSERT INTO user_profiles (
  user_id,
  email,
  full_name,
  role,
  portal_type,
  company_name,
  phone,
  created_at,
  updated_at
) VALUES (
  'demo-employee-123',
  'employee@company.com',
  'Demo Employee',
  'Software Engineer',
  'employee',
  'Demo Company Pty Ltd',
  '+61 2 9876 5433',
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  portal_type = EXCLUDED.portal_type,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Insert demo fleet vehicles
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
(
  'demo-employer-123',
  'EMP001',
  'Sarah Johnson',
  'Sedan',
  'EV',
  'Tesla',
  'Model 3',
  12000,
  0,
  25,
  true,
  890,
  10680,
  '2026-01-15',
  95000,
  NOW(),
  NOW()
),
(
  'demo-employer-123',
  'EMP002',
  'David Park',
  'SUV',
  'Hybrid',
  'Toyota',
  'RAV4 Hybrid',
  18000,
  5.2,
  40,
  true,
  1150,
  13800,
  '2025-08-20',
  78000,
  NOW(),
  NOW()
),
(
  'demo-employer-123',
  'EMP003',
  'Emma Wilson',
  'Sedan',
  'Petrol',
  'Holden',
  'Commodore',
  22000,
  8.5,
  60,
  false,
  0,
  0,
  NULL,
  72000,
  NOW(),
  NOW()
),
(
  'demo-employer-123',
  'EMP004',
  'James Chen',
  'Ute',
  'Diesel',
  'Ford',
  'Ranger',
  25000,
  9.2,
  80,
  true,
  1300,
  15600,
  '2025-12-10',
  88000,
  NOW(),
  NOW()
),
(
  'demo-employer-123',
  'EMP005',
  'Lisa Wong',
  'Sedan',
  'EV',
  'BMW',
  'i4',
  15000,
  0,
  30,
  true,
  1050,
  12600,
  '2026-03-20',
  92000,
  NOW(),
  NOW()
);

-- Insert demo carbon purchases
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
  'demo-employer-123',
  '2025-01-15',
  25.5,
  35,
  892.50,
  'completed',
  NOW(),
  NOW()
),
(
  'demo-employer-123',
  '2024-12-20',
  18.2,
  35,
  637.00,
  'completed',
  NOW(),
  NOW()
),
(
  'demo-employer-123',
  '2024-11-10',
  30.0,
  34,
  1020.00,
  'completed',
  NOW(),
  NOW()
);

-- Insert demo employee vehicle data
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
  'demo-employee-123',
  'Sedan',
  'Hybrid',
  'Toyota',
  'Camry Hybrid',
  2023,
  15000,
  4.2,
  20,
  true,
  750,
  '2023-06-01',
  '2026-06-01',
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  vehicle_type = EXCLUDED.vehicle_type,
  fuel_type = EXCLUDED.fuel_type,
  make = EXCLUDED.make,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  km_per_year = EXCLUDED.km_per_year,
  fuel_efficiency = EXCLUDED.fuel_efficiency,
  business_use_percentage = EXCLUDED.business_use_percentage,
  has_novated_lease = EXCLUDED.has_novated_lease,
  monthly_lease_payment = EXCLUDED.monthly_lease_payment,
  lease_start_date = EXCLUDED.lease_start_date,
  lease_end_date = EXCLUDED.lease_end_date,
  updated_at = NOW();

-- Insert demo commute data
INSERT INTO commute_data (
  user_id,
  date,
  distance_km,
  transport_mode,
  fuel_cost,
  emissions_kg,
  created_at
) VALUES 
('demo-employee-123', CURRENT_DATE - INTERVAL '1 day', 45.2, 'car', 8.50, 10.2, NOW()),
('demo-employee-123', CURRENT_DATE - INTERVAL '2 days', 45.2, 'car', 8.50, 10.2, NOW()),
('demo-employee-123', CURRENT_DATE - INTERVAL '3 days', 45.2, 'car', 8.50, 10.2, NOW()),
('demo-employee-123', CURRENT_DATE - INTERVAL '4 days', 45.2, 'car', 8.50, 10.2, NOW()),
('demo-employee-123', CURRENT_DATE - INTERVAL '5 days', 45.2, 'car', 8.50, 10.2, NOW()),
('demo-employee-123', CURRENT_DATE - INTERVAL '6 days', 0, 'wfh', 0, 0, NOW()),
('demo-employee-123', CURRENT_DATE - INTERVAL '7 days', 0, 'wfh', 0, 0, NOW()),
('demo-employee-123', CURRENT_DATE - INTERVAL '8 days', 45.2, 'car', 8.50, 10.2, NOW()),
('demo-employee-123', CURRENT_DATE - INTERVAL '9 days', 45.2, 'car', 8.50, 10.2, NOW()),
('demo-employee-123', CURRENT_DATE - INTERVAL '10 days', 45.2, 'car', 8.50, 10.2, NOW());

-- Insert demo sustainability goals
INSERT INTO sustainability_goals (
  user_id,
  goal_type,
  target_value,
  current_value,
  target_date,
  created_at,
  updated_at
) VALUES 
(
  'demo-employee-123',
  'reduce_emissions',
  500,
  320,
  '2025-12-31',
  NOW(),
  NOW()
),
(
  'demo-employee-123',
  'increase_wfh',
  40,
  25,
  '2025-06-30',
  NOW(),
  NOW()
) ON CONFLICT (user_id, goal_type) DO UPDATE SET
  target_value = EXCLUDED.target_value,
  current_value = EXCLUDED.current_value,
  target_date = EXCLUDED.target_date,
  updated_at = NOW();

-- Insert demo company settings
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
  'demo-employer-123',
  'Demo Company Pty Ltd',
  'Technology',
  247,
  5,
  'NSW',
  85000,
  50,
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  industry = EXCLUDED.industry,
  employee_count = EXCLUDED.employee_count,
  fleet_size = EXCLUDED.fleet_size,
  state = EXCLUDED.state,
  average_salary = EXCLUDED.average_salary,
  ev_target_percentage = EXCLUDED.ev_target_percentage,
  updated_at = NOW();
