# Live Supabase Testing Guide - Full Data Flow Testing

## 🎯 **Testing Objective**

Test the complete data flow across all platforms using your Google account to verify:
- Data created in one platform appears in others
- Real-time Supabase integration works
- Cross-platform data visibility
- Authentication and permissions work correctly

## 🚀 **Step-by-Step Testing Process**

### **Phase 1: Set Up Your Test Accounts**

#### 1.1 Create Admin Account (You)
```sql
-- Run in Supabase SQL Editor after you sign in with Google
-- Replace 'your-google-user-id' with your actual user ID from auth.users table

INSERT INTO portal_access (user_id, portal_type, permissions, is_active)
VALUES (
    'your-google-user-id',
    'admin',
    '{"manage_users": true, "manage_rates": true, "view_all_data": true}',
    true
);
```

#### 1.2 Create Employer Account (You)
```sql
-- Add employer access for the same user
INSERT INTO portal_access (user_id, portal_type, permissions, is_active)
VALUES (
    'your-google-user-id',
    'employer',
    '{"company_id": 1, "company_name": "Test Company Ltd", "manage_employees": true}',
    true
);
```

#### 1.3 Create Employee Account (You)
```sql
-- Add employee access for the same user
INSERT INTO portal_access (user_id, portal_type, permissions, is_active)
VALUES (
    'your-google-user-id',
    'employee',
    '{"company_id": 1, "employee_id": 1, "can_apply": true}',
    true
);
```

#### 1.4 Create Dealer Account (You)
```sql
-- Add dealer access for the same user
INSERT INTO portal_access (user_id, portal_type, permissions, is_active)
VALUES (
    'your-google-user-id',
    'mxdealer',
    '{"dealership_name": "Test Motors", "territory": "Melbourne", "tier": "Gold"}',
    true
);
```

### **Phase 2: Test Data Creation Flow**

#### 2.1 Test as Employee → Create Quote
1. **Go to**: `http://localhost:5173/employee/login`
2. **Sign in** with your Google account
3. **Navigate to**: Employee dashboard
4. **Create a quote**:
   - Use the lease calculator
   - Fill in vehicle details (e.g., Tesla Model 3, $65,000)
   - Complete personal details
   - Submit the quote
5. **Note the quote ID** for tracking

#### 2.2 Test as Dealer → View Quote
1. **Go to**: `http://localhost:5173/mxdealer/login`
2. **Sign in** with the same Google account
3. **Check dashboard**: Should see the quote you just created
4. **Verify data**:
   - Quote appears in "Recent Quotes" section
   - Metrics updated (total quotes count)
   - Quote details are correct

#### 2.3 Test as Employee → Submit Application
1. **Go back to**: `http://localhost:5173/employee/login`
2. **Submit application** for the quote you created
3. **Fill in application details**:
   - Employment information
   - Financial details
   - Submit application

#### 2.4 Test as Employer → View Application
1. **Go to**: `http://localhost:5173/employer/login`
2. **Sign in** with your Google account
3. **Check dashboard**: Should see the application
4. **Verify**:
   - Application appears in pending applications
   - Employee details are correct
   - Quote information is linked

#### 2.5 Test as Admin → View All Data
1. **Go to**: `http://localhost:5173/admin/login`
2. **Sign in** with your Google account
3. **Check all tabs**:
   - Dashboard: Should show updated metrics
   - Users: Should see your accounts
   - Quotes: Should see the quote you created
   - Applications: Should see the application

### **Phase 3: Cross-Platform Data Verification**

#### 3.1 Create Test Company Data
```sql
-- Run in Supabase to create test company
INSERT INTO companies (name, abn, address, contact_email, contact_phone, created_at)
VALUES (
    'Test Company Ltd',
    '12345678901',
    '123 Test Street, Melbourne VIC 3000',
    'admin@testcompany.com',
    '+61 3 9123 4567',
    NOW()
);

-- Create test employee record
INSERT INTO employees (company_id, name, email, phone, position, salary, created_at)
VALUES (
    1, -- company_id from above
    'Test Employee',
    'your-email@gmail.com', -- Your actual Google email
    '+61 400 000 000',
    'Software Developer',
    80000,
    NOW()
);
```

#### 3.2 Test Quote Creation with Real Data
1. **As Employee**: Create a new quote with:
   - Vehicle: BMW i4 ($72,000)
   - Lease term: 36 months
   - Your actual details

2. **As Dealer**: Verify the quote appears with:
   - Correct vehicle information
   - Employee name and company
   - Accurate financial calculations

3. **As Employer**: Check if quote shows in company dashboard

#### 3.3 Test Application Flow
1. **As Employee**: Submit application for the BMW quote
2. **As Employer**: Review and approve/reject application
3. **As Dealer**: Check application status updates
4. **As Admin**: Monitor all activity

### **Phase 4: Real-Time Testing**

#### 4.1 Multi-Tab Testing
1. **Open 4 browser tabs**:
   - Tab 1: Employee dashboard
   - Tab 2: Employer dashboard  
   - Tab 3: Dealer dashboard
   - Tab 4: Admin dashboard

2. **Create data in one tab**, refresh others to see updates

#### 4.2 Test Data Synchronization
1. **Create quote** in employee tab
2. **Refresh dealer tab** → Should see new quote
3. **Submit application** in employee tab
4. **Refresh employer tab** → Should see new application
5. **Update status** in employer tab
6. **Refresh all tabs** → Should see status changes

### **Phase 5: Database Verification**

#### 5.1 Check Data in Supabase Dashboard
1. **Go to**: Your Supabase project dashboard
2. **Check tables**:
   - `lease_quotes`: Should see your test quotes
   - `lease_applications`: Should see your applications
   - `portal_access`: Should see your user permissions
   - `auth.users`: Should see your Google account

#### 5.2 Verify Views
```sql
-- Check active quotes view
SELECT * FROM active_quotes_view WHERE employee_email = 'your-email@gmail.com';

-- Check pending applications view  
SELECT * FROM pending_applications_view WHERE employee_email = 'your-email@gmail.com';
```

## 🔍 **What to Look For**

### ✅ **Success Indicators**
- [ ] Can sign into all 4 portals with same Google account
- [ ] Data created in one portal appears in others
- [ ] Metrics update automatically across dashboards
- [ ] Search and filtering work correctly
- [ ] Real-time updates when refreshing pages
- [ ] Proper user permissions (see only relevant data)

### ❌ **Potential Issues**
- **Data not appearing**: Check RLS policies in Supabase
- **Permission errors**: Verify portal_access records
- **Authentication issues**: Check Google OAuth configuration
- **Missing data**: Verify database views and joins

## 🛠 **Troubleshooting Commands**

### Check Your User ID
```sql
-- Find your user ID after signing in
SELECT id, email FROM auth.users WHERE email = 'your-email@gmail.com';
```

### Check Portal Access
```sql
-- Verify your portal access records
SELECT * FROM portal_access WHERE user_id = 'your-user-id';
```

### Check Data Flow
```sql
-- See all your quotes
SELECT * FROM lease_quotes WHERE employee_id IN (
    SELECT id FROM employees WHERE email = 'your-email@gmail.com'
);

-- See all your applications
SELECT * FROM lease_applications WHERE employee_id IN (
    SELECT id FROM employees WHERE email = 'your-email@gmail.com'
);
```

## 📊 **Expected Test Results**

After completing all tests, you should see:

1. **Employee Portal**: Your quotes and applications
2. **Employer Portal**: Applications from your "company"
3. **Dealer Portal**: All quotes with proper metrics
4. **Admin Portal**: Complete system overview with all data

This comprehensive testing will verify that your Supabase integration is working correctly across all platforms and that data flows seamlessly between them.

## 🎯 **Quick Test Checklist**

- [ ] Sign into all 4 portals with Google
- [ ] Create quote as employee
- [ ] Verify quote appears in dealer dashboard
- [ ] Submit application as employee  
- [ ] Verify application appears in employer dashboard
- [ ] Check admin dashboard shows all activity
- [ ] Test search/filter functions
- [ ] Verify metrics update correctly
- [ ] Test real-time updates across tabs

Once you complete this testing, you'll have full confidence that your multi-portal system is working correctly with live Supabase data!
