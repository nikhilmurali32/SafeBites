# Auth0 Integration Setup Guide

This guide will help you set up Auth0 authentication for SafeBite.

## 📋 Prerequisites

- Node.js and npm installed
- Auth0 account (sign up at https://auth0.com)

## 🔧 Step 1: Create Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Applications**
3. Click **Create Application**
4. Choose a name (e.g., "SafeBite")
5. Select **Regular Web Applications**
6. Click **Create**

## ⚙️ Step 2: Configure Application Settings

In your Auth0 application settings:

### Allowed Callback URLs
```
http://localhost:3000/api/auth/callback
```

### Allowed Logout URLs
```
http://localhost:3000
```

### Allowed Web Origins
```
http://localhost:3000
```

Click **Save Changes**

## 🔐 Step 3: Get Your Credentials

From the Auth0 application settings page, note down:

- **Domain** (e.g., `your-tenant.us.auth0.com`)
- **Client ID**
- **Client Secret**

## 📝 Step 4: Configure Environment Variables

Create a `.env.local` file in the `Front-end` directory:

```bash
# Auth0 Configuration
AUTH0_CLIENT_ID=your_client_id_here
AUTH0_CLIENT_SECRET=your_client_secret_here
AUTH0_ISSUER_BASE_URL=https://your-tenant.region.auth0.com
AUTH0_BASE_URL=http://localhost:3000
AUTH0_SECRET=use_openssl_rand_hex_32_to_generate_this
```

### Generate AUTH0_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -hex 32
```

Copy the output and use it as your `AUTH0_SECRET` value.

## 📦 Step 5: Install Dependencies

```bash
cd Front-end
npm install
```

This will install:
- `@auth0/nextjs-auth0` - Auth0 SDK for Next.js

## 🚀 Step 6: Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` and test the login flow!

## 🗄️ User Database Structure

User data and scan history are stored in `lib/db/users.json`:

```json
{
  "users": {
    "user_auth0_id": {
      "id": "user_auth0_id",
      "email": "user@example.com",
      "name": "User Name",
      "picture": "https://...",
      "allergies": ["peanuts", "soy"],
      "dietGoals": ["vegan", "organic"],
      "avoidIngredients": ["hfcs", "msg"],
      "createdAt": "2024-01-15T10:30:00Z",
      "scans": [
        {
          "id": "scan_1",
          "productName": "Product Name",
          "brand": "Brand Name",
          "image": "🥛",
          "safetyScore": 85,
          "isSafe": true,
          "timestamp": "2024-11-08T08:00:00Z",
          "ingredients": [...]
        }
      ]
    }
  }
}
```

## 🔄 API Routes

The app includes the following API routes:

### Authentication
- `GET /api/auth/login` - Initiates login
- `GET /api/auth/logout` - Logs out user
- `GET /api/auth/callback` - Auth0 callback
- `GET /api/auth/me` - Get current user

### User Data
- `GET /api/user` - Get current user profile
- `POST /api/user/preferences` - Update user preferences
- `GET /api/user/stats` - Get user statistics

### Scans
- `GET /api/user/scans?limit=10` - Get user's scan history
- `POST /api/user/scans` - Save a new scan

## 🔒 How Authentication Works

1. **Login Flow:**
   - User clicks "Continue with Auth0"
   - Redirects to `/api/auth/login`
   - Auth0 handles authentication
   - Redirects back to `/api/auth/callback`
   - User is logged in and redirected to onboarding/dashboard

2. **Session Management:**
   - Auth0 SDK manages encrypted sessions
   - Session stored in secure HTTP-only cookies
   - Automatic session refresh

3. **Protected Routes:**
   - API routes check for valid session using `getSession()`
   - Returns 401 if not authenticated

## 📊 User Flow

```
Login → Onboarding (save preferences) → Dashboard (fetch user data)
  ↓                                              ↓
Auth0                                     Display scans from DB
  ↓                                              ↓
Create/Get User                            Scan New Item
  ↓                                              ↓
Save to users.json                        Save to users.json
```

## 🎯 Features

✅ **Secure Authentication** via Auth0
✅ **User Profile Management**
✅ **Persistent Scan History** per user
✅ **Onboarding Preferences** saved to database
✅ **Real-time Stats** (scans today, safe vs risky)
✅ **Automatic User Creation** on first login

## 🔧 Troubleshooting

### "Unauthorized" error
- Check that `.env.local` has correct Auth0 credentials
- Verify callback URLs in Auth0 dashboard

### Users not saving
- Check file permissions for `lib/db/users.json`
- Ensure the file exists and is valid JSON

### Session not persisting
- Check `AUTH0_SECRET` is set correctly
- Clear cookies and try again

## 🌐 Production Deployment

For production, update:

1. **Auth0 Application Settings:**
   - Add production URLs to Allowed Callback URLs
   - Add production URLs to Allowed Logout URLs
   - Add production URLs to Allowed Web Origins

2. **Environment Variables:**
   ```
   AUTH0_BASE_URL=https://your-production-domain.com
   ```

3. **Database:**
   - Consider migrating from JSON to a proper database (PostgreSQL, MongoDB, etc.)

## 📚 Additional Resources

- [Auth0 Next.js SDK Documentation](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Auth0 Dashboard](https://manage.auth0.com)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)

