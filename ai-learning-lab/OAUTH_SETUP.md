# OAuth Setup Guide for AI Learning Lab

This guide will help you set up OAuth authentication for local development.

## Quick Start

Run the automated setup script:

```bash
./setup-oauth.sh
```

Or follow the manual instructions below.

---

## Manual Setup Instructions

### 1. Google OAuth Setup

#### A. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: **AI Learning Lab Dev**
3. Enable **Google+ API** or **Google Identity Services**

#### B. Configure OAuth Consent Screen

1. Navigate to: **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Fill in required fields:
   - App name: `AI Learning Lab`
   - User support email: Your email
   - Developer contact: Your email
4. Add test users (your email)
5. Save and continue

#### C. Create Credentials

1. Navigate to: **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Name: `AI Learning Lab - Development`
5. Add **Authorized redirect URI**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Click **Create**
7. **Copy the Client ID and Client Secret**

---

### 2. GitHub OAuth Setup

#### A. Create OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - Application name: `AI Learning Lab (Development)`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**

#### B. Generate Client Secret

1. After creation, click **Generate a new client secret**
2. **IMPORTANT**: Copy the secret immediately (you can't view it again!)
3. **Copy the Client ID and Client Secret**

---

### 3. Update .env File

Add your credentials to the `.env` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="Iv1.your-github-client-id"
GITHUB_CLIENT_SECRET="ghp_your-github-client-secret"
```

---

## Verification

1. **Check your .env file**:
   ```bash
   cat .env | grep -E "(GOOGLE|GITHUB)"
   ```

2. **Restart your development server**:
   ```bash
   npm run dev
   ```

3. **Test OAuth login**:
   - Visit: http://localhost:3000/login
   - Try signing in with Google
   - Try signing in with GitHub

---

## Troubleshooting

### Error: "Redirect URI mismatch"
- **Cause**: The redirect URI in your OAuth app doesn't match
- **Fix**: Ensure the redirect URI is exactly:
  - Google: `http://localhost:3000/api/auth/callback/google`
  - GitHub: `http://localhost:3000/api/auth/callback/github`
- **Note**: No trailing slash, must use `http` (not `https`) for localhost

### Error: "Access blocked: This app's request is invalid"
- **Cause**: OAuth consent screen not configured or test users not added
- **Fix**:
  - Go to OAuth consent screen in Google Cloud Console
  - Add your email as a test user
  - Ensure app is in "Testing" mode

### Error: "Invalid client"
- **Cause**: Client ID or Secret is incorrect
- **Fix**:
  - Double-check credentials in .env file
  - Ensure no extra spaces or quotes
  - Regenerate credentials if needed

### Login redirects but doesn't complete
- **Cause**: NextAuth secret not set or database connection issue
- **Fix**:
  - Check `NEXTAUTH_SECRET` is set in .env
  - Ensure PostgreSQL is running: `docker-compose ps`
  - Check database connection: `npx prisma db push --skip-generate`

---

## Security Best Practices

1. **Never commit .env file** - Already in .gitignore
2. **Use different credentials for production**
3. **Rotate secrets regularly**
4. **Limit OAuth scopes to minimum required**
5. **Add only necessary test users**
6. **Review OAuth app permissions regularly**

---

## Production Deployment

For production, you'll need to:

1. **Google Cloud**:
   - Create a production project
   - Publish OAuth consent screen (verification required)
   - Update redirect URIs to production domain
   - Use environment variables in hosting platform

2. **GitHub**:
   - Create a separate production OAuth app
   - Update callback URL to production domain
   - Store secrets securely in hosting platform

3. **Environment Variables**:
   - Set all OAuth credentials in production environment
   - Never hardcode credentials
   - Use secret management (Vercel, AWS Secrets Manager, etc.)

---

## Need Help?

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
