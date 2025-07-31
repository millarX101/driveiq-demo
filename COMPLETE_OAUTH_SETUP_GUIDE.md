# 🚀 Complete OAuth Setup Guide - Fix Both Issues

## 🎯 **Two Issues to Fix:**

### **Issue 1: OAuth Shows Supabase URL Instead of "millarX Platform"**
### **Issue 2: You Only Have Employee Portal Access**

## ✅ **Complete Solution:**

### **Step 1: Fix Google OAuth Display Name**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Navigate to APIs & Services → Credentials**
3. **Find your OAuth Client ID:** `331000230058-5jc8lirsbvhncgh01s92014hhov85ecv.apps.googleusercontent.com`
4. **Click Edit (pencil icon)**
5. **Change Application name to:** `millarX Platform`
6. **Add localhost redirect URIs for development:**
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/oauth/callback
   http://localhost:5173/mxdealer/login
   http://localhost:5173/employee/login
   http://localhost:5173/employer/login
   http://localhost:5173/admin/login
   ```
7. **Save changes**

### **Step 2: Complete Database Setup**

1. **Go to [Supabase](https://supabase.com)** → your `mxdealeradvantage-prod` project
2. **Open SQL Editor → New Query**
3. **Copy/paste the entire `complete-database-setup-ben.sql` script**
4. **Click Run**

The script will:
- ✅ Create all necessary tables (companies, employees, portal_access, lease_applications, lease_rates)
- ✅ Find your actual Google OAuth user ID (works with any of your 3 email addresses)
- ✅ Grant access to all 4 portals (Employee, Employer, MXDealer, Admin)
- ✅ Set up proper permissions for each portal
- ✅ Create sample data for testing
- ✅ Verify everything worked correctly

### **Step 3: Test All Portals**

After completing steps 1 & 2, you can access:

1. **Employee Portal**: `http://localhost:5173/employee/login`
   - Personal employee dashboard and applications

2. **Employer Portal**: `http://localhost:5173/employer/login`
   - Company management tools for "Test Company Ltd"

3. **MXDealer Portal**: `http://localhost:5173/mxdealer/login` ⭐
   - **Your MXIntegratedPlatform!**
   - Advanced calculator with Supabase integration
   - User management tools
   - Analytics dashboard
   - Dual platform mode (DriveIQ/DealerAdvantage)

4. **Admin Portal**: `http://localhost:5173/admin/login`
   - System administration tools

## 🎉 **Expected Results:**

### **After Step 1 (Google OAuth Fix):**
- OAuth will show "Sign in with Google to continue to **millarX Platform**"
- No more Supabase URL in the OAuth screen
- Clean, professional branding

### **After Step 2 (Database Fix):**
- You'll have access to all 4 portals with any of your email addresses:
  - `ben@millarx.com.au` ⭐ (recommended)
  - `benmillar79@gmail.com`
  - `ben@mxdriveiq.com.au`

### **After Step 3 (Testing):**
- Full access to your MXIntegratedPlatform
- All calculator functions working with real Supabase data
- User management tools functional
- Professional dealer dashboard experience

## 🔧 **Technical Details:**

### **Your OAuth Configuration:**
- **Client ID:** `331000230058-5jc8lirsbvhncgh01s92014hhov85ecv.apps.googleusercontent.com`
- **Supabase Project:** `mxdealeradvantage-prod`
- **Supabase URL:** `https://ucrzzppbidhvuqefdiuw.supabase.co`

### **Portal Permissions Being Set:**
- **Admin:** Full system access, user management, rate management
- **Employer:** Company management for "Test Company Ltd"
- **Employee:** Personal dashboard, application access
- **MXDealer:** Dealer tools for "Test Motors" (Gold tier, Melbourne territory)

## 🚨 **Important Notes:**

1. **Use `ben@millarx.com.au`** for testing (matches database setup)
2. **Complete both steps** - OAuth display fix AND database portal access fix
3. **Log out and back in** after running the database script
4. **Test locally first** before deploying to production

## 🎯 **Quick Checklist:**

- [ ] Update Google OAuth application name to "millarX Platform"
- [ ] Add localhost redirect URIs to Google OAuth
- [ ] Run `complete-database-setup-ben.sql` in Supabase
- [ ] Verify script shows "SUCCESS" messages
- [ ] Log out of current session
- [ ] Test login at `/mxdealer/login`
- [ ] Confirm access to MXIntegratedPlatform
- [ ] Test other portals (employee, employer, admin)

After completing these steps, you'll have a fully functional multi-portal system with professional OAuth branding and access to your complete MXIntegratedPlatform!
