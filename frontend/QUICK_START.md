# 🚀 Quick Start Guide

Get SafeBite running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd Front-end
npm install
```

## Step 2: Set Up Auth0

### Option A: Use Demo Mode (No Auth0 Required)
The app includes a demo user in the database. To test without setting up Auth0:

1. The app will work with placeholder auth
2. Demo user: `demo_user_1` with pre-loaded scan history

### Option B: Full Auth0 Setup

1. **Create Auth0 Account**: https://auth0.com (free tier available)

2. **Create Application**:
   - Go to Auth0 Dashboard → Applications → Create Application
   - Name: "SafeBite"
   - Type: Regular Web Application

3. **Configure URLs**:
   - Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`

4. **Create `.env.local` file**:

```bash
AUTH0_CLIENT_ID=your_client_id_here
AUTH0_CLIENT_SECRET=your_client_secret_here
AUTH0_ISSUER_BASE_URL=https://your-tenant.region.auth0.com
AUTH0_BASE_URL=http://localhost:3000
AUTH0_SECRET=$(openssl rand -hex 32)
```

Replace with your actual Auth0 credentials from the dashboard.

## Step 3: Run the App

```bash
npm run dev
```

Visit: http://localhost:3000

## Step 4: Test the Features

### 1. Login
- Click "Continue with Auth0"
- Complete Auth0 authentication
- Or use demo mode

### 2. Onboarding
- Select allergies (e.g., peanuts, gluten)
- Choose diet goals (e.g., vegan, organic)
- Add ingredients to avoid
- Click "Complete" (or "Skip for now")

### 3. Dashboard
- See your personalized greeting
- View recent scans carousel
- Check safety statistics chart
- Click the floating camera button

### 4. Scan Item
- Allow camera permissions
- Position food label in frame
- Capture photo
- Click "Analyze Now"

### 5. View Results
- See animated safety score dial
- Expand ingredient details
- Check better alternatives carousel
- Click "Back to Dashboard"

### 6. Verify Data Persistence
- Your scan should now appear in Recent Scans
- Stats should update (Safe vs Risky count)
- Check `lib/db/users.json` to see saved data

## 📊 Demo Data

The app includes a demo user with sample scans:
- Email: `jane@example.com`
- 6 pre-loaded scans (mix of safe and risky items)
- Configured allergies and diet goals

## 🔧 Troubleshooting

### Camera not working?
- Grant camera permissions in browser
- Or use the "Upload" button to select an image

### Auth0 error?
- Check `.env.local` has correct credentials
- Verify callback URLs in Auth0 dashboard
- Clear cookies and try again

### Scans not saving?
- Check browser console for API errors
- Verify `lib/db/users.json` exists and is writable
- Ensure you're logged in (check user icon in header)

### Data not loading?
- Open browser DevTools → Network tab
- Check API calls to `/api/user/*`
- Look for 401 errors (authentication issue)

## 📁 Important Files

```
Front-end/
├── .env.local              # Your Auth0 credentials (create this!)
├── lib/db/users.json       # User database (auto-created)
├── AUTH0_SETUP.md          # Detailed Auth0 guide
└── README.md               # Full documentation
```

## 🎯 What's Working

✅ Auth0 authentication
✅ User profile management  
✅ Onboarding with preferences
✅ Dashboard with real user data
✅ Camera/webcam scanning
✅ Scan result analysis
✅ Automatic scan saving to DB
✅ Per-user scan history
✅ Real-time statistics
✅ Logout functionality

## 🔜 Next Steps

1. **AI Integration**: Connect real ingredient analysis API
2. **Database Migration**: Move from JSON to PostgreSQL/MongoDB
3. **Barcode Scanning**: Add barcode reader support
4. **Product Database**: Integrate real product information
5. **Social Features**: Share results with friends
6. **Mobile App**: React Native version

## 💡 Tips

- **Testing**: Create multiple Auth0 users to test multi-user functionality
- **Database**: Edit `lib/db/users.json` to modify demo data
- **Styling**: All colors defined in `tailwind.config.ts`
- **API**: All endpoints in `app/api/` directory

## 📚 Learn More

- [Full README](./README.md) - Complete documentation
- [Auth0 Setup](./AUTH0_SETUP.md) - Detailed authentication guide
- [Auth0 Docs](https://auth0.com/docs) - Official Auth0 documentation
- [Next.js Docs](https://nextjs.org/docs) - Next.js 14 App Router

## 🆘 Need Help?

1. Check browser console for errors
2. Read error messages carefully
3. Verify all environment variables
4. Check file permissions
5. Review API responses in Network tab

---

**Ready to make healthier food choices! 🥗✨**

