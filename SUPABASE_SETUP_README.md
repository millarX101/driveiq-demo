# Supabase Database Setup for MXDriveIQ Demo

This SQL script creates a complete demo database with 200 employees and realistic commuting data for your MXDriveIQ platform.

## 🎯 What This Creates

- **TechCorp Australia** - Example company with 200 staff
- **Realistic Transport Distribution:**
  - 45% Petrol Cars (90 employees)
  - 20% Electric Vehicles (40 employees) 
  - 15% Hybrid Vehicles (30 employees)
  - 10% Public Transport (20 employees)
  - **10% Cycling (20 employees)** ✅ As requested
  - 5% Diesel Cars (10 employees)

## 📊 Generated Data

### Tables Created:
- `companies` - Company information
- `employees` - 200 staff members across 6 departments
- `vehicles` - Vehicle details for car users
- `transport_logs` - 30 days of daily commuting data

### Departments:
- Technology (80 employees - 40%)
- Sales (50 employees - 25%) 
- Marketing (30 employees - 15%)
- Finance (20 employees - 10%)
- HR (10 employees - 5%)
- Operations (10 employees - 5%)

### Useful Views:
- `transport_summary` - Transport method breakdown
- `weekly_transport_trends` - 4-week trend analysis
- `department_transport_analysis` - Department-wise transport patterns

## 🚀 How to Use

### 1. In Supabase Dashboard:
1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Copy and paste the entire `supabase-setup.sql` content
4. Click **Run** to execute

### 2. Verify Setup:
```sql
-- Check employee count
SELECT COUNT(*) FROM employees;

-- Check transport distribution
SELECT transport_method, COUNT(*) as count 
FROM employees 
GROUP BY primary_transport 
ORDER BY count DESC;

-- View transport summary
SELECT * FROM transport_summary;
```

### 3. Connect Your App:
Update your `src/supabaseClient.js` with real Supabase credentials:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 📈 Sample Dashboard Queries

### Transport Method Distribution (Pie Chart):
```sql
SELECT 
    primary_transport as name, 
    COUNT(*) as value 
FROM employees 
WHERE company_id = 'demo-company-123' 
GROUP BY primary_transport;
```

### Weekly Emissions Trends:
```sql
SELECT * FROM weekly_transport_trends 
ORDER BY week_start, transport_method;
```

### Company Metrics:
```sql
SELECT 
    name,
    employee_count,
    total_leases,
    ev_leases,
    ROUND(ev_leases * 100.0 / total_leases, 1) as ev_adoption_rate,
    carbon_saved
FROM companies 
WHERE id = 'demo-company-123';
```

### Cycling Statistics:
```sql
SELECT 
    COUNT(*) as cycling_employees,
    AVG(distance_km) as avg_daily_distance,
    SUM(emissions_kg) as total_emissions_saved
FROM transport_logs tl
JOIN employees e ON tl.employee_id = e.id
WHERE e.company_id = 'demo-company-123'
    AND tl.transport_method = 'Cycling'
    AND tl.log_date >= CURRENT_DATE - INTERVAL '30 days';
```

## 🔧 Customization

### Add More Employees:
Modify the loop in `generate_sample_employees()` function:
```sql
FOR i IN 1..300 LOOP -- Change from 200 to 300
```

### Adjust Transport Distribution:
Modify the `transport_weights` array:
```sql
transport_weights INTEGER[] := ARRAY[40, 25, 15, 10, 10, 5]; -- Adjust percentages
```

### Change Company Details:
```sql
UPDATE companies 
SET name = 'Your Company Name',
    employee_count = 300
WHERE id = 'demo-company-123';
```

## 🎯 Perfect for Demo

This setup provides:
- ✅ Realistic employee distribution across departments
- ✅ 10% cycling adoption as requested
- ✅ 30 days of historical commuting data
- ✅ Proper vehicle assignments and lease information
- ✅ Calculated emissions and cost data
- ✅ Ready-to-use views for dashboard queries

## 🔄 Reset Database

To start fresh:
```sql
DROP TABLE IF EXISTS transport_logs CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
-- Then re-run the setup script
```

Your MXDriveIQ platform will now have rich, realistic data for an impressive Friday demo! 🚀
