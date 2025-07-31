-- Vehicle Entry Portal Database Setup
-- This creates the necessary table for storing employee vehicle submissions

-- Create employee_vehicles table for storing vehicle entry portal submissions
CREATE TABLE IF NOT EXISTS employee_vehicles (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(100) NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(company_id),
    vehicle_type VARCHAR(200) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Hybrid', 'EV')),
    km_per_year INTEGER NOT NULL CHECK (km_per_year > 0),
    fuel_efficiency DECIMAL(5,2) NOT NULL CHECK (fuel_efficiency > 0),
    business_use_percentage INTEGER DEFAULT 0 CHECK (business_use_percentage >= 0 AND business_use_percentage <= 100),
    has_novated_lease BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employee_vehicles_company_id ON employee_vehicles(company_id);
CREATE INDEX IF NOT EXISTS idx_employee_vehicles_employee_id ON employee_vehicles(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_vehicles_fuel_type ON employee_vehicles(fuel_type);
CREATE INDEX IF NOT EXISTS idx_employee_vehicles_created_at ON employee_vehicles(created_at);

-- Enable Row Level Security
ALTER TABLE employee_vehicles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their company's vehicle submissions" ON employee_vehicles
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM portal_access 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can insert vehicle submissions for their company" ON employee_vehicles
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM portal_access 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can update their company's vehicle submissions" ON employee_vehicles
    FOR UPDATE USING (
        company_id IN (
            SELECT company_id FROM portal_access 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Create a function to calculate CO2 emissions from vehicle data
CREATE OR REPLACE FUNCTION calculate_vehicle_emissions(
    fuel_type_param VARCHAR(50),
    km_per_year_param INTEGER,
    fuel_efficiency_param DECIMAL(5,2),
    business_use_param INTEGER DEFAULT 0
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    emission_factor DECIMAL(5,3);
    annual_fuel_consumption DECIMAL(10,2);
    annual_emissions DECIMAL(10,2);
    personal_use_percentage DECIMAL(5,2);
BEGIN
    -- Set emission factors (kg CO2 per litre/kWh)
    CASE fuel_type_param
        WHEN 'Petrol' THEN emission_factor := 2.300;
        WHEN 'Diesel' THEN emission_factor := 2.700;
        WHEN 'Hybrid' THEN emission_factor := 1.150;
        WHEN 'EV' THEN emission_factor := 0.100; -- Electricity grid emissions
        ELSE emission_factor := 2.300; -- Default to petrol
    END CASE;
    
    -- Calculate annual fuel consumption (litres or kWh)
    annual_fuel_consumption := (km_per_year_param * fuel_efficiency_param) / 100.0;
    
    -- Calculate annual emissions in kg CO2
    annual_emissions := annual_fuel_consumption * emission_factor;
    
    -- Apply personal use percentage (Scope 3 only covers personal use)
    personal_use_percentage := (100 - business_use_param) / 100.0;
    annual_emissions := annual_emissions * personal_use_percentage;
    
    -- Convert to tonnes CO2 and return
    RETURN annual_emissions / 1000.0;
END;
$$ LANGUAGE plpgsql;

-- Create a view for vehicle emissions summary
CREATE OR REPLACE VIEW vehicle_emissions_summary AS
SELECT 
    ev.*,
    calculate_vehicle_emissions(
        ev.fuel_type, 
        ev.km_per_year, 
        ev.fuel_efficiency, 
        ev.business_use_percentage
    ) as annual_co2_tonnes,
    c.company_name
FROM employee_vehicles ev
JOIN companies c ON ev.company_id = c.company_id;

-- Insert some sample data for testing (optional)
-- This will only work if the TechFlow Solutions company exists
INSERT INTO employee_vehicles (
    employee_id, 
    company_id, 
    vehicle_type, 
    fuel_type, 
    km_per_year, 
    fuel_efficiency, 
    business_use_percentage, 
    has_novated_lease
) VALUES 
    ('DEMO001', '550e8400-e29b-41d4-a716-446655440000', 'Toyota Corolla', 'Petrol', 15000, 7.5, 0, false),
    ('DEMO002', '550e8400-e29b-41d4-a716-446655440000', 'Tesla Model 3', 'EV', 18000, 15.0, 0, true),
    ('DEMO003', '550e8400-e29b-41d4-a716-446655440000', 'Ford Ranger', 'Diesel', 25000, 9.5, 20, false)
ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON employee_vehicles TO authenticated;
GRANT SELECT ON vehicle_emissions_summary TO authenticated;
GRANT USAGE ON SEQUENCE employee_vehicles_id_seq TO authenticated;

-- Create a function to get vehicle submission stats for a company
CREATE OR REPLACE FUNCTION get_company_vehicle_stats(company_uuid UUID)
RETURNS TABLE (
    total_vehicles INTEGER,
    total_employees INTEGER,
    ev_count INTEGER,
    hybrid_count INTEGER,
    petrol_count INTEGER,
    diesel_count INTEGER,
    total_annual_emissions DECIMAL(10,2),
    average_emissions_per_vehicle DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_vehicles,
        COUNT(DISTINCT employee_id)::INTEGER as total_employees,
        COUNT(CASE WHEN fuel_type = 'EV' THEN 1 END)::INTEGER as ev_count,
        COUNT(CASE WHEN fuel_type = 'Hybrid' THEN 1 END)::INTEGER as hybrid_count,
        COUNT(CASE WHEN fuel_type = 'Petrol' THEN 1 END)::INTEGER as petrol_count,
        COUNT(CASE WHEN fuel_type = 'Diesel' THEN 1 END)::INTEGER as diesel_count,
        COALESCE(SUM(calculate_vehicle_emissions(fuel_type, km_per_year, fuel_efficiency, business_use_percentage)), 0) as total_annual_emissions,
        COALESCE(AVG(calculate_vehicle_emissions(fuel_type, km_per_year, fuel_efficiency, business_use_percentage)), 0) as average_emissions_per_vehicle
    FROM employee_vehicles 
    WHERE company_id = company_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the setup
SELECT 'Vehicle Entry Portal database setup complete!' as status;

-- Show sample data if it exists
SELECT 
    'Sample vehicle submissions:' as info,
    COUNT(*) as total_submissions,
    COUNT(DISTINCT employee_id) as unique_employees
FROM employee_vehicles 
WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';

-- Show emissions calculation example
SELECT 
    vehicle_type,
    fuel_type,
    km_per_year,
    fuel_efficiency,
    annual_co2_tonnes,
    company_name
FROM vehicle_emissions_summary 
WHERE company_id = '550e8400-e29b-41d4-a716-446655440000'
LIMIT 5;
