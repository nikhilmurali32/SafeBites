# SafeBite - AI Food Analyzer

A visually stunning, modern web application that helps users make healthier food choices by scanning food labels, checking for unsafe ingredients, and recommending safer alternatives using AI.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript
- **Fonts**: Inter & Manrope (Google Fonts)

## 🎨 Design Philosophy

SafeBite follows a clean, intelligent, and health-focused design approach inspired by:
- Apple Health's minimalist aesthetic
- Notion's clear information hierarchy
- Duolingo's engaging user experience

### Design Features
- 🎨 Mint-green gradient backgrounds
- 💫 Subtle, purposeful animations
- 📱 Fully responsive design
- ♿ Accessible UI components
- 🎯 Modern typography with Inter and Manrope

## 📦 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up Auth0** (see `AUTH0_SETUP.md` for detailed instructions):
   - Create Auth0 application
   - Copy credentials to `.env.local` file
   - Configure callback URLs

3. **Run the development server:**
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
Front-end/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main entry point (state management)
│   └── globals.css         # Global styles
├── app/
│   ├── api/
│   │   ├── auth/[auth0]/route.ts    # Auth0 handler
│   │   └── user/
│   │       ├── route.ts             # Get/create user
│   │       ├── scans/route.ts       # User scans CRUD
│   │       ├── preferences/route.ts # Update preferences
│   │       └── stats/route.ts       # User statistics
├── components/
│   ├── LoginScreen.tsx     # Auth0 login page
│   ├── OnboardingFlow.tsx  # Multi-step onboarding
│   ├── Dashboard.tsx       # Main dashboard view
│   ├── CameraScanner.tsx   # Webcam/upload interface
│   ├── ScanResult.tsx      # Analysis results page
│   ├── onboarding/
│   │   ├── AllergyStep.tsx      # Step 1: Allergy selection
│   │   ├── DietGoalsStep.tsx    # Step 2: Diet goals
│   │   └── IngredientsStep.tsx  # Step 3: Ingredient preferences
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx  # Header with user greeting
│   │   ├── RecentScans.tsx      # Horizontal carousel of scans
│   │   ├── ScanButton.tsx       # Floating action button
│   │   └── SafetyChart.tsx      # Stats visualization
│   └── scan-result/
│       ├── SafetyScoreDial.tsx      # Animated circular score dial
│       ├── IngredientList.tsx       # Color-coded ingredient badges
│       └── BetterAlternatives.tsx   # Healthier product carousel
├── lib/
│   ├── db/
│   │   └── users.json           # User database (JSON)
│   └── userDatabase.ts          # Database utility functions
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## ✨ Features

### Page 1: Login & Onboarding

#### Login Screen
- Auth0 integration (placeholder button)
- Animated logo and branding
- Feature highlights with icons
- Smooth fade-in animations
- Privacy policy links

#### Onboarding Flow (3 Steps)

**Step 1: Allergy Selection** 🥜
- Visual emoji-based buttons
- Multiple selection support
- Common allergens: peanuts, tree nuts, milk, eggs, soy, wheat, fish, shellfish, sesame, mustard

**Step 2: Diet Goals** 🌱
- Personalized diet preferences
- Options include: vegan, vegetarian, keto, paleo, low-carb, high-protein, gluten-free, low-sodium, sugar-free, organic
- Scrollable grid layout
- Selection counter

**Step 3: Ingredients to Avoid** 🚫
- Common harmful ingredients
- Custom ingredient input
- Tag-based UI for custom items
- Real-time summary

#### UX Features
- ✅ Animated progress indicator with step circles
- 🔄 Smooth transitions between steps
- ⬅️ Back navigation support
- ⏭️ Skip option available
- 📊 Visual feedback for selections
- 🎯 Completion tracking

### Page 2: Home / Dashboard

#### Dashboard Header
- Personalized welcome message "Welcome back, Jane 👋"
- Quick access buttons (Notifications, Settings, Profile)
- Clean, spacious layout with gradient background

#### Recent Scans Carousel
- **Horizontal scrollable cards** with custom scrollbar
- Each card displays:
  - Product emoji/image (placeholder)
  - Safety badge (✅ Safe or ⚠️ Risky)
  - Product name
  - Safety score with animated progress bar
  - Timestamp (relative time)
- **Hover animations**: Cards lift and scale
- **Entrance animations**: Staggered fade-in
- **Smooth scrolling** with touch/mouse support

#### Floating Scan Button
- **Large circular button** (bottom-right corner)
- Camera icon with pulsing ring effect
- Sparkle animation icon
- Tooltip on hover
- Spring animation on entrance
- Quick access to scanning feature

#### Safety Overview Chart
- **Circular progress chart** showing Safe vs Risky items
- Animated SVG arcs with gradients
- Real-time percentage calculations
- Color-coded stats:
  - 🛡️ Green for safe items
  - ⚠️ Amber for risky items
- **Daily tip card** with personalized message
- Grid-based layout for clarity

#### Navigation Flow
- Login → Onboarding (3 steps) → Dashboard
- Skip option available during onboarding
- Smooth state transitions between pages

### Page 3: Camera Scanner & Scan Results

#### Camera Scanner Interface
- **Real-time webcam access** via MediaStream API
- Full-screen camera overlay with modern UI
- **Visual scanning frame** with corner markers
- **Animated scanning line** for visual feedback
- **Capture & Preview**: Review photo before analysis
- **Upload alternative**: File upload for non-camera devices
- Error handling with fallback options
- Retake functionality

#### Scan Result Page - Split Screen Design

**Left Side:**
- **Product photo** from scan
- Product name and brand
- **Animated safety score dial** (0-100)
  - Circular SVG progress animation
  - Color-coded by score (green/yellow/orange/red)
  - Score label (Excellent/Good/Fair/Poor)
  - Descriptive explanation text

**Right Side:**
- **Ingredient analysis list**
  - Color-coded badges:
    - 🟢 Green = Safe
    - 🟡 Yellow = Moderate
    - 🔴 Red = Risky
  - Summary counts at top
  - **Interactive tooltips**: Click to expand details
  - Staggered fade-in animations
  - Detailed reasoning for each ingredient
  - Scrollable with custom scrollbar

**Bottom Section:**
- **Better Alternatives Carousel**
  - Horizontal scrolling product cards
  - Only shows products with better scores
  - Each card displays:
    - Product image/emoji
    - Safety score with animated bar
    - Price information
    - Score improvement badge
    - "View Details" CTA button
  - Hover animations and effects

#### Dynamic Features
- **Background gradient changes** based on safety score:
  - Green tones: Score 80-100 (excellent)
  - Yellow tones: Score 60-79 (good)
  - Orange tones: Score 40-59 (fair)
  - Red tones: Score 0-39 (poor)
- **Smooth transitions** throughout analysis
- **Back navigation** to dashboard

#### Complete User Journey
Login (Auth0) → Onboarding (save preferences to DB) → Dashboard (fetch user's scans from DB) → 📷 Scan Button → Camera → Capture → Analysis Results (auto-save to DB) → Back to Dashboard (refreshed data)

## 🔐 Authentication & User Management

### Auth0 Integration
- **Secure authentication** using Auth0's industry-standard OAuth2/OpenID Connect
- **Social login ready**: Easy to add Google, Facebook, etc.
- **Session management**: Automatic token refresh and secure cookie handling
- **Profile pictures**: Automatically fetched from Auth0

### User Database (JSON-based)
- **Location**: `lib/db/users.json`
- **Auto-creation**: New users automatically added on first login
- **Persistent data**: All user preferences and scans saved locally

### User Data Structure
```typescript
{
  id: string;              // Auth0 user ID
  email: string;           // User email
  name: string;            // Display name
  picture?: string;        // Profile photo URL
  allergies?: string[];    // Selected allergies
  dietGoals?: string[];    // Diet preferences
  avoidIngredients?: string[]; // Ingredients to avoid
  scans: Scan[];          // Array of all scans
}
```

### API Endpoints
- **`GET /api/user`** - Get current user profile
- **`POST /api/user/preferences`** - Save onboarding preferences
- **`GET /api/user/scans?limit=10`** - Fetch recent scans
- **`POST /api/user/scans`** - Save new scan result
- **`GET /api/user/stats`** - Get today's statistics

### Features
✅ **Per-user scan history** - Each user sees only their scans
✅ **Persistent preferences** - Allergies and diet goals saved
✅ **Real-time stats** - Safe vs risky items calculated daily
✅ **Automatic save** - Scans auto-saved after analysis
✅ **Dashboard refresh** - Latest data shown after each scan
✅ **Logout functionality** - Secure session termination

## 🎭 Animations

All animations are powered by Framer Motion:

- **Page transitions**: Fade and slide effects
- **Button interactions**: Scale on hover/tap
- **Progress indicator**: Animated width transitions
- **Step cards**: Enter/exit animations
- **Selection feedback**: Scale and color transitions
- **Dashboard cards**: Staggered entrance, hover lift effects
- **Chart animations**: SVG path drawing with delays
- **Floating button**: Pulsing ring, spring entrance
- **Carousel**: Smooth horizontal scrolling
- **Camera interface**: Scanning line animation, frame transitions
- **Score dial**: Circular SVG path drawing (1.5s duration)
- **Ingredient list**: Staggered fade-ins with 0.1s delays
- **Tooltips**: Smooth expand/collapse with height animation
- **Alternative cards**: Sequential entrance with hover lift

## 🎨 Color Palette

```css
Primary (Mint):
- mint-50:  #f0fdf7
- mint-100: #dcfce9
- mint-500: #22c55e (Primary)
- mint-600: #16a34a

Neutrals:
- Gray scale for text and borders
- White backgrounds with subtle shadows
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints handled by Tailwind
- Touch-friendly button sizes
- Optimized for all screen sizes

## 🔜 Next Steps

Completed pages:
- ✅ ~~Login & Onboarding~~ **COMPLETED**
- ✅ ~~Dashboard/Home~~ **COMPLETED**
- ✅ ~~Camera Scanner~~ **COMPLETED**
- ✅ ~~Scan Results & Analysis~~ **COMPLETED**

Future features to implement:
- AI/ML integration for actual ingredient analysis
- Real product database with API
- User profile & settings management
- Saved scans history page
- Search functionality for products
- Social sharing features
- Export reports as PDF
- Push notifications for recalls
- Barcode scanning integration
- Shopping list feature

## 🤝 Contributing

This is a production-quality implementation. When adding new features:
1. Follow the established design patterns
2. Use Framer Motion for animations
3. Maintain TypeScript type safety
4. Keep components modular and reusable
5. Follow accessibility best practices

## 📄 License

Private project - All rights reserved

