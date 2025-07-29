-- Multi-Portal System Database Schema
-- This extends the existing schema with multi-portal support

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
    vehicle_category TEXT, -- 'sedan', 'suv', 'ev', 'luxury', etc.
    rate_value DECIMAL(8,4) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Activity Log Table
CREATE TABLE IF NOT EXISTS admin_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_type TEXT, -- 'user', 'quote', 'rate', 'application', 'employee', 'company'
    target_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Settings Table (for portal-specific configurations)
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    setting_key TEXT NOT NULL,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, setting_key)
);

-- Notification System Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portal_access_user_id ON portal_access(user_id);
CREATE INDEX IF NOT EXISTS idx_portal_access_portal_type ON portal_access(portal_type);
CREATE INDEX IF NOT EXISTS idx_lease_quotes_employee_id ON lease_quotes(employee_id);
CREATE INDEX IF NOT EXISTS idx_lease_quotes_company_id ON lease_quotes(company_id);
CREATE INDEX IF NOT EXISTS idx_lease_quotes_status ON lease_quotes(status);
CREATE INDEX IF NOT EXISTS idx_lease_applications_quote_id ON lease_applications(quote_id);
CREATE INDEX IF NOT EXISTS idx_lease_applications_status ON lease_applications(status);
CREATE INDEX IF NOT EXISTS idx_lease_rates_rate_type ON lease_rates(rate_type);
CREATE INDEX IF NOT EXISTS idx_lease_rates_effective_dates ON lease_rates(effective_from, effective_to);
CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Row Level Security (RLS) Policies

-- Portal Access Policies
ALTER TABLE portal_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own portal access" ON portal_access
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all portal access" ON portal_access
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM portal_access pa 
            WHERE pa.user_id = auth.uid() 
            AND pa.portal_type = 'admin' 
            AND pa.is_active = true
        )
    );

-- Lease Quotes Policies
ALTER TABLE lease_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view their own quotes" ON lease_quotes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM employees e 
            WHERE e.id = employee_id 
            AND e.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

CREATE POLICY "Employers can view company quotes" ON lease_quotes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM portal_access pa 
            WHERE pa.user_id = auth.uid() 
            AND pa.portal_type = 'employer' 
            AND pa.company_id = lease_quotes.company_id
            AND pa.is_active = true
        )
    );

CREATE POLICY "MXDealer can view all quotes" ON lease_quotes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM portal_access pa 
            WHERE pa.user_id = auth.uid() 
            AND pa.portal_type = 'mxdealer' 
            AND pa.is_active = true
        )
    );

-- Lease Applications Policies
ALTER TABLE lease_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view their own applications" ON lease_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM employees e 
            WHERE e.id = employee_id 
            AND e.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

CREATE POLICY "MXDealer can view all applications" ON lease_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM portal_access pa 
            WHERE pa.user_id = auth.uid() 
            AND pa.portal_type = 'mxdealer' 
            AND pa.is_active = true
        )
    );

-- Rate Management Policies
ALTER TABLE lease_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view active rates" ON lease_rates
    FOR SELECT USING (is_active = true AND auth.role() = 'authenticated');

CREATE POLICY "Admins and MXDealer can manage rates" ON lease_rates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM portal_access pa 
            WHERE pa.user_id = auth.uid() 
            AND pa.portal_type IN ('admin', 'mxdealer') 
            AND pa.is_active = true
        )
    );

-- Admin Activity Policies
ALTER TABLE admin_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all activity" ON admin_activity
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM portal_access pa 
            WHERE pa.user_id = auth.uid() 
            AND pa.portal_type = 'admin' 
            AND pa.is_active = true
        )
    );

-- Company Settings Policies
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can view their company settings" ON company_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM portal_access pa 
            WHERE pa.user_id = auth.uid() 
            AND pa.portal_type = 'employer' 
            AND pa.company_id = company_settings.company_id
            AND pa.is_active = true
        )
    );

-- Notifications Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Functions for common operations

-- Function to generate quote numbers
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'Q' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('quote_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for quote numbers
CREATE SEQUENCE IF NOT EXISTS quote_number_seq START 1;

-- Function to generate application numbers
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'A' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('application_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for application numbers
CREATE SEQUENCE IF NOT EXISTS application_number_seq START 1;

-- Trigger to auto-generate quote numbers
CREATE OR REPLACE FUNCTION set_quote_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quote_number IS NULL THEN
        NEW.quote_number := generate_quote_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_quote_number
    BEFORE INSERT ON lease_quotes
    FOR EACH ROW
    EXECUTE FUNCTION set_quote_number();

-- Trigger to auto-generate application numbers
CREATE OR REPLACE FUNCTION set_application_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.application_number IS NULL THEN
        NEW.application_number := generate_application_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_application_number
    BEFORE INSERT ON lease_applications
    FOR EACH ROW
    EXECUTE FUNCTION set_application_number();

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
    p_action TEXT,
    p_target_type TEXT DEFAULT NULL,
    p_target_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO admin_activity (admin_id, action, target_type, target_id, details)
    VALUES (auth.uid(), p_action, p_target_type, p_target_id, p_details)
    RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default admin user portal access (you'll need to update the user_id)
-- INSERT INTO portal_access (user_id, portal_type, permissions, is_active)
-- VALUES (
--     'your-admin-user-id-here',
--     'admin',
--     '{"manage_users": true, "manage_rates": true, "view_all_data": true, "system_admin": true}',
--     true
-- );

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

-- Create views for easier data access

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

COMMENT ON TABLE portal_access IS 'Controls user access to different portals';
COMMENT ON TABLE lease_quotes IS 'Stores lease quotes generated by the calculator';
COMMENT ON TABLE lease_applications IS 'Tracks lease applications submitted by employees';
COMMENT ON TABLE lease_rates IS 'Manages interest rates and fees for lease calculations';
COMMENT ON TABLE admin_activity IS 'Logs all administrative actions for audit purposes';
COMMENT ON TABLE company_settings IS 'Stores company-specific portal configurations';
COMMENT ON TABLE notifications IS 'System notifications for users';
