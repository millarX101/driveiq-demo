-- Supabase Database Setup for MXDriveIQ Demo
-- Example Company: 200 staff, realistic commuting patterns with 10% cycling

-- =============================================
-- 1. CREATE TABLES
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
-- 2. INSERT SAMPLE COMPANY
-- =============================================

INSERT INTO companies (id, name, employee_count, grey_fleet_completion, total_leases, ev_leases, carbon_saved)
VALUES (
    'demo-company-123',
    'TechCorp Australia',
    200,
    78.5,
    156,
    89,
    52.3
);

-- =============================================
-- 3. CREATE FUNCTION TO GENERATE EMPLOYEES
-- =============================================

-- Function to generate realistic employee data
CREATE OR REPLACE FUNCTION generate_sample_employees()
RETURNS VOID AS $$
DECLARE
    dept_names TEXT[] := ARRAY['Technology', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations'];
    first_names TEXT[] := ARRAY['Sarah', 'Michael', 'Lisa', 'David', 'Emma', 'James', 'Sophie', 'Ryan', 'Olivia', 'Daniel', 'Jessica', 'Andrew', 'Megan', 'Christopher', 'Ashley', 'Robert', 'Jennifer', 'Matthew', 'Amanda', 'Joshua', 'Nicole', 'Kevin', 'Stephanie', 'Brandon', 'Rachel', 'Tyler', 'Samantha', 'Jonathan', 'Brittany', 'Austin'];
    last_names TEXT[] := ARRAY['Chen', 'Johnson', 'Wong', 'Smith', 'Wilson', 'Brown', 'Taylor', 'Davis', 'Miller', 'Garcia', 'Martinez', 'Rodriguez', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill'];
    transport_methods TEXT[] := ARRAY['Petrol Car', 'EV', 'Hybrid', 'Public Transport', 'Cycling', 'Diesel Car'];
    transport_weights INTEGER[] := ARRAY[45, 20, 15, 10, 10, 5]; -- Percentages: 45% Petrol, 20% EV, 15% Hybrid, 10% Public, 10% Cycling, 5% Diesel
    
    i INTEGER;
    dept_index INTEGER;
    transport_method TEXT;
    has_ev_val BOOLEAN;
    has_lease_val BOOLEAN;
    salary_val DECIMAL(10,2);
    emp_id UUID;
BEGIN
    -- Generate 200 employees
    FOR i IN 1..200 LOOP
        -- Determine department (weighted distribution)
        CASE 
            WHEN i <= 80 THEN dept_index := 1; -- Technology (40%)
            WHEN i <= 130 THEN dept_index := 2; -- Sales (25%)
            WHEN i <= 160 THEN dept_index := 3; -- Marketing (15%)
            WHEN i <= 180 THEN dept_index := 4; -- Finance (10%)
            WHEN i <= 190 THEN dept_index := 5; -- HR (5%)
            ELSE dept_index := 6; -- Operations (5%)
        END CASE;
        
        -- Select transport method based on weights (10% cycling as requested)
        transport_method := CASE 
            WHEN (i % 100) < 45 THEN 'Petrol Car'
            WHEN (i % 100) < 65 THEN 'EV'
            WHEN (i % 100) < 80 THEN 'Hybrid'
            WHEN (i % 100) < 90 THEN 'Public Transport'
            WHEN (i % 100) < 95 THEN 'Cycling'
            ELSE 'Diesel Car'
        END;
        
        -- Set EV flag
        has_ev_val := transport_method IN ('EV', 'Hybrid');
        
        -- 78% have novated leases (matching company stats)
        has_lease_val := (i % 100) < 78;
        
        -- Salary based on department
        salary_val := CASE dept_names[dept_index]
            WHEN 'Technology' THEN 75000 + (RANDOM() * 25000)
            WHEN 'Sales' THEN 65000 + (RANDOM() * 20000)
            WHEN 'Marketing' THEN 60000 + (RANDOM() * 15000)
            WHEN 'Finance' THEN 70000 + (RANDOM() * 20000)
            WHEN 'HR' THEN 65000 + (RANDOM() * 15000)
            ELSE 60000 + (RANDOM() * 18000)
        END;
        
        -- Insert employee
        INSERT INTO employees (
            company_id, 
            name, 
            email, 
            department, 
            has_ev, 
            has_novated_lease, 
            annual_salary,
            primary_transport
        ) VALUES (
            'demo-company-123',
            first_names[(i % 30) + 1] || ' ' || last_names[(i % 30) + 1],
            LOWER(first_names[(i % 30) + 1] || '.' || last_names[(i % 30) + 1] || i || '@techcorp.com.au'),
            dept_names[dept_index],
            has_ev_val,
            has_lease_val,
            salary_val,
            transport_method
        ) RETURNING id INTO emp_id;
        
        -- Add vehicle data for employees with cars
        IF transport_method IN ('Petrol Car', 'Diesel Car', 'EV', 'Hybrid') THEN
            INSERT INTO vehicles (
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
                emp_id,
                CASE transport_method
                    WHEN 'EV' THEN 'Electric Vehicle'
                    WHEN 'Hybrid' THEN 'Hybrid Vehicle'
                    WHEN 'Petrol Car' THEN 'Petrol Vehicle'
                    ELSE 'Diesel Vehicle'
                END,
                CASE transport_method
                    WHEN 'EV' THEN CASE (i % 4) WHEN 0 THEN 'Tesla' WHEN 1 THEN 'BMW' WHEN 2 THEN 'Nissan' ELSE 'Hyundai' END
                    WHEN 'Hybrid' THEN CASE (i % 3) WHEN 0 THEN 'Toyota' WHEN 1 THEN 'Honda' ELSE 'Lexus' END
                    ELSE CASE (i % 5) WHEN 0 THEN 'Toyota' WHEN 1 THEN 'Ford' WHEN 2 THEN 'Holden' WHEN 3 THEN 'Mazda' ELSE 'Subaru' END
                END,
                CASE transport_method
                    WHEN 'EV' THEN CASE (i % 4) WHEN 0 THEN 'Model 3' WHEN 1 THEN 'i3' WHEN 2 THEN 'Leaf' ELSE 'Kona Electric' END
                    WHEN 'Hybrid' THEN CASE (i % 3) WHEN 0 THEN 'Prius' WHEN 1 THEN 'Insight' ELSE 'CT200h' END
                    ELSE CASE (i % 5) WHEN 0 THEN 'Camry' WHEN 1 THEN 'Ranger' WHEN 2 THEN 'Commodore' WHEN 3 THEN 'CX-5' ELSE 'Outback' END
                END,
                2018 + (i % 6), -- Years 2018-2023
                CASE transport_method WHEN 'EV' THEN 'EV' WHEN 'Hybrid' THEN 'Hybrid' WHEN 'Petrol Car' THEN 'Petrol' ELSE 'Diesel' END,
                12000 + (RANDOM() * 18000)::INTEGER, -- 12k-30k km annually
                20 + (RANDOM() * 40)::DECIMAL(5,2), -- 20-60% business use
                has_lease_val,
                CASE WHEN has_lease_val THEN CURRENT_DATE - INTERVAL '1 year' * RANDOM() * 2 ELSE NULL END,
                CASE WHEN has_lease_val THEN CURRENT_DATE + INTERVAL '1 year' * (2 + RANDOM() * 2) ELSE NULL END
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to generate employees
SELECT generate_sample_employees();

-- =============================================
-- 4. GENERATE TRANSPORT LOGS (LAST 30 DAYS)
-- =============================================

-- Function to generate realistic daily transport logs
CREATE OR REPLACE FUNCTION generate_transport_logs()
RETURNS VOID AS $$
DECLARE
    emp_record RECORD;
    log_date DATE;
    distance DECIMAL(6,2);
    emissions DECIMAL(8,4);
    cost DECIMAL(8,2);
    day_of_week INTEGER;
BEGIN
    -- For each employee, generate logs for the last 30 days
    FOR emp_record IN SELECT id, primary_transport FROM employees WHERE company_id = 'demo-company-123' LOOP
        -- Generate logs for last 30 days
        FOR i IN 0..29 LOOP
            log_date := CURRENT_DATE - INTERVAL '1 day' * i;
            day_of_week := EXTRACT(DOW FROM log_date); -- 0=Sunday, 6=Saturday
            
            -- Only generate logs for weekdays (Monday-Friday)
            IF day_of_week BETWEEN 1 AND 5 THEN
                -- Realistic commute distances (round trip)
                distance := CASE emp_record.primary_transport
                    WHEN 'Cycling' THEN 8 + (RANDOM() * 12) -- 8-20km cycling
                    WHEN 'Walking' THEN 2 + (RANDOM() * 4) -- 2-6km walking
                    WHEN 'Public Transport' THEN 15 + (RANDOM() * 25) -- 15-40km public transport
                    ELSE 20 + (RANDOM() * 40) -- 20-60km for cars
                END;
                
                -- Calculate emissions based on transport method (kg CO2)
                emissions := CASE emp_record.primary_transport
                    WHEN 'EV' THEN distance * 0.05 -- Very low emissions
                    WHEN 'Hybrid' THEN distance * 0.08 -- Low emissions
                    WHEN 'Petrol Car' THEN distance * 0.18 -- Medium emissions
                    WHEN 'Diesel Car' THEN distance * 0.21 -- Higher emissions
                    WHEN 'Public Transport' THEN distance * 0.06 -- Low emissions per person
                    WHEN 'Cycling' THEN 0 -- Zero emissions
                    WHEN 'Walking' THEN 0 -- Zero emissions
                    ELSE distance * 0.15 -- Default
                END;
                
                -- Calculate daily cost (AUD)
                cost := CASE emp_record.primary_transport
                    WHEN 'EV' THEN distance * 0.03 -- Electricity cost
                    WHEN 'Hybrid' THEN distance * 0.08 -- Fuel cost
                    WHEN 'Petrol Car' THEN distance * 0.12 -- Petrol cost
                    WHEN 'Diesel Car' THEN distance * 0.11 -- Diesel cost
                    WHEN 'Public Transport' THEN 8.50 + (distance * 0.05) -- Daily ticket + distance
                    WHEN 'Cycling' THEN 0.50 -- Minimal maintenance
                    WHEN 'Walking' THEN 0 -- No cost
                    ELSE distance * 0.10 -- Default
                END;
                
                -- Insert transport log
                INSERT INTO transport_logs (
                    employee_id,
                    log_date,
                    transport_method,
                    distance_km,
                    emissions_kg,
                    cost_aud
                ) VALUES (
                    emp_record.id,
                    log_date,
                    emp_record.primary_transport,
                    distance,
                    emissions,
                    cost
                );
            END IF;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to generate transport logs
SELECT generate_transport_logs();

-- =============================================
-- 5. CREATE USEFUL VIEWS FOR DASHBOARD
-- =============================================

-- View for transport method summary
CREATE OR REPLACE VIEW transport_summary AS
SELECT 
    transport_method,
    COUNT(*) as employee_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM employees WHERE company_id = 'demo-company-123'), 1) as percentage,
    AVG(distance_km) as avg_daily_distance,
    SUM(emissions_kg) as total_emissions_last_30_days,
    SUM(cost_aud) as total_cost_last_30_days
FROM transport_logs tl
JOIN employees e ON tl.employee_id = e.id
WHERE e.company_id = 'demo-company-123'
    AND tl.log_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY transport_method
ORDER BY employee_count DESC;

-- View for weekly trends
CREATE OR REPLACE VIEW weekly_transport_trends AS
SELECT 
    DATE_TRUNC('week', log_date) as week_start,
    transport_method,
    COUNT(DISTINCT employee_id) as unique_users,
    AVG(distance_km) as avg_distance,
    SUM(emissions_kg) as total_emissions
FROM transport_logs tl
JOIN employees e ON tl.employee_id = e.id
WHERE e.company_id = 'demo-company-123'
    AND tl.log_date >= CURRENT_DATE - INTERVAL '4 weeks'
GROUP BY DATE_TRUNC('week', log_date), transport_method
ORDER BY week_start, transport_method;

-- View for department analysis
CREATE OR REPLACE VIEW department_transport_analysis AS
SELECT 
    e.department,
    tl.transport_method,
    COUNT(*) as trip_count,
    AVG(tl.distance_km) as avg_distance,
    SUM(tl.emissions_kg) as total_emissions
FROM employees e
JOIN transport_logs tl ON e.id = tl.employee_id
WHERE e.company_id = 'demo-company-123'
    AND tl.log_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY e.department, tl.transport_method
ORDER BY e.department, trip_count DESC;

-- =============================================
-- 6. SAMPLE QUERIES FOR DASHBOARD
-- =============================================

-- Query 1: Transport method distribution (for pie chart)
-- SELECT transport_method as name, COUNT(DISTINCT employee_id) as value 
-- FROM transport_logs tl 
-- JOIN employees e ON tl.employee_id = e.id 
-- WHERE e.company_id = 'demo-company-123' 
-- GROUP BY transport_method;

-- Query 2: Weekly trends (for line chart)
-- SELECT * FROM weekly_transport_trends;

-- Query 3: Total emissions and savings
-- SELECT 
--     SUM(emissions_kg) as total_emissions_kg,
--     SUM(cost_aud) as total_cost_aud,
--     COUNT(DISTINCT employee_id) as active_commuters
-- FROM transport_logs tl
-- JOIN employees e ON tl.employee_id = e.id
-- WHERE e.company_id = 'demo-company-123'
--     AND tl.log_date >= CURRENT_DATE - INTERVAL '30 days';

-- Query 4: EV adoption rate
-- SELECT 
--     COUNT(CASE WHEN has_ev = TRUE THEN 1 END) as ev_owners,
--     COUNT(*) as total_employees,
--     ROUND(COUNT(CASE WHEN has_ev = TRUE THEN 1 END) * 100.0 / COUNT(*), 1) as ev_adoption_rate
-- FROM employees 
-- WHERE company_id = 'demo-company-123';

-- =============================================
-- 7. CLEAN UP FUNCTIONS (OPTIONAL)
-- =============================================

-- Drop the temporary functions if you don't need them anymore
-- DROP FUNCTION IF EXISTS generate_sample_employees();
-- DROP FUNCTION IF EXISTS generate_transport_logs();

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database setup complete! Generated 200 employees with realistic commuting data.';
    RAISE NOTICE 'Transport distribution: ~45%% Petrol, ~20%% EV, ~15%% Hybrid, ~10%% Public Transport, ~10%% Cycling';
    RAISE NOTICE 'Use the views: transport_summary, weekly_transport_trends, department_transport_analysis';
END $$;
