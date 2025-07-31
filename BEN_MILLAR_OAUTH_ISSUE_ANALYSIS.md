# Ben Millar Google OAuth Issue - Root Cause Analysis & Complete Fix

## Problem Summary
When Ben Millar logs in using Google OAuth, he's getting the same Supabase user ID and seeing "Michael Thompson" instead of "Ben Millar" in the dashboard header.

## Root Cause Analysis

### 1. **Google OAuth User ID Mismatch**
The core issue is that Ben Millar's Google OAuth user ID in the Supabase database doesn't match his actual Google OAuth user ID when he logs in.

**Current Database State:**
- Ben's user profile has `user_id: 'ben-millar-manager'` (generic placeholder)
- When he logs in with Google, Supabase generates a different user ID (like `google-oauth-abc123...`)
- The system can't find his profile, so it falls back to demo data or shows incorrect information

### 2. **Data Lookup Chain Failure**
The Employee Dashboard follows this lookup chain:
1. Get current session user ID from Supabase Auth
2. Look up user profile in `user_profiles` table using that user ID
3. Display the profile information (name, company, etc.)

**Where it breaks:**
- Step 2 fails because the user ID from Google OAuth doesn't exist in `user_profiles`
- System falls back to demo data or cached information
- Shows wrong name (Michael Thompson from demo data)

### 3. **Portal Access Issues**
Similar issue affects portal access:
- `portal_access` table uses the wrong user ID
- User can't access the correct portal or sees wrong data

## Complete Solution

### Step 1: Get Ben's Real Google OAuth User ID

**Method A: Check Supabase Auth Dashboard**
1. Go to Supabase Dashboard → Authentication → Users
2. Find Ben's Google login entry
3. Copy the actual user ID (starts with UUID format)

**Method B: Add Debug Code (Temporary)**
Add this to the Employee Dashboard to capture the real user ID:

```javascript
// Add this temporarily to EmployeeDashboard.jsx in loadUserData()
const { data: { session } } = await supabase.auth.getSession();
if (session?.user) {
  console.log('REAL USER ID:', session.user.id);
  console.log('USER EMAIL:', session.user.email);
  console.log('USER METADATA:', session.user.user_metadata);
}
```

### Step 2: Update Database with Correct User ID

Once you have Ben's real Google OAuth user ID, run this SQL:

```sql
-- Replace 'REAL_GOOGLE_OAUTH_USER_ID' with Ben's actual user ID from Step 1

-- Update user profile
UPDATE user_profiles 
SET user_id = 'REAL_GOOGLE_OAUTH_USER_ID'
WHERE email = 'ben@millarx.com' OR employee_id = 'TF-HR-001';

-- Update portal access
UPDATE portal_access 
SET user_id = 'REAL_GOOGLE_OAUTH_USER_ID'
WHERE user_id = 'ben-millar-manager';

-- Update company settings
UPDATE company_settings 
SET user_id = 'REAL_GOOGLE_OAUTH_USER_ID'
WHERE user_id = 'ben-millar-manager';

-- Update fleet vehicles
UPDATE fleet_vehicles 
SET user_id = 'REAL_GOOGLE_OAUTH_USER_ID'
WHERE user_id = 'ben-millar-manager';

-- Update carbon purchases
UPDATE carbon_purchases 
SET user_id = 'REAL_GOOGLE_OAUTH_USER_ID'
WHERE user_id = 'ben-millar-manager';
```

### Step 3: Verify the Fix

After updating the database:

1. **Clear Browser Cache/Storage**
   - Clear localStorage, sessionStorage
   - Clear browser cache
   - Or use incognito/private browsing

2. **Test Login Flow**
   - Go to the login page
   - Click "Login with Google"
   - Should now show "Ben Millar" in header
   - Should access Employer Portal correctly

### Step 4: Alternative Quick Fix (If Step 2 Doesn't Work)

If you can't easily get the real user ID, you can create a new profile entry:

```sql
-- Get Ben's session info first, then run:
INSERT INTO user_profiles (user_id, employee_id, full_name, email, company_name, company_id) 
VALUES ('BEN_REAL_GOOGLE_USER_ID', 'TF-HR-001', 'Ben Millar', 'ben@millarx.com', 'TechFlow Solutions Pty Ltd', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name;

-- Add portal access
INSERT INTO portal_access (user_id, company_id, portal_type, is_active) 
VALUES ('BEN_REAL_GOOGLE_USER_ID', '550e8400-e29b-41d4-a716-446655440000', 'employer', true)
ON CONFLICT DO NOTHING;
```

## Why This Happened

1. **Development vs Production IDs**: During development, placeholder user IDs were used instead of real OAuth IDs
2. **Missing OAuth Integration**: The database was populated before Google OAuth was properly configured
3. **ID Mismatch**: Google OAuth generates specific user IDs that don't match the placeholder IDs

## Prevention for Future Users

1. **Always use real OAuth user IDs** when setting up user profiles
2. **Test OAuth flow** before populating database with user data
3. **Use dynamic user ID capture** instead of hardcoded placeholder IDs

## Database Schema Used

The complete database setup includes:
- **150 employees** in TechFlow Solutions Pty Ltd
- **Realistic vehicle data** from Employee Entry Portal
- **Commute tracking data** for Employee Dashboard
- **Fleet management data** for Employer Dashboard
- **Carbon purchase history**
- **Proper indexing and RLS policies**

## Files Created/Updated

1. `complete-company-database-setup.sql` - Complete database with 150 employees
2. `BEN_MILLAR_OAUTH_ISSUE_ANALYSIS.md` - This analysis document

## Next Steps

1. **Run the complete database setup** using `complete-company-database-setup.sql`
2. **Get Ben's real Google OAuth user ID** using Method A or B above
3. **Update the database** with the correct user ID
4. **Test the login flow** to verify the fix
5. **Clear browser cache** if issues persist

The root cause is simply a user ID mismatch between what Google OAuth provides and what's stored in the database. Once aligned, Ben should see his correct name and access the right portal data.
