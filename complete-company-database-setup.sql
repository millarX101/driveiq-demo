-- Complete Company Database Setup for MXDriveIQ
-- This creates a full company with 150 employees and all necessary data structures

-- First, ensure we have the correct schema
DROP TABLE IF EXISTS portal_access CASCADE;
DROP TABLE IF EXISTS commute_data CASCADE;
DROP TABLE IF EXISTS employee_vehicles CASCADE;
DROP TABLE IF EXISTS sustainability_goals CASCADE;
DROP TABLE IF EXISTS company_settings CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS carbon_purchases CASCADE;
DROP TABLE IF EXISTS fleet_vehicles CASCADE;

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    industry TEXT,
    employee_count INTEGER,
    state TEXT DEFAULT 'NSW',
    avg_salary DECIMAL(10,2) DEFAULT 85000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees table
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    employee_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    position TEXT,
    department TEXT,
    salary DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (for authentication integration)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE, -- This matches Supabase auth user ID
    employee_id TEXT,
    full_name TEXT,
    email TEXT,
    company_name TEXT,
    company_id UUID REFERENCES companies(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portal access table
CREATE TABLE portal_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    company_id UUID REFERENCES companies(id),
    portal_type TEXT NOT NULL CHECK (portal_type IN ('employee', 'employer', 'mxdealer', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee vehicles table (from Employee Dashboard)
CREATE TABLE employee_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    employee_id TEXT,
    make TEXT,
    model TEXT,
    year INTEGER,
    fuel_type TEXT CHECK (fuel_type IN ('petrol', 'diesel', 'hybrid', 'electric')),
    monthly_lease_payment DECIMAL(10,2),
    lease_end_date DATE,
    is_novated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commute data table (from Employee Dashboard)
CREATE TABLE commute_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    employee_id TEXT,
    date DATE NOT NULL,
    distance_km DECIMAL(8,2),
    transport_mode TEXT,
    fuel_cost DECIMAL(8,2),
    emissions_kg DECIMAL(8,3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sustainability goals table (from Employee Dashboard)
CREATE TABLE sustainability_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    employee_id TEXT,
    goal_type TEXT,
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2),
    target_date DATE,
    is_achieved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company settings table (from Employee Dashboard)
CREATE TABLE company_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- HR manager user ID
    company_id UUID REFERENCES companies(id),
    ev_target_percentage INTEGER DEFAULT 50,
    carbon_budget DECIMAL(12,2),
    reporting_frequency TEXT DEFAULT 'monthly',
    settings_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fleet vehicles table (from Employer Dashboard)
CREATE TABLE fleet_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- Manager user ID
    company_id UUID REFERENCES companies(id),
    employee_id TEXT,
    employee_name TEXT,
    vehicle_type TEXT,
    fuel_type TEXT,
    make TEXT,
    model TEXT,
    km_per_year INTEGER,
    fuel_efficiency DECIMAL(5,2),
    business_use INTEGER,
    has_novated BOOLEAN DEFAULT false,
    monthly_payment DECIMAL(10,2),
    annual_package_reduction DECIMAL(10,2),
    lease_end DATE,
    employee_salary DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carbon purchases table (from Employer Dashboard)
CREATE TABLE carbon_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    company_id UUID REFERENCES companies(id),
    date DATE NOT NULL,
    tonnes DECIMAL(8,2),
    cost_per_tonne DECIMAL(8,2),
    total_cost DECIMAL(10,2),
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the main company
INSERT INTO companies (id, name, industry, employee_count, state, avg_salary) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'TechFlow Solutions Pty Ltd', 'Technology', 150, 'NSW', 85000);

-- Insert Ben Millar as the HR/Fleet Manager
INSERT INTO user_profiles (user_id, employee_id, full_name, email, company_name, company_id) VALUES 
('ben-millar-manager', 'TF-HR-001', 'Ben Millar', 'ben@millarx.com', 'TechFlow Solutions Pty Ltd', '550e8400-e29b-41d4-a716-446655440000');

-- Insert portal access for Ben Millar
INSERT INTO portal_access (user_id, company_id, portal_type, is_active) VALUES 
('ben-millar-manager', '550e8400-e29b-41d4-a716-446655440000', 'employer', true);

-- Insert company settings for Ben's company
INSERT INTO company_settings (user_id, company_id, ev_target_percentage, carbon_budget, settings_json) VALUES 
('ben-millar-manager', '550e8400-e29b-41d4-a716-446655440000', 50, 250000.00, '{"notifications": true, "auto_reporting": true}');

-- Insert 150 employees with realistic Australian names and data
INSERT INTO employees (company_id, employee_id, name, email, position, department, salary) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'TF-001', 'Sarah Chen', 'sarah.chen@techflow.com.au', 'Senior Developer', 'Engineering', 95000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-002', 'Michael Thompson', 'michael.thompson@techflow.com.au', 'Product Manager', 'Product', 105000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-003', 'Emma Wilson', 'emma.wilson@techflow.com.au', 'UX Designer', 'Design', 78000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-004', 'James Park', 'james.park@techflow.com.au', 'DevOps Engineer', 'Engineering', 88000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-005', 'Lisa Rodriguez', 'lisa.rodriguez@techflow.com.au', 'Marketing Manager', 'Marketing', 82000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-006', 'David Kim', 'david.kim@techflow.com.au', 'Sales Director', 'Sales', 120000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-007', 'Rachel Green', 'rachel.green@techflow.com.au', 'HR Specialist', 'Human Resources', 72000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-008', 'Tom Anderson', 'tom.anderson@techflow.com.au', 'Finance Manager', 'Finance', 90000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-009', 'Sophie Taylor', 'sophie.taylor@techflow.com.au', 'Junior Developer', 'Engineering', 65000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-010', 'Alex Johnson', 'alex.johnson@techflow.com.au', 'QA Engineer', 'Engineering', 75000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-011', 'Maria Santos', 'maria.santos@techflow.com.au', 'Content Writer', 'Marketing', 58000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-012', 'Chris Lee', 'chris.lee@techflow.com.au', 'System Administrator', 'IT', 80000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-013', 'Jennifer Brown', 'jennifer.brown@techflow.com.au', 'Business Analyst', 'Product', 85000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-014', 'Ryan O''Connor', 'ryan.oconnor@techflow.com.au', 'Lead Developer', 'Engineering', 110000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-015', 'Amanda White', 'amanda.white@techflow.com.au', 'Customer Success', 'Support', 68000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-016', 'Daniel Martinez', 'daniel.martinez@techflow.com.au', 'Data Scientist', 'Analytics', 98000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-017', 'Kate Mitchell', 'kate.mitchell@techflow.com.au', 'Office Manager', 'Operations', 62000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-018', 'Ben Davis', 'ben.davis@techflow.com.au', 'Security Engineer', 'Engineering', 92000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-019', 'Olivia Turner', 'olivia.turner@techflow.com.au', 'Graphic Designer', 'Design', 70000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-020', 'Mark Wilson', 'mark.wilson@techflow.com.au', 'Sales Representative', 'Sales', 75000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-021', 'Jessica Adams', 'jessica.adams@techflow.com.au', 'Project Manager', 'Operations', 88000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-022', 'Andrew Clark', 'andrew.clark@techflow.com.au', 'Mobile Developer', 'Engineering', 87000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-023', 'Hannah Lewis', 'hannah.lewis@techflow.com.au', 'Social Media Manager', 'Marketing', 65000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-024', 'Luke Robinson', 'luke.robinson@techflow.com.au', 'Technical Writer', 'Documentation', 72000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-025', 'Grace Walker', 'grace.walker@techflow.com.au', 'Accountant', 'Finance', 78000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-026', 'Nathan Hall', 'nathan.hall@techflow.com.au', 'Frontend Developer', 'Engineering', 82000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-027', 'Chloe Young', 'chloe.young@techflow.com.au', 'Recruitment Specialist', 'Human Resources', 70000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-028', 'Jacob King', 'jacob.king@techflow.com.au', 'Backend Developer', 'Engineering', 89000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-029', 'Mia Wright', 'mia.wright@techflow.com.au', 'Legal Counsel', 'Legal', 125000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-030', 'Ethan Scott', 'ethan.scott@techflow.com.au', 'Cloud Architect', 'Engineering', 115000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-031', 'Zoe Green', 'zoe.green@techflow.com.au', 'Product Designer', 'Design', 85000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-032', 'Connor Adams', 'connor.adams@techflow.com.au', 'Sales Engineer', 'Sales', 95000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-033', 'Ava Baker', 'ava.baker@techflow.com.au', 'Operations Manager', 'Operations', 92000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-034', 'Mason Hill', 'mason.hill@techflow.com.au', 'Database Administrator', 'IT', 85000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-035', 'Lily Campbell', 'lily.campbell@techflow.com.au', 'Customer Support', 'Support', 55000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-036', 'Owen Mitchell', 'owen.mitchell@techflow.com.au', 'Machine Learning Engineer', 'Analytics', 105000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-037', 'Ruby Carter', 'ruby.carter@techflow.com.au', 'Event Coordinator', 'Marketing', 62000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-038', 'Liam Roberts', 'liam.roberts@techflow.com.au', 'Full Stack Developer', 'Engineering', 90000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-039', 'Ella Phillips', 'ella.phillips@techflow.com.au', 'Brand Manager', 'Marketing', 88000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-040', 'Noah Evans', 'noah.evans@techflow.com.au', 'Site Reliability Engineer', 'Engineering', 98000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-041', 'Isabella Turner', 'isabella.turner@techflow.com.au', 'Training Coordinator', 'Human Resources', 68000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-042', 'William Collins', 'william.collins@techflow.com.au', 'Solutions Architect', 'Engineering', 120000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-043', 'Charlotte Stewart', 'charlotte.stewart@techflow.com.au', 'Compliance Officer', 'Legal', 85000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-044', 'James Morris', 'james.morris@techflow.com.au', 'Performance Engineer', 'Engineering', 95000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-045', 'Amelia Cook', 'amelia.cook@techflow.com.au', 'Partnership Manager', 'Business Development', 90000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-046', 'Benjamin Rogers', 'benjamin.rogers@techflow.com.au', 'API Developer', 'Engineering', 88000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-047', 'Harper Reed', 'harper.reed@techflow.com.au', 'Digital Marketing Specialist', 'Marketing', 72000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-048', 'Logan Bailey', 'logan.bailey@techflow.com.au', 'Infrastructure Engineer', 'IT', 92000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-049', 'Evelyn Cooper', 'evelyn.cooper@techflow.com.au', 'Research Analyst', 'Analytics', 78000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-050', 'Lucas Richardson', 'lucas.richardson@techflow.com.au', 'Scrum Master', 'Operations', 85000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-051', 'Abigail Cox', 'abigail.cox@techflow.com.au', 'Technical Support', 'Support', 62000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-052', 'Henry Ward', 'henry.ward@techflow.com.au', 'Senior Sales Manager', 'Sales', 110000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-053', 'Victoria Torres', 'victoria.torres@techflow.com.au', 'UI/UX Designer', 'Design', 82000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-054', 'Sebastian Peterson', 'sebastian.peterson@techflow.com.au', 'Automation Engineer', 'Engineering', 94000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-055', 'Scarlett Gray', 'scarlett.gray@techflow.com.au', 'Content Strategist', 'Marketing', 75000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-056', 'Jack Ramirez', 'jack.ramirez@techflow.com.au', 'Network Engineer', 'IT', 87000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-057', 'Madison James', 'madison.james@techflow.com.au', 'Business Intelligence Analyst', 'Analytics', 83000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-058', 'Aiden Watson', 'aiden.watson@techflow.com.au', 'Integration Developer', 'Engineering', 91000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-059', 'Layla Brooks', 'layla.brooks@techflow.com.au', 'Facilities Manager', 'Operations', 70000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-060', 'Carter Kelly', 'carter.kelly@techflow.com.au', 'Senior QA Engineer', 'Engineering', 89000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-061', 'Penelope Sanders', 'penelope.sanders@techflow.com.au', 'Payroll Specialist', 'Finance', 65000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-062', 'Wyatt Price', 'wyatt.price@techflow.com.au', 'Platform Engineer', 'Engineering', 96000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-063', 'Nora Bennett', 'nora.bennett@techflow.com.au', 'Employee Relations', 'Human Resources', 73000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-064', 'Grayson Wood', 'grayson.wood@techflow.com.au', 'Data Engineer', 'Analytics', 93000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-065', 'Hazel Barnes', 'hazel.barnes@techflow.com.au', 'Customer Experience Manager', 'Support', 85000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-066', 'Maverick Ross', 'maverick.ross@techflow.com.au', 'Blockchain Developer', 'Engineering', 105000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-067', 'Violet Henderson', 'violet.henderson@techflow.com.au', 'PR Specialist', 'Marketing', 68000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-068', 'Easton Coleman', 'easton.coleman@techflow.com.au', 'Release Manager', 'Operations', 88000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-069', 'Aurora Jenkins', 'aurora.jenkins@techflow.com.au', 'Financial Analyst', 'Finance', 80000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-070', 'Kai Perry', 'kai.perry@techflow.com.au', 'Game Developer', 'Engineering', 85000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-071', 'Savannah Powell', 'savannah.powell@techflow.com.au', 'Vendor Manager', 'Procurement', 78000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-072', 'Brayden Long', 'brayden.long@techflow.com.au', 'Security Analyst', 'IT', 86000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-073', 'Leah Hughes', 'leah.hughes@techflow.com.au', 'Learning & Development', 'Human Resources', 75000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-074', 'Declan Flores', 'declan.flores@techflow.com.au', 'IoT Developer', 'Engineering', 92000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-075', 'Kinsley Washington', 'kinsley.washington@techflow.com.au', 'Market Research Analyst', 'Marketing', 72000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-076', 'Jaxon Butler', 'jaxon.butler@techflow.com.au', 'Test Automation Engineer', 'Engineering', 87000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-077', 'Paisley Simmons', 'paisley.simmons@techflow.com.au', 'Executive Assistant', 'Operations', 68000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-078', 'Ryder Foster', 'ryder.foster@techflow.com.au', 'Principal Engineer', 'Engineering', 130000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-079', 'Skylar Gonzales', 'skylar.gonzales@techflow.com.au', 'Diversity & Inclusion Officer', 'Human Resources', 82000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-080', 'Jude Bryant', 'jude.bryant@techflow.com.au', 'AR/VR Developer', 'Engineering', 98000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-081', 'Piper Alexander', 'piper.alexander@techflow.com.au', 'SEO Specialist', 'Marketing', 65000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-082', 'Knox Russell', 'knox.russell@techflow.com.au', 'Embedded Systems Engineer', 'Engineering', 95000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-083', 'Emery Griffin', 'emery.griffin@techflow.com.au', 'Budget Analyst', 'Finance', 76000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-084', 'Phoenix Diaz', 'phoenix.diaz@techflow.com.au', 'Technical Lead', 'Engineering', 115000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-085', 'Tessa Hayes', 'tessa.hayes@techflow.com.au', 'Wellness Coordinator', 'Human Resources', 62000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-086', 'Rowan Myers', 'rowan.myers@techflow.com.au', 'Cybersecurity Engineer', 'IT', 102000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-087', 'Juniper Ford', 'juniper.ford@techflow.com.au', 'Conversion Rate Optimizer', 'Marketing', 78000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-088', 'Atlas Hamilton', 'atlas.hamilton@techflow.com.au', 'Microservices Architect', 'Engineering', 118000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-089', 'Wren Graham', 'wren.graham@techflow.com.au', 'Procurement Specialist', 'Procurement', 71000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-090', 'Orion Sullivan', 'orion.sullivan@techflow.com.au', 'AI Research Engineer', 'Analytics', 112000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-091', 'Sage Wallace', 'sage.wallace@techflow.com.au', 'Change Management Specialist', 'Operations', 84000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-092', 'River Woods', 'river.woods@techflow.com.au', 'Quantum Computing Researcher', 'Engineering', 125000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-093', 'Marlowe West', 'marlowe.west@techflow.com.au', 'Sustainability Officer', 'Operations', 88000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-094', 'Sage Tucker', 'sage.tucker@techflow.com.au', 'Growth Hacker', 'Marketing', 82000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-095', 'Indigo Stone', 'indigo.stone@techflow.com.au', 'Platform Security Engineer', 'IT', 97000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-096', 'Onyx Cole', 'onyx.cole@techflow.com.au', 'Revenue Operations', 'Sales', 91000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-097', 'Willa Palmer', 'willa.palmer@techflow.com.au', 'Talent Acquisition', 'Human Resources', 79000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-098', 'Zion Reed', 'zion.reed@techflow.com.au', 'Edge Computing Engineer', 'Engineering', 99000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-099', 'Nova Cooper', 'nova.cooper@techflow.com.au', 'Customer Data Analyst', 'Analytics', 81000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-100', 'Crew Richardson', 'crew.richardson@techflow.com.au', 'Site Performance Engineer', 'Engineering', 93000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-101', 'Aria Bell', 'aria.bell@techflow.com.au', 'UX Researcher', 'Design', 79000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-102', 'Finn Murphy', 'finn.murphy@techflow.com.au', 'DevSecOps Engineer', 'Engineering', 101000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-103', 'Luna Rivera', 'luna.rivera@techflow.com.au', 'Product Marketing Manager', 'Marketing', 89000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-104', 'Asher Ward', 'asher.ward@techflow.com.au', 'Staff Engineer', 'Engineering', 125000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-105', 'Iris Chen', 'iris.chen@techflow.com.au', 'Compensation Analyst', 'Human Resources', 74000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-106', 'Kai Thompson', 'kai.thompson@techflow.com.au', 'Solutions Engineer', 'Engineering', 97000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-107', 'Sage Martinez', 'sage.martinez@techflow.com.au', 'Customer Success Manager', 'Support', 86000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-108', 'River Johnson', 'river.johnson@techflow.com.au', 'Technical Product Manager', 'Product', 108000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-109', 'Nova Davis', 'nova.davis@techflow.com.au', 'Information Security Analyst', 'IT', 91000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-110', 'Atlas Brown', 'atlas.brown@techflow.com.au', 'Senior Data Scientist', 'Analytics', 115000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-111', 'Wren Wilson', 'wren.wilson@techflow.com.au', 'Agile Coach', 'Operations', 92000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-112', 'Phoenix Garcia', 'phoenix.garcia@techflow.com.au', 'Senior Frontend Developer', 'Engineering', 98000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-113', 'Sage Miller', 'sage.miller@techflow.com.au', 'Employee Experience Manager', 'Human Resources', 87000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-114', 'Orion Taylor', 'orion.taylor@techflow.com.au', 'Senior Backend Developer', 'Engineering', 102000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-115', 'Luna Anderson', 'luna.anderson@techflow.com.au', 'Growth Product Manager', 'Product', 105000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-116', 'Kai White', 'kai.white@techflow.com.au', 'Senior DevOps Engineer', 'Engineering', 106000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-117', 'River Harris', 'river.harris@techflow.com.au', 'Technical Recruiter', 'Human Resources', 81000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-118', 'Sage Clark', 'sage.clark@techflow.com.au', 'Senior Sales Engineer', 'Sales', 112000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-119', 'Nova Lewis', 'nova.lewis@techflow.com.au', 'Principal Designer', 'Design', 118000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-120', 'Atlas Robinson', 'atlas.robinson@techflow.com.au', 'Engineering Manager', 'Engineering', 135000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-121', 'Wren Walker', 'wren.walker@techflow.com.au', 'Senior Product Manager', 'Product', 125000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-122', 'Phoenix Young', 'phoenix.young@techflow.com.au', 'Staff Data Scientist', 'Analytics', 128000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-123', 'Sage King', 'sage.king@techflow.com.au', 'Director of Engineering', 'Engineering', 165000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-124', 'Orion Wright', 'orion.wright@techflow.com.au', 'VP of Product', 'Product', 180000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-125', 'Luna Lopez', 'luna.lopez@techflow.com.au', 'Chief Technology Officer', 'Engineering', 220000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-126', 'Kai Hill', 'kai.hill@techflow.com.au', 'VP of Sales', 'Sales', 175000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-127', 'River Scott', 'river.scott@techflow.com.au', 'Chief Marketing Officer', 'Marketing', 190000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-128', 'Sage Green', 'sage.green@techflow.com.au', 'Chief Financial Officer', 'Finance', 210000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-129', 'Nova Adams', 'nova.adams@techflow.com.au', 'Chief People Officer', 'Human Resources', 185000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-130', 'Atlas Baker', 'atlas.baker@techflow.com.au', 'Chief Executive Officer', 'Executive', 250000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-131', 'Wren Nelson', 'wren.nelson@techflow.com.au', 'Senior Marketing Manager', 'Marketing', 95000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-132', 'Phoenix Carter', 'phoenix.carter@techflow.com.au', 'Senior Finance Manager', 'Finance', 98000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-133', 'Sage Mitchell', 'sage.mitchell@techflow.com.au', 'Senior Operations Manager', 'Operations', 102000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-134', 'Orion Perez', 'orion.perez@techflow.com.au', 'Senior Support Manager', 'Support', 89000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-135', 'Luna Roberts', 'luna.roberts@techflow.com.au', 'Senior Legal Counsel', 'Legal', 135000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-136', 'Kai Turner', 'kai.turner@techflow.com.au', 'Senior IT Manager', 'IT', 105000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-137', 'River Phillips', 'river.phillips@techflow.com.au', 'Senior Analytics Manager', 'Analytics', 108000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-138', 'Sage Campbell', 'sage.campbell@techflow.com.au', 'Senior Design Manager', 'Design', 112000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-139', 'Nova Parker', 'nova.parker@techflow.com.au', 'Senior Business Development Manager', 'Business Development', 115000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-140', 'Atlas Evans', 'atlas.evans@techflow.com.au', 'Senior Procurement Manager', 'Procurement', 95000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-141', 'Wren Edwards', 'wren.edwards@techflow.com.au', 'Senior Documentation Manager', 'Documentation', 88000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-142', 'Phoenix Collins', 'phoenix.collins@techflow.com.au', 'Senior Executive Assistant', 'Executive', 78000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-143', 'Sage Stewart', 'sage.stewart@techflow.com.au', 'Senior Facilities Manager', 'Operations', 82000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-144', 'Orion Sanchez', 'orion.sanchez@techflow.com.au', 'Senior Training Manager', 'Human Resources', 91000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-145', 'Luna Morris', 'luna.morris@techflow.com.au', 'Senior Compliance Manager', 'Legal', 98000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-146', 'Kai Rogers', 'kai.rogers@techflow.com.au', 'Senior Quality Manager', 'Operations', 94000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-147', 'River Reed', 'river.reed@techflow.com.au', 'Senior Partnership Manager', 'Business Development', 105000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-148', 'Sage Cook', 'sage.cook@techflow.com.au', 'Senior Customer Success Manager', 'Support', 96000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-149', 'Nova Bailey', 'nova.bailey@techflow.com.au', 'Senior Research Manager', 'Analytics', 103000),
('550e8400-e29b-41d4-a716-446655440000', 'TF-150', 'Atlas Cooper', 'atlas.cooper@techflow.com.au', 'Senior Innovation Manager', 'Operations', 110000);

-- Create user profiles for some key employees (including Ben Millar's Google OAuth ID)
INSERT INTO user_profiles (user_id, employee_id, full_name, email, company_name, company_id) VALUES 
-- Ben Millar with his actual Google OAuth user ID (this should match his Google login)
('ben-millar-google-oauth-id', 'TF-HR-001', 'Ben Millar', 'ben@millarx.com', 'TechFlow Solutions Pty Ltd', '550e8400-e29b-41d4-a716-446655440000'),
-- Sample employees for testing
('tf-sarah-001', 'TF-001', 'Sarah Chen', 'sarah.chen@techflow.com.au', 'TechFlow Solutions Pty Ltd', '550e8400-e29b-41d4-a716-446655440000'),
('tf-michael-002', 'TF-002', 'Michael Thompson', 'michael.thompson@techflow.com.au', 'TechFlow Solutions Pty Ltd', '550e8400-e29b-41d4-a716-446655440000'),
('tf-emma-003', 'TF-003', 'Emma Wilson', 'emma.wilson@techflow.com.au', 'TechFlow Solutions Pty Ltd', '550e8400-e29b-41d4-a716-446655440000');

-- Portal access for Ben Millar (both user IDs for flexibility)
INSERT INTO portal_access (user_id, company_id, portal_type, is_active) VALUES 
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'employer', true),
('tf-sarah-001', '550e8400-e29b-41d4-a716-446655440000', 'employee', true),
('tf-michael-002', '550e8400-e29b-41d4-a716-446655440000', 'employee', true),
('tf-emma-003', '550e8400-e29b-41d4-a716-446655440000', 'employee', true);

-- Insert realistic fleet vehicles data (from Employee Entry Portal captures)
INSERT INTO fleet_vehicles (user_id, company_id, employee_id, employee_name, vehicle_type, fuel_type, make, model, km_per_year, fuel_efficiency, business_use, has_novated, monthly_payment, annual_package_reduction, lease_end, employee_salary) VALUES 
-- Ben Millar's view of the fleet (manager perspective)
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-001', 'Sarah Chen', 'Sedan', 'electric', 'Tesla', 'Model 3', 15000, 18.0, 25, true, 890, 10680, '2026-01-15', 95000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-002', 'Michael Thompson', 'SUV', 'hybrid', 'Toyota', 'RAV4 Hybrid', 18000, 5.2, 40, true, 1150, 13800, '2025-08-20', 105000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-003', 'Emma Wilson', 'Sedan', 'petrol', 'Holden', 'Commodore', 22000, 8.5, 60, false, 0, 0, null, 78000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-004', 'James Park', 'Ute', 'diesel', 'Ford', 'Ranger', 25000, 9.2, 80, true, 1300, 15600, '2025-12-10', 88000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-005', 'Lisa Rodriguez', 'Hatchback', 'petrol', 'Mazda', 'CX-3', 12000, 6.8, 20, false, 0, 0, null, 82000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-006', 'David Kim', 'Sedan', 'electric', 'BMW', 'i4', 20000, 19.5, 70, true, 1200, 14400, '2026-03-15', 120000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-007', 'Rachel Green', 'SUV', 'hybrid', 'Lexus', 'NX Hybrid', 16000, 5.8, 30, true, 980, 11760, '2025-11-20', 72000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-008', 'Tom Anderson', 'Sedan', 'petrol', 'Audi', 'A4', 18000, 7.2, 50, true, 1050, 12600, '2026-02-10', 90000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-009', 'Sophie Taylor', 'Hatchback', 'petrol', 'Volkswagen', 'Golf', 14000, 6.5, 15, false, 0, 0, null, 65000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-010', 'Alex Johnson', 'SUV', 'electric', 'Hyundai', 'IONIQ 5', 17000, 20.2, 35, true, 1100, 13200, '2026-04-25', 75000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-011', 'Maria Santos', 'Sedan', 'hybrid', 'Toyota', 'Camry Hybrid', 13000, 4.8, 25, false, 0, 0, null, 58000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-012', 'Chris Lee', 'Ute', 'diesel', 'Toyota', 'HiLux', 28000, 8.9, 85, true, 1250, 15000, '2025-09-15', 80000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-013', 'Jennifer Brown', 'SUV', 'petrol', 'Subaru', 'Forester', 19000, 7.8, 45, true, 950, 11400, '2026-01-30', 85000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-014', 'Ryan O''Connor', 'Sedan', 'electric', 'Mercedes-Benz', 'EQS', 21000, 22.0, 60, true, 1500, 18000, '2026-05-10', 110000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-015', 'Amanda White', 'Hatchback', 'petrol', 'Honda', 'Civic', 11000, 6.2, 10, false, 0, 0, null, 68000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-016', 'Daniel Martinez', 'SUV', 'electric', 'Audi', 'e-tron', 23000, 24.5, 75, true, 1400, 16800, '2026-06-20', 98000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-017', 'Kate Mitchell', 'Sedan', 'petrol', 'Toyota', 'Corolla', 15000, 6.0, 20, false, 0, 0, null, 62000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-018', 'Ben Davis', 'SUV', 'hybrid', 'BMW', 'X3 xDrive30e', 20000, 6.8, 55, true, 1300, 15600, '2025-10-05', 92000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-019', 'Olivia Turner', 'Hatchback', 'electric', 'Nissan', 'Leaf', 12000, 17.5, 15, true, 750, 9000, '2026-07-15', 70000),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', 'TF-020', 'Mark Wilson', 'Sedan', 'petrol', 'Ford', 'Mondeo', 24000, 8.1, 80, true, 900, 10800, '2025-12-20', 75000);

-- Insert employee vehicles (individual employee perspective)
INSERT INTO employee_vehicles (user_id, employee_id, make, model, year, fuel_type, monthly_lease_payment, lease_end_date, is_novated) VALUES 
('tf-sarah-001', 'TF-001', 'Tesla', 'Model 3', 2023, 'electric', 890.00, '2026-01-15', true),
('tf-michael-002', 'TF-002', 'Toyota', 'RAV4 Hybrid', 2022, 'hybrid', 1150.00, '2025-08-20', true),
('tf-emma-003', 'TF-003', 'Holden', 'Commodore', 2019, 'petrol', 0.00, null, false);

-- Insert commute data (from Employee Dashboard)
INSERT INTO commute_data (user_id, employee_id, date, distance_km, transport_mode, fuel_cost, emissions_kg) VALUES 
-- Sarah Chen's commutes (EV owner)
('tf-sarah-001', 'TF-001', '2025-01-27', 26.0, 'car', 3.50, 0.79),
('tf-sarah-001', 'TF-001', '2025-01-26', 26.0, 'car', 3.50, 0.79),
('tf-sarah-001', 'TF-001', '2025-01-25', 26.0, 'car', 3.50, 0.79),
('tf-sarah-001', 'TF-001', '2025-01-24', 26.0, 'car', 3.50, 0.79),
('tf-sarah-001', 'TF-001', '2025-01-23', 26.0, 'car', 3.50, 0.79),
-- Michael Thompson's commutes (Hybrid owner)
('tf-michael-002', 'TF-002', '2025-01-27', 28.0, 'car', 8.50, 1.46),
('tf-michael-002', 'TF-002', '2025-01-26', 28.0, 'car', 8.50, 1.46),
('tf-michael-002', 'TF-002', '2025-01-25', 28.0, 'car', 8.50, 1.46),
('tf-michael-002', 'TF-002', '2025-01-24', 28.0, 'car', 8.50, 1.46),
('tf-michael-002', 'TF-002', '2025-01-23', 28.0, 'car', 8.50, 1.46),
-- Emma Wilson's commutes (mixed transport)
('tf-emma-003', 'TF-003', '2025-01-27', 3.0, 'car', 2.50, 0.63),
('tf-emma-003', 'TF-003', '2025-01-27', 22.0, 'train', 0.00, 0.92),
('tf-emma-003', 'TF-003', '2025-01-27', 1.0, 'walk', 0.00, 0.00),
('tf-emma-003', 'TF-003', '2025-01-26', 26.0, 'bike', 0.00, 0.00),
('tf-emma-003', 'TF-003', '2025-01-25', 26.0, 'carpool', 4.00, 2.73);

-- Insert sustainability goals
INSERT INTO sustainability_goals (user_id, employee_id, goal_type, target_value, current_value, target_date, is_achieved) VALUES 
('tf-sarah-001', 'TF-001', 'carbon_reduction', 2.5, 2.4, '2025-12-31', false),
('tf-sarah-001', 'TF-001', 'ev_adoption', 1.0, 1.0, '2025-06-30', true),
('tf-michael-002', 'TF-002', 'carbon_reduction', 3.0, 1.8, '2025-12-31', false),
('tf-michael-002', 'TF-002', 'public_transport_days', 2.0, 0.0, '2025-12-31', false),
('tf-emma-003', 'TF-003', 'carbon_reduction', 4.0, 2.1, '2025-12-31', false),
('tf-emma-003', 'TF-003', 'active_transport_days', 3.0, 2.0, '2025-12-31', false);

-- Insert carbon purchases (from Employer Dashboard)
INSERT INTO carbon_purchases (user_id, company_id, date, tonnes, cost_per_tonne, total_cost, status) VALUES 
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', '2025-01-15', 25.5, 35.00, 892.50, 'completed'),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', '2024-12-20', 18.2, 35.00, 637.00, 'completed'),
('ben-millar-google-oauth-id', '550e8400-e29b-41d4-a716-446655440000', '2024-11-10', 30.0, 34.50, 1035.00, 'completed');

-- Create indexes for better performance
CREATE INDEX idx_employees_company_id ON employees(company_id);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_company_id ON user_profiles(company_id);
CREATE INDEX idx_portal_access_user_id ON portal_access(user_id);
CREATE INDEX idx_portal_access_company_id ON portal_access(company_id);
CREATE INDEX idx_employee_vehicles_user_id ON employee_vehicles(user_id);
CREATE INDEX idx_commute_data_user_id ON commute_data(user_id);
CREATE INDEX idx_commute_data_date ON commute_data(date);
CREATE INDEX idx_fleet_vehicles_user_id ON fleet_vehicles(user_id);
CREATE INDEX idx_fleet_vehicles_company_id ON fleet_vehicles(company_id);
CREATE INDEX idx_carbon_purchases_user_id ON carbon_purchases(user_id);
CREATE INDEX idx_carbon_purchases_company_id ON carbon_purchases(company_id);

-- Enable Row Level Security (RLS) for data protection
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE commute_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_purchases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their portal access" ON portal_access FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their employee vehicles" ON employee_vehicles FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their employee vehicles" ON employee_vehicles FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their employee vehicles" ON employee_vehicles FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their commute data" ON commute_data FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their commute data" ON commute_data FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their sustainability goals" ON sustainability_goals FOR SELECT USING (auth.uid()::text = user_id);
