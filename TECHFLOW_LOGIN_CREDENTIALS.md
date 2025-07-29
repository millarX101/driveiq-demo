# TechFlow Solutions - Demo Login Credentials

## How to Access Each Portal

All portals now have unified login screens with demo credentials displayed. You can access them at:

- **Employee Portal**: `http://localhost:5175/employee/login`
- **Employer Portal**: `http://localhost:5175/employer/login`
- **MXDealer Portal**: `http://localhost:5175/mxdealer/login`
- **Admin Portal**: `http://localhost:5175/admin/login`

## Demo Login Credentials

### Employee Portal (7 Different Employees)

**Sarah Chen (EV Owner - Tesla Model 3)**
- Email: `sarah.chen@techflowsolutions.com.au`
- Password: `demo123`
- Profile: Senior Software Engineer, WFH 3 days, bikes to office

**Michael Rodriguez (Hybrid Owner - RAV4)**
- Email: `michael.rodriguez@techflowsolutions.com.au`
- Password: `demo123`
- Profile: Product Manager, daily car commuter

**Emma Thompson (Mixed Mode Commuter)**
- Email: `emma.thompson@techflowsolutions.com.au`
- Password: `demo123`
- Profile: Marketing Director, WFH 3 days, car+train when in office

**James Wilson (Field Worker - Diesel Ute)**
- Email: `james.wilson@techflowsolutions.com.au`
- Password: `demo123`
- Profile: Field Operations Manager, daily driver with longer commutes

**Alex Kim (Bike Commuter - No Lease)**
- Email: `alex.kim@techflowsolutions.com.au`
- Password: `demo123`
- Profile: UX Designer, WFH 3 days, bikes when in office

**Lisa Patel (Full-time Office - No Lease)**
- Email: `lisa.patel@techflowsolutions.com.au`
- Password: `demo123`
- Profile: Data Analyst, daily car commuter

**David Nguyen (Mixed Mode - No Lease)**
- Email: `david.nguyen@techflowsolutions.com.au`
- Password: `demo123`
- Profile: DevOps Engineer, car+train commuter

### Employer Portal

**Jennifer Walsh (HR Director)**
- Email: `hr@techflowsolutions.com.au`
- Password: `admin123`
- Profile: HR Director managing TechFlow Solutions fleet

### MXDealer Portal

**MX Dealer Account**
- Email: `dealer@mxdriveiq.com.au`
- Password: `dealer123`
- Profile: Dealer management portal

### Admin Portal

**System Administrator**
- Email: `admin@mxdriveiq.com.au`
- Password: `admin123`
- Profile: System administration portal

## Features of the New Login System

### 1. **Click-to-Fill Credentials**
- Each login page displays the available demo credentials
- Click any credential to auto-fill the login form
- No need to manually type usernames/passwords

### 2. **Portal Switching**
- Easy navigation between different portals from any login page
- Color-coded portal indicators (Employee=Blue, Employer=Green, MXDealer=Purple, Admin=Red)

### 3. **Automatic Data Loading**
- Employee logins automatically load the correct employee's data from Supabase
- Real commute history, vehicle information, and company data
- Live database integration for new entries

### 4. **Professional Appearance**
- Custom MXDriveIQ branding
- Portal-specific icons and colors
- Clean, modern interface suitable for stakeholder demos

## Demo Flow for Friday Presentation

### Quick Employee Demo:
1. Go to `http://localhost:5175/employee/login`
2. Click "Sarah Chen" credentials to auto-fill
3. Click "Sign in to Employee Portal"
4. Instantly access Tesla owner dashboard with real data

### Multi-Portal Demo:
1. Start with Employee portal (Sarah Chen - EV success story)
2. Switch to Employer portal (Jennifer Walsh - company overview)
3. Show MXDealer portal (dealer management features)
4. Demonstrate Admin portal (system administration)

### Live Data Demo:
1. Login as any employee
2. Navigate to "Commute Tracking" tab
3. Add new commute segments in real-time
4. Show immediate database persistence
5. Demonstrate multi-modal journey tracking

## Technical Notes

- All credentials are stored in the demo system (not real Supabase Auth)
- Employee data is pulled from the TechFlow Solutions dataset
- New commute entries save directly to Supabase database
- Session management through localStorage for demo purposes
- Automatic redirection to appropriate dashboards

This unified login system provides a professional, easy-to-use interface for demonstrating all aspects of MXDriveIQ across different user types and scenarios.
