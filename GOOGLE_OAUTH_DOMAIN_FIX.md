# 🔧 Fix Google OAuth Domain Display Issue

## 🚨 **Problem:**
Your Google OAuth shows "to continue to ucrzzppbidhvuqefdiuw.supabase.co" instead of "millarX platform" because the OAuth configuration is pointing to the Supabase URL.

## ✅ **Two Solutions:**

### **Option 1: Update Google OAuth to Use Your Custom Domain (Recommended)**

#### **Step 1: Update Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID: `331000230058-5jc8lirsbvhncgh01s92014hhov85ecv.apps.googleusercontent.com`
4. Click **Edit** (pencil icon)

#### **Step 2: Update Application Name**
- Change **Application name** from current name to **"millarX Platform"**
- This will show "millarX Platform" instead of the Supabase URL

#### **Step 3: Update Authorized Domains**
Replace the Supabase domain with your preferred domains:
```
localhost
your-netlify-domain.netlify.app
millarx.com.au (if you have a custom domain)
```

#### **Step 4: Update Redirect URIs**
Replace Supabase URLs with your preferred URLs:
```
http://localhost:5173/auth/callback
http://localhost:5173/oauth/callback
http://localhost:5173/employee/login
http://localhost:5173/employer/login
http://localhost:5173/mxdealer/login
http://localhost:5173/admin/login

https://your-netlify-site.netlify.app/auth/callback
https://your-netlify-site.netlify.app/oauth/callback
https://your-netlify-site.netlify.app/employee/login
https://your-netlify-site.netlify.app/employer/login
https://your-netlify-site.netlify.app/mxdealer/login
https://your-netlify-site.netlify.app/admin/login
```

### **Option 2: Quick Fix - Just Change Application Name**

If you want to keep using Supabase OAuth but just change the display name:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Change **Application name** to **"millarX Platform"**
5. Save changes

This will show "to continue to millarX Platform" instead of the Supabase URL.

## 🎯 **Current OAuth Configuration:**

**Client ID:** `331000230058-5jc8lirsbvhncgh01s92014hhov85ecv.apps.googleusercontent.com`

**Current Redirect URLs (from your screenshot):**
- `ucrzzppbidhvuqefdiuw.supabase.co` (Supabase domain)

**Your Supabase Project:**
- **URL:** `https://ucrzzppbidhvuqefdiuw.supabase.co`
- **Project:** `mxdealeradvantage-prod`

## 🚀 **Recommended Approach:**

### **For Development:**
Use **Option 2** (just change the application name) for quick testing, then:

1. **Change Application Name** to "millarX Platform"
2. **Add localhost URLs** to redirect URIs for local development
3. **Keep existing Supabase URLs** for production

### **For Production:**
Eventually move to **Option 1** with your own custom domain:

1. **Set up custom domain** (e.g., `app.millarx.com.au`)
2. **Update OAuth configuration** to use custom domain
3. **Configure DNS** to point to your Netlify deployment

## 🔧 **Quick Fix Steps:**

1. **Go to Google Cloud Console**
2. **Edit your OAuth Client ID**
3. **Change Application name** to "millarX Platform"
4. **Add localhost redirect URIs** for development:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/mxdealer/login
   ```
5. **Save changes**

After this, your OAuth will show "to continue to millarX Platform" and you can test locally!

## 📧 **Email Accounts Available:**
From your screenshot, you have access to:
- `ben@millarx.com.au` ⭐ (Use this one - matches your database setup)
- `benmillar79@gmail.com`
- `ben@mxdriveiq.com.au`

Make sure to use `ben@millarx.com.au` for testing since that's what the database scripts are configured for.
