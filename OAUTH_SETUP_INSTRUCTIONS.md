# Quick OAuth Setup Instructions

## Your Google OAuth Credentials ✅
- **Client ID**: [Your Google OAuth Client ID]
- **Client Secret**: [Your Google OAuth Client Secret]

## Step 1: Find Your Client Secret & Update Google Cloud Console

### Finding Your Client Secret:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Find your OAuth 2.0 Client ID

2. **Click on the Client ID name** (not the edit button)
   - This will open a modal/popup showing your credentials

3. **Look for "Client Secret"**
   - It should be displayed alongside your Client ID
   - If it shows "••••••••••••••••", click the "Show" or "👁️" icon to reveal it
   - Copy this secret - you'll need it for Supabase

### If You Still Can't Find the Secret:

**Option A: Download JSON**
- Click the "Download JSON" button (📥 icon) next to your OAuth credentials
- Open the downloaded file - the `client_secret` field contains your secret

**Option B: Reset the Secret**
- Click "Edit" on your OAuth credentials
- Look for "Reset Secret" or "Generate New Secret" button
- This will create a new secret (the old one will stop working)

### Update the OAuth Settings:

4. **Click "Edit" on your existing OAuth credentials**

5. **Add these URLs to "Authorized JavaScript origins":**
   ```
   http://localhost:5177
   ```
   (Keep your existing origins for the quote engine)

6. **Add this URL to "Authorized redirect URIs":**
   ```
   https://[YOUR_SUPABASE_PROJECT_ID].supabase.co/auth/v1/callback
   ```

7. **Save the changes**

## Step 2: Configure Supabase (3 minutes)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]

2. **Navigate to Authentication > Providers**

3. **Find "Google" and toggle it ON**

4. **Enter your credentials:**
   - **Client ID**: [Your Google OAuth Client ID]
   - **Client Secret**: [Paste from Google Cloud Console]

5. **Click "Save"**

## Step 3: Update Site URL in Supabase

1. **Go to Authentication > Settings**

2. **Set Site URL to:**
   ```
   http://localhost:5177
   ```

3. **Add to Redirect URLs:**
   ```
   http://localhost:5177/dashboard
   ```

4. **Save changes**

## Step 4: Test the Integration

1. **Navigate to:** http://localhost:5177/demo

2. **Click "Continue with Google"**

3. **Complete Google OAuth flow**

4. **Should redirect back to dashboard**

## That's it! 🎉

Your dashboard will now support Google authentication alongside the demo accounts.
