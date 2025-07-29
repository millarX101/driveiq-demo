# Google Authentication Setup Guide

This guide will help you configure Google OAuth authentication for the MXDriveIQ dashboard through Supabase.

## Prerequisites

- Supabase project set up and running
- Google Cloud Console access
- Domain configured for production (for live testing)

## Step 1: Configure Google OAuth in Google Cloud Console

### Option A: Reuse Existing Quote Engine Credentials (Recommended)

If you already have Google OAuth credentials set up for the quote engine, you can reuse them:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select the same project used for the quote engine

2. **Update Existing OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Find your existing OAuth 2.0 Client ID
   - Click "Edit" on the existing credentials

3. **Add New Authorized URLs**
   
   **Add to Authorized JavaScript origins:**
   - `http://localhost:5177` (for development)
   - Your production domain (if different from quote engine)

   **Add to Authorized redirect URIs:**
   - `https://ucrzzppbidhvuqefdiuw.supabase.co/auth/v1/callback`

4. **Use Existing Client ID and Secret**
   - Use the same Client ID and Client Secret from your quote engine

### Option B: Create New Credentials (If Needed)

Only if you need separate credentials:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing project

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Name: "MXDriveIQ Dashboard"

4. **Configure Authorized URLs**
   
   **For Development:**
   - Authorized JavaScript origins: `http://localhost:5177`
   - Authorized redirect URIs: `https://ucrzzppbidhvuqefdiuw.supabase.co/auth/v1/callback`

   **For Production:**
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://ucrzzppbidhvuqefdiuw.supabase.co/auth/v1/callback`

5. **Save Client ID and Secret**
   - Copy the Client ID and Client Secret for the next step

## Step 2: Configure Supabase Authentication

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `ucrzzppbidhvuqefdiuw`

2. **Navigate to Authentication Settings**
   - Go to "Authentication" > "Providers"
   - Find "Google" in the list

3. **Enable Google Provider**
   - Toggle "Enable sign in with Google" to ON
   - Enter your Google Client ID
   - Enter your Google Client Secret
   - Click "Save"

4. **Configure Site URL**
   - Go to "Authentication" > "Settings"
   - Set Site URL to:
     - Development: `http://localhost:5173`
     - Production: `https://yourdomain.com`

5. **Add Redirect URLs**
   - Add these URLs to "Redirect URLs":
     - `http://localhost:5173/dashboard` (development)
     - `https://yourdomain.com/dashboard` (production)

## Step 3: Update Application Configuration

The application is already configured to handle Google authentication. The key components are:

1. **Supabase Client Configuration** (`src/supabaseClient.js`)
   - OAuth detection enabled
   - Session persistence configured
   - Auth state change handling

2. **Dashboard Component** (`src/components/Dashboard.jsx`)
   - Google sign-in button implemented
   - OAuth redirect handling
   - Session management

## Step 4: Test the Integration

### Development Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the application:**
   - Open: http://localhost:5173

3. **Test Google Sign-In:**
   - Click "Continue with Google"
   - Complete Google OAuth flow
   - Should redirect back to dashboard

### Production Testing

1. **Deploy to your domain**
2. **Update Google Cloud Console URLs** (if different from setup)
3. **Update Supabase redirect URLs**
4. **Test the complete flow**

## Step 5: Database Integration

The application will automatically:

1. **Create user records** in Supabase auth.users table
2. **Load company data** from the companies table
3. **Fetch transport logs** for dashboard analytics
4. **Handle role-based access** (admin vs employee)

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**
   - Check Google Cloud Console authorized redirect URIs
   - Ensure Supabase callback URL is correct

2. **"Site URL mismatch" error**
   - Check Supabase Site URL configuration
   - Ensure redirect URLs are properly configured

3. **Session not persisting**
   - Check browser local storage
   - Verify Supabase client configuration

4. **Data not loading**
   - Check Supabase database setup
   - Verify RLS policies are configured
   - Check browser console for errors

### Debug Steps:

1. **Check browser console** for authentication errors
2. **Verify Supabase logs** in the dashboard
3. **Test with demo accounts** first
4. **Check network tab** for failed API calls

## Security Considerations

1. **Row Level Security (RLS)**
   - Enable RLS on all tables
   - Create policies for user access

2. **Environment Variables**
   - Keep Supabase keys secure
   - Use different keys for dev/prod

3. **Domain Restrictions**
   - Limit OAuth to specific domains
   - Use HTTPS in production

## Next Steps

1. **Set up RLS policies** for data security
2. **Configure email templates** in Supabase
3. **Add user profile management**
4. **Implement role-based permissions**
5. **Set up monitoring and analytics**

## Support

For issues with this setup:
1. Check Supabase documentation: https://supabase.com/docs/guides/auth
2. Google OAuth documentation: https://developers.google.com/identity/protocols/oauth2
3. Review application logs and browser console
