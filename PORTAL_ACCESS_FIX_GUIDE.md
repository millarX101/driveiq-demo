# 🔧 Fix Portal Access - Get Access to All 4 Portals

## 🚨 **Problem:**
Your Google OAuth login only gives you access to the employee portal because your user ID in the database doesn't match your actual Google OAuth user ID.

## ✅ **Solution:**
Run the `fix-ben-portal-access.sql` script to automatically detect your real user ID and grant access to all portals.

## 📋 **Step-by-Step Instructions:**

### **Step 1: Open Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Open your `mxdealeradvantage-prod` project

### **Step 2: Open SQL Editor**
1. Click **SQL Editor** in the left sidebar
2. Click **New Query**

### **Step 3: Run the Fix Script**
1. Copy the entire contents of `fix-ben-portal-access.sql`
2. Paste it into the SQL Editor
3. Click **Run** (or press Ctrl+Enter)

### **Step 4: Check the Results**
The script will show you:
- ✅ Your actual Google OAuth user ID
- ✅ Confirmation that portal access was set up
- ✅ List of all 4 portals you now have access to

### **Step 5: Test All Portals**
Now you can access all 4 portals with your Google login:

1. **Employee Portal**: `/employee/login` 
   - Your personal employee dashboard

2. **Employer Portal**: `/employer/login`
   - Company management tools

3. **MXDealer Portal**: `/mxdealer/login` ⭐
   - **This is your MXIntegratedPlatform!**
   - Advanced calculator, user management, analytics

4. **Admin Portal**: `/admin/login`
   - System administration tools

## 🎯 **What the Script Does:**

### **Automatic Detection:**
- Finds your real Google OAuth user ID (not the hardcoded one)
- Uses your email `ben@millarX.com.au` to locate your account

### **Portal Access Setup:**
- **Admin**: Full system access with user management
- **Employer**: Company management for "Test Company Ltd"
- **Employee**: Personal dashboard and application access
- **MXDealer**: Dealer tools for "Test Motors" (Gold tier)

### **Clean Setup:**
- Removes any conflicting portal access entries
- Creates fresh, correct permissions for all portals
- Verifies everything worked correctly

## 🚀 **After Running the Script:**

1. **Log out** of your current session (if logged in)
2. **Go to any portal login page** (e.g., `/mxdealer/login`)
3. **Click "Sign in with Google"**
4. **You'll now have access to all portals!**

## 🎉 **Expected Result:**
After running this script, when you log in with Google OAuth, you'll be able to access:
- ✅ Employee dashboard
- ✅ Employer management tools  
- ✅ **MXDealer platform** (your MXIntegratedPlatform)
- ✅ Admin system tools

The script automatically handles the user ID matching so you don't need to worry about technical details!
