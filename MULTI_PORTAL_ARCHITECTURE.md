# Multi-Portal Architecture Plan

## 🏗️ System Overview

### Portal Structure
1. **Employee Portal** - Personal dashboard for employees
2. **Employer Portal** - Company dashboard for HR/Fleet managers  
3. **MXDealerAdvantage Portal** - Lease calculator and management
4. **Admin Dashboard** - Master control panel for system administration

## 📁 File Structure

```
src/
├── portals/
│   ├── employee/
│   │   ├── EmployeeLogin.jsx
│   │   ├── EmployeeDashboard.jsx
│   │   ├── EmployeeLanding.jsx
│   │   └── components/
│   │       ├── PersonalStats.jsx
│   │       ├── CommuteHistory.jsx
│   │       └── VehicleProfile.jsx
│   │
│   ├── employer/
│   │   ├── EmployerLogin.jsx
│   │   ├── EmployerDashboard.jsx
│   │   ├── EmployerLanding.jsx
│   │   └── components/
│   │       ├── FleetOverview.jsx
│   │       ├── EmployeeManagement.jsx
│   │       ├── EmissionsReporting.jsx
│   │       └── CompanyStats.jsx
│   │
│   ├── mxdealer/
│   │   ├── MXDealerLogin.jsx
│   │   ├── MXDealerDashboard.jsx
│   │   ├── MXDealerLanding.jsx
│   │   └── components/
│   │       ├── LeaseCalculator.jsx
│   │       ├── QuoteManagement.jsx
│   │       ├── ApplicationPortal.jsx
│   │       └── ClientDashboard.jsx
│   │
│   └── admin/
│       ├── AdminLogin.jsx
│       ├── AdminDashboard.jsx
│       └── components/
│           ├── SystemOverview.jsx
│           ├── UserManagement.jsx
│           ├── QuoteTracking.jsx
│           ├── ApplicationDownloads.jsx
│           ├── RateManagement.jsx
│           └── PasswordResets.jsx
│
├── shared/
│   ├── components/
│   │   ├── Navigation.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── Modal.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSupabase.js
│   │   └── usePortalAccess.js
│   └── utils/
│       ├── auth.js
│       ├── permissions.js
│       └── constants.js
│
└── layouts/
    ├── PortalLayout.jsx
    ├── AdminLayout.jsx
    └── PublicLayout.jsx
```

## 🛣️ Routing Structure

### Main Routes
```
/                           → Main Landing (Portal Selection)
/employee                   → Employee Portal Landing
/employee/login            → Employee Login
/employee/dashboard        → Employee Dashboard

/employer                  → Employer Portal Landing  
/employer/login           → Employer Login
/employer/dashboard       → Employer Dashboard

/mxdealer                 → MXDealer Portal Landing
/mxdealer/login          → MXDealer Login  
/mxdealer/dashboard      → MXDealer Dashboard
/mxdealer/calculator     → Direct Calculator Access

/admin                    → Admin Login
/admin/dashboard         → Admin Dashboard
/admin/users            → User Management
/admin/quotes           → Quote Tracking
/admin/applications     → Application Downloads
/admin/rates            → Rate Management
```

## 🗄️ Database Schema Extensions

### New Tables Needed

```sql
-- Portal Access Control
CREATE TABLE portal_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    portal_type TEXT NOT NULL, -- 'employee', 'employer', 'mxdealer', 'admin'
    company_id UUID REFERENCES companies(id),
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quote Management
CREATE TABLE lease_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id),
    company_id UUID REFERENCES companies(id),
    quote_data JSONB NOT NULL,
    status TEXT DEFAULT 'draft', -- 'draft', 'submitted', 'approved', 'rejected'
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application Tracking
CREATE TABLE lease_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES lease_quotes(id),
    employee_id UUID REFERENCES employees(id),
    application_data JSONB NOT NULL,
    pdf_url TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'approved', 'rejected'
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Rate Management
CREATE TABLE lease_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rate_type TEXT NOT NULL, -- 'interest', 'residual', 'admin_fee'
    vehicle_category TEXT, -- 'sedan', 'suv', 'ev', etc.
    rate_value DECIMAL(5,4) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Activity Log
CREATE TABLE admin_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    target_type TEXT, -- 'user', 'quote', 'rate', 'application'
    target_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 Portal Designs

### 1. Employee Portal
- **Landing**: Personal welcome, quick stats, recent activity
- **Dashboard**: Detailed commute analytics, lease calculator access
- **Features**: Vehicle management, emissions tracking, lease applications

### 2. Employer Portal  
- **Landing**: Company overview, fleet statistics
- **Dashboard**: Employee management, emissions reporting, cost analysis
- **Features**: Bulk employee import, policy management, reporting tools

### 3. MXDealer Portal
- **Landing**: Calculator access, quote management
- **Dashboard**: Client quotes, application pipeline, rate tools
- **Features**: Advanced calculator, quote generation, client management

### 4. Admin Dashboard
- **Overview**: System-wide statistics, recent activity
- **Management**: User access, quote tracking, rate updates
- **Features**: Application downloads, password resets, system monitoring

## 🔐 Authentication & Permissions

### User Roles
```javascript
const USER_ROLES = {
  EMPLOYEE: 'employee',
  EMPLOYER: 'employer', 
  MXDEALER: 'mxdealer',
  ADMIN: 'admin'
};

const PERMISSIONS = {
  EMPLOYEE: ['view_personal_data', 'create_quotes', 'submit_applications'],
  EMPLOYER: ['view_company_data', 'manage_employees', 'view_reports'],
  MXDEALER: ['manage_quotes', 'access_calculator', 'view_applications'],
  ADMIN: ['manage_users', 'manage_rates', 'view_all_data', 'system_admin']
};
```

## 🚀 Implementation Plan

### Phase 1: Portal Structure
1. Create portal directories and base components
2. Set up routing system with portal-specific layouts
3. Implement authentication flow for each portal

### Phase 2: Database Schema
1. Create new tables for multi-portal support
2. Set up RLS policies for data isolation
3. Create API endpoints for each portal

### Phase 3: Portal Development
1. **Employee Portal**: Personal dashboard with enhanced features
2. **Employer Portal**: Company management interface
3. **MXDealer Portal**: Calculator and quote management
4. **Admin Dashboard**: System administration tools

### Phase 4: Integration
1. Connect portals with shared authentication
2. Implement cross-portal data flow
3. Add admin oversight and management tools

## 📊 Calculator Enhancement

### Direct Calculator Access
- Modify iframe source to load calculator directly: 
  `https://www.mxdealeradvantage.com.au/calculator`
- Add pre-filled parameters from employee data
- Implement quote saving and retrieval

### Calculator Features
- Vehicle selection with company policy integration
- Real-time rate updates from admin dashboard
- Automatic quote generation and storage
- PDF application generation

This architecture provides complete separation of concerns while maintaining data integration and administrative oversight.
