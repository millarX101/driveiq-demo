# MXDealerAdvantage - Dealer Testing Guide

## 🎯 **Ready for Dealer Testing**

Your MXDealerAdvantage platform is now ready for dealer testing with:
- ✅ Real-time Supabase data integration
- ✅ Professional dealer dashboard
- ✅ Your existing calculator integration
- ✅ Quote and application management
- ✅ User management system

## 🚀 **How to Create Dealer Accounts**

### Option 1: Admin Interface (Recommended)
1. **Access Admin Dashboard**: Go to `/admin` and login with admin credentials
2. **Use Dealer Management**: Navigate to the dealer management section
3. **Add New Dealer**: Fill out dealer details (name, email, dealership, etc.)
4. **Generate Invite Link**: System creates a unique invite link
5. **Share Link**: Send the invite link to the dealer via email

### Option 2: Direct Google Sign-up
Dealers can sign up directly using Google OAuth:
1. **Send Dealer to Login**: Direct them to `/mxdealer/login`
2. **Google Sign-in**: They click "Sign in with Google"
3. **Auto-Setup**: System automatically creates their dealer account
4. **Manual Configuration**: You may need to manually set their permissions in Supabase

## 📧 **Dealer Invite Process**

### Step 1: Create Invite
```
1. Admin creates dealer account with details:
   - Full Name: "John Smith"
   - Email: "john@premiummotors.com.au"
   - Dealership: "Premium Motors Melbourne"
   - Territory: "Melbourne Metro"
   - Tier: "Gold Partner"

2. System generates invite link:
   https://yoursite.com/mxdealer/login?invite=john@premiummotors.com.au
```

### Step 2: Send to Dealer
```
Subject: Welcome to MXDealerAdvantage - Your Dealer Portal Access

Hi John,

You've been invited to join MXDealerAdvantage, our professional novated leasing platform.

Your dealer portal includes:
✅ Professional lease calculator
✅ Quote management system
✅ Application tracking
✅ Performance analytics

Click here to access your account:
https://yoursite.com/mxdealer/login?invite=john@premiummotors.com.au

Simply sign in with your Google account to get started.

Best regards,
MXDealerAdvantage Team
```

### Step 3: Dealer Access
1. **Dealer clicks invite link**
2. **Signs in with Google**
3. **System auto-configures their account**
4. **Redirected to dealer dashboard**

## 🧪 **Testing Scenarios**

### Test 1: Account Creation
- [ ] Create dealer invite via admin interface
- [ ] Copy invite link
- [ ] Test invite link in incognito browser
- [ ] Verify Google sign-in works
- [ ] Check dealer dashboard loads correctly

### Test 2: Calculator Integration
- [ ] Navigate to "New Quote" section
- [ ] Click "Open Calculator" button
- [ ] Verify your calculator loads in modal
- [ ] Test calculator functionality
- [ ] Confirm quotes can be generated

### Test 3: Data Integration
- [ ] Create test quotes in your calculator
- [ ] Verify quotes appear in dashboard
- [ ] Check quote details display correctly
- [ ] Test search and filtering
- [ ] Verify metrics update automatically

### Test 4: Applications Flow
- [ ] Submit test applications
- [ ] Check applications appear in dealer dashboard
- [ ] Verify application details are correct
- [ ] Test application status updates

## 🔧 **Current Setup Status**

### ✅ **Working Features**
- Professional dealer dashboard
- Your existing calculator integration
- Real-time Supabase data loading
- Quote management with search/filter
- Application tracking
- Performance metrics (calculated from real data)
- User management system
- Google OAuth authentication

### 🚧 **Manual Setup Required**
- **Supabase Portal Access**: You'll need to manually add dealer portal access records
- **Admin Account**: Set up your admin account in the `portal_access` table
- **Rate Configuration**: Update lease rates in the `lease_rates` table if needed

## 📊 **Database Setup for Testing**

### Add Admin Access (Run in Supabase SQL Editor)
```sql
-- Replace 'your-admin-user-id' with your actual user ID from auth.users
INSERT INTO portal_access (user_id, portal_type, permissions, is_active)
VALUES (
    'your-admin-user-id',
    'admin',
    '{"manage_users": true, "manage_rates": true, "view_all_data": true}',
    true
);
```

### Add Dealer Access (After they sign up)
```sql
-- Replace 'dealer-user-id' with their user ID from auth.users
INSERT INTO portal_access (user_id, portal_type, permissions, is_active)
VALUES (
    'dealer-user-id',
    'mxdealer',
    '{
        "dealership_name": "Premium Motors Melbourne",
        "territory": "Melbourne Metro",
        "tier": "Gold Partner",
        "phone": "+61 3 9123 4567"
    }',
    true
);
```

## 🎯 **Dealer Testing Checklist**

### Pre-Testing Setup
- [ ] Verify Supabase connection is working
- [ ] Confirm your calculator URL is accessible
- [ ] Set up admin account in database
- [ ] Test Google OAuth is configured

### Dealer Onboarding Test
- [ ] Create dealer invite
- [ ] Send invite link to test dealer
- [ ] Verify they can sign in with Google
- [ ] Check their dashboard loads with correct branding
- [ ] Confirm calculator opens and works

### Functionality Testing
- [ ] Test quote creation and saving
- [ ] Verify quotes appear in dashboard
- [ ] Check application submission flow
- [ ] Test search and filtering features
- [ ] Verify metrics calculations

### Performance Testing
- [ ] Test dashboard loading speed
- [ ] Check calculator modal performance
- [ ] Verify data updates in real-time
- [ ] Test mobile responsiveness

## 📞 **Support for Dealers**

### Common Issues & Solutions

**Issue**: "Calculator won't load"
**Solution**: Check if your calculator URL is accessible and HTTPS

**Issue**: "No quotes showing"
**Solution**: Verify Supabase RLS policies allow dealer to see quotes

**Issue**: "Can't sign in"
**Solution**: Confirm Google OAuth is properly configured

**Issue**: "Dashboard shows no data"
**Solution**: Check if dealer has proper portal_access record

## 🚀 **Ready to Launch**

Your platform is now ready for dealer testing! The system provides:

1. **Professional Experience**: Clean, modern dealer dashboard
2. **Your Calculator**: Seamlessly integrated existing calculator
3. **Real Data**: Live connection to your Supabase backend
4. **Easy Onboarding**: Simple invite link system
5. **Comprehensive Management**: Full quote and application tracking

Send the invite links to your test dealers and start gathering feedback!
