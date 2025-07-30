# Quick Testing Checklist - Live Supabase Integration

## 🚀 **Quick Start Testing (15 minutes)**

### **Step 1: Initial Setup** ⏱️ 2 minutes
- [ ] Make sure your dev server is running (`npm run dev`)
- [ ] Open your Supabase project dashboard
- [ ] Have 4 browser tabs ready for testing

### **Step 2: Get Your User ID** ⏱️ 2 minutes
1. [ ] Go to `http://localhost:5173/employee/login`
2. [ ] Click "Sign in with Google" (blue button at top)
3. [ ] Sign in with your Google account
4. [ ] Go to Supabase → Authentication → Users
5. [ ] Copy your User ID (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### **Step 3: Set Up Database** ⏱️ 3 minutes
1. [ ] Open Supabase SQL Editor
2. [ ] Copy the `supabase-live-testing-setup.sql` file content
3. [ ] Replace `'your-email@gmail.com'` with your actual Google email
4. [ ] Replace `'your-google-user-id'` with your actual User ID (4 places)
5. [ ] Run the SQL script

### **Step 4: Test All Portals** ⏱️ 5 minutes

#### Employee Portal Test
- [ ] Go to `http://localhost:5173/employee/login`
- [ ] Sign in with Google
- [ ] Should see "Test Company Ltd" dashboard
- [ ] Check if sample quote appears

#### Employer Portal Test  
- [ ] Go to `http://localhost:5173/employer/login`
- [ ] Sign in with same Google account
- [ ] Should see "Test Company Ltd" employer dashboard
- [ ] Check if sample application appears

#### Dealer Portal Test
- [ ] Go to `http://localhost:5173/mxdealer/login`
- [ ] Sign in with same Google account
- [ ] Should see "Test Motors" dealer dashboard
- [ ] Check if sample quote appears in quotes section
- [ ] Click "Open Calculator" - should open your calculator

#### Admin Portal Test
- [ ] Go to `http://localhost:5173/admin/login`
- [ ] Sign in with same Google account
- [ ] Should see admin dashboard with metrics
- [ ] Click "Dealers" tab - should see dealer management interface

### **Step 5: Test Data Flow** ⏱️ 3 minutes
- [ ] In Employee portal: Try to create a new quote using calculator
- [ ] In Dealer portal: Refresh and check if new quote appears
- [ ] In Admin portal: Check if metrics updated

## ✅ **Success Indicators**

If everything is working, you should see:
- [ ] Can access all 4 portals with same Google account
- [ ] Each portal shows appropriate branding and data
- [ ] Sample data appears in all relevant portals
- [ ] Calculator opens in dealer portal
- [ ] Data created in one portal appears in others

## ❌ **Common Issues & Quick Fixes**

### "Access Denied" or "No Portal Access"
**Fix**: Check your `portal_access` records in Supabase
```sql
SELECT * FROM portal_access WHERE user_id = 'your-user-id';
```

### "No Data Showing"
**Fix**: Verify your test data was created
```sql
SELECT * FROM active_quotes_view;
SELECT * FROM pending_applications_view;
```

### "Calculator Won't Load"
**Fix**: Check if your calculator URL is accessible
- Try opening `https://mxdealeradvantage.com.au` directly

### "Authentication Issues"
**Fix**: Check Google OAuth setup in Supabase
- Go to Supabase → Authentication → Settings
- Verify Google OAuth is enabled

## 🎯 **What This Tests**

✅ **Authentication**: Google OAuth across all portals
✅ **Database Integration**: Real Supabase data loading
✅ **Cross-Platform Data**: Data visibility across portals
✅ **Calculator Integration**: Your existing calculator in dealer portal
✅ **User Permissions**: Role-based access control
✅ **Real-Time Updates**: Data synchronization

## 📞 **If You Need Help**

1. **Check browser console** for any JavaScript errors
2. **Check Supabase logs** for database errors
3. **Verify your .env.local** has correct Supabase credentials
4. **Test each portal individually** to isolate issues

## 🚀 **Next Steps After Testing**

Once basic testing works:
- [ ] Create real dealer accounts using admin interface
- [ ] Test with actual vehicle data from your calculator
- [ ] Invite real dealers to test the platform
- [ ] Monitor performance and gather feedback

This quick test will verify your entire multi-portal system is working with live Supabase data!
