# 🚀 OldPhone Marketplace - Setup Guide

## Current Status

✅ **Completed Tasks:**
- ✅ Monorepo structure with pnpm workspace
- ✅ Next.js 15 full-stack app with TypeScript, Tailwind CSS
- ✅ Expo React Native app with TypeScript  
- ✅ Shared package with TypeScript types and utilities
- ✅ Database schema with Drizzle ORM
- ✅ NextAuth.js configuration with Google OAuth and Email OTP
- ✅ Email service for OTP codes using Gmail SMTP

🔄 **Next Steps:**
1. Set up Neon PostgreSQL database
2. Configure environment variables
3. Test authentication flows
4. Set up basic UI components

## 📋 Quick Start

### 1. Environment Setup

Copy the environment example file and fill in your values:

```bash
# In the web directory
cp .env.example .env.local
```

**Required Environment Variables:**

```bash
# Database (Step 2)
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# NextAuth.js (Step 3)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Step 4)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Gmail SMTP - FREE (Step 5)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

### 2. Database Setup - Neon PostgreSQL (FREE)

1. **Create Neon Account**: Go to [neon.tech](https://neon.tech) and sign up
2. **Create Project**: Create a new project 
3. **Get Connection String**: Copy the connection string from dashboard
4. **Add to .env.local**: Paste the DATABASE_URL

### 3. NextAuth Secret

Generate a secret key:
```bash
openssl rand -base64 32
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:3000`
6. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### 5. Gmail SMTP Setup (FREE - 500 emails/day)

1. **Enable 2-Factor Authentication** on your Gmail account
2. Go to **Google Account → Security → App passwords**
3. Generate a new **app password** (16 characters)
4. Use this password in `GMAIL_APP_PASSWORD` (not your regular password)

### 6. Initialize Database

```bash
cd web
pnpm run db:generate    # Generate migration files
pnpm run db:push        # Push schema to database
```

### 7. Start Development Servers

```bash
# Terminal 1: Start web app (API + PWA)
cd web
pnpm dev

# Terminal 2: Start mobile app (optional)
cd mobile  
pnpm start
```

Your apps will be available at:
- **Web App**: http://localhost:3000
- **Mobile App**: Expo Dev Tools in browser

## 🏗 Project Structure

```
oldsellerapp/
├── 📱 mobile/           # React Native + Expo
│   ├── src/
│   │   ├── components/  # Mobile components
│   │   ├── screens/     # Mobile screens
│   │   └── navigation/  # React Navigation
│   └── package.json
├── 🌐 web/             # Next.js Full-Stack
│   ├── src/
│   │   ├── app/         # App Router pages
│   │   ├── lib/         # Database, auth, utils
│   │   └── components/  # Web components
│   ├── drizzle.config.ts
│   └── package.json
├── 📦 shared/          # Shared code
│   ├── src/
│   │   ├── types/       # TypeScript types
│   │   ├── services/    # API services
│   │   └── utils/       # Utilities
│   └── package.json
└── package.json        # Workspace root
```

## 🔧 Available Scripts

### Web App (Next.js)
```bash
cd web
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm db:generate  # Generate Drizzle migrations
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio (database GUI)
```

### Mobile App (React Native)
```bash
cd mobile
pnpm start        # Start Expo development server
pnpm android      # Run on Android
pnpm ios          # Run on iOS (macOS only)
pnpm web          # Run in browser
```

### Shared Package
```bash
cd shared
pnpm build        # Build TypeScript
pnpm dev          # Watch mode
pnpm type-check   # Type checking
```

## 🎯 Tech Stack

### Frontend
- **Web**: Next.js 15 + React 19 + Tailwind CSS + shadcn/ui
- **Mobile**: React Native + Expo + NativeWind + React Navigation
- **Shared**: TypeScript + Zod validation

### Backend & Database
- **API**: Next.js 15 App Router API routes
- **Database**: Neon PostgreSQL (serverless, FREE tier)
- **ORM**: Drizzle ORM
- **Auth**: NextAuth.js v4

### Services
- **Email**: Gmail SMTP (FREE - 500 emails/day)
- **File Storage**: Cloudinary (FREE tier)
- **Deployment**: Vercel (FREE tier)

## 💰 Cost Breakdown

### Development (FREE)
- ✅ Next.js, React Native, TypeScript: **$0**
- ✅ Neon PostgreSQL: **$0** (3GB storage, 10GB transfer)
- ✅ Gmail SMTP: **$0** (500 emails/day)
- ✅ Vercel hosting: **$0** (hobby tier)
- ✅ Google OAuth: **$0**

### Optional (Production)
- Google Play Store: **$25** (one-time)
- Apple App Store: **$99/year**
- Custom domain: **$10-15/year**

**Total Year 1**: **$0 - $139** (depending on app stores)

## 🚀 Next Development Steps

1. **Basic UI Setup** (Week 1)
   - Set up shadcn/ui components
   - Create basic layouts and pages
   - Implement authentication screens

2. **Core Features** (Week 2-3)  
   - Product listing and search
   - User registration flows
   - Basic CRUD operations

3. **Advanced Features** (Week 4+)
   - Real-time messaging
   - Image uploads
   - Payment integration

## 🔍 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Neon database is running
- Ensure IP is whitelisted (Neon allows all by default)

### Authentication Issues
- Verify Google OAuth credentials
- Check NEXTAUTH_SECRET is set
- Ensure Gmail app password is correct

### Email Issues
- Verify 2FA is enabled on Gmail
- Use app password, not regular password
- Check Gmail SMTP settings

## 📚 Documentation

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Neon Database Docs](https://neon.tech/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [NextAuth.js Docs](https://next-auth.js.org/getting-started/introduction)

---

**Ready to continue development!** 🎉

The foundation is now set up. You can start the development servers and begin building the marketplace features.
