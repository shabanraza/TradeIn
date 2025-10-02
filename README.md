# 📱 OldPhone Marketplace - Multi-Platform App

A modern multi-platform marketplace application that connects customers with approved retailers to buy and sell old phones in their local area or region. Available as both a **React Native mobile app** and **Progressive Web App (PWA)**.

## 🎯 Project Overview

**OldPhone Marketplace** is a peer-to-peer marketplace specifically designed for buying and selling used mobile phones. The app features a three-tier user system with customers, approved retailers, and super administrators, ensuring a secure and trustworthy trading environment.

## ✨ Key Features

### 🔐 Authentication System
- **Email + OTP Authentication** for both customers and retailers
- **Google Sign-In** integration for seamless login
- **Role-based access control** (Customer, Retailer, Super Admin)

### 👥 User Roles

#### 🛒 Customers
- Browse and search for old phones in their area
- Filter by brand, model, price range, and condition
- Contact retailers directly
- View detailed product information with high-quality images
- Rate and review purchases

#### 🏪 Approved Retailers
- List old phones for sale with detailed descriptions
- Upload multiple high-quality product images
- Set competitive pricing
- Manage inventory
- Respond to customer inquiries
- Track sales analytics

#### 👨‍💼 Super Admin
- Approve/reject retailer applications
- Monitor platform activity
- Manage user accounts
- Oversee platform analytics
- Handle disputes and support

### 🎨 Design Features
- **Modern E-commerce UI** inspired by electronic stores
- **Sleek animations** and smooth transitions
- **Shadow effects** for depth and modern feel
- **Responsive design** for all screen sizes
- **Dark/Light theme** support
- **Intuitive navigation** with bottom tabs and drawer

## 🛠 Tech Stack

### Frontend (Multi-Platform)
- **React Native** (Latest Stable Version) with **Expo** for mobile app
- **Next.js 15** with PWA support for web app
- **TypeScript** for type safety across all platforms
- **Shared codebase** for business logic and API services
- **React Navigation** for mobile navigation
- **React Query/TanStack Query** for state management
- **React Hook Form** for form handling

### 🎨 UI Libraries & Styling

#### **Web Stack (Next.js PWA)**
- **shadcn/ui**: Modern, accessible components
- **Tailwind CSS v4**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Radix UI**: Headless components (shadcn/ui foundation)

#### **Mobile Stack (React Native)**
- **NativeWind**: Tailwind CSS for React Native
- **React Native Reanimated**: High-performance animations
- **React Native Gesture Handler**: Touch interactions
- **Expo Vector Icons**: Icon library

#### **Cross-Platform Option**
- **Tamagui**: Universal design system (optional)
- **Shared components** between web and mobile

### Backend (Unified API)
- **Next.js 15** with API Routes (integrated with PWA)
- **Neon PostgreSQL** database (serverless, FREE tier)
- **Drizzle ORM** for database operations
- **NextAuth.js v4** for authentication (Google + Email OTP)
- **Nodemailer** for email OTP (Gmail SMTP - FREE)
- **Vercel** for deployment (FREE tier available)

### Additional Services
- **Cloudinary** for image storage and optimization
- **Gmail SMTP** for email OTP (FREE - 500 emails/day)
- **Google OAuth** for social login
- **Push notifications** for real-time updates
- **Service Workers** for PWA offline functionality

## 🏗 Project Structure

```
oldsellerapp/
├── 📱 mobile/                 # React Native app (Expo)
│   ├── src/
│   │   ├── components/        # Mobile-specific components
│   │   ├── screens/           # Mobile screens
│   │   ├── navigation/         # React Navigation setup
│   │   ├── services/          # Shared API services
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Shared utilities
│   │   └── types/             # Shared TypeScript types
│   ├── assets/                # Images, fonts, etc.
│   └── package.json
├── 🌐 web/                    # Next.js Full-Stack (API + PWA)
│   ├── pages/                 # PWA pages + API routes
│   ├── components/            # Web-specific components
│   ├── lib/                   # Database and utilities
│   ├── public/                # PWA assets (manifest, icons)
│   └── package.json
├── 📦 shared/                 # Shared code package
│   ├── types/                 # TypeScript interfaces
│   ├── services/              # API services
│   ├── utils/                 # Utility functions
│   ├── constants/             # App constants
│   └── package.json
└── README.md
```

### 🔄 Shared Code Architecture

**What's Shared (80% of code):**
- ✅ **API services** and data fetching
- ✅ **Business logic** and utilities
- ✅ **TypeScript types** and interfaces
- ✅ **Authentication** logic
- ✅ **Validation** functions
- ✅ **Constants** and configuration

**What's Platform-Specific (20% of code):**
- ❌ **UI components** (React Native vs Web primitives)
- ❌ **Navigation** (React Navigation vs Next.js routing)
- ❌ **Styling** (StyleSheet vs CSS/Tailwind)
- ❌ **Platform features** (camera, location, etc.)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- React Native development environment
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oldsellerapp
   ```

2. **Install dependencies**
   ```bash
   # Install shared package dependencies
   cd shared
   pnpm install
   
   # Install mobile app dependencies
   cd ../mobile
   pnpm install
   
   # Install Next.js full-stack app dependencies (API + PWA)
   cd ../web
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   # Mobile app (.env)
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   
   # Web app (.env.local)
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   
   # Backend (.env.local)
   DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Email OTP (Gmail SMTP - FREE)
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   ```

4. **Database Setup**
   ```bash
   cd backend
   pnpm drizzle-kit generate
   pnpm drizzle-kit push
   ```

5. **Install UI Dependencies**
   ```bash
   # Web app (shadcn/ui + Tailwind + Framer Motion)
   cd web
   pnpm add tailwindcss @tailwindcss/typography
   pnpm add framer-motion
   pnpm add @radix-ui/react-slot class-variance-authority
   pnpm add lucide-react
   
   # Mobile app (NativeWind + Reanimated)
   cd ../mobile
   pnpm add nativewind
   pnpm add react-native-reanimated
   pnpm add react-native-gesture-handler
   pnpm add @expo/vector-icons
   ```

6. **Install Authentication Dependencies**
   ```bash
   # Backend authentication setup
   cd backend
   pnpm add next-auth nodemailer @types/nodemailer
   ```

7. **Gmail SMTP Setup (FREE)**
   ```bash
   # 1. Enable 2-Factor Authentication on Gmail
   # 2. Go to Google Account → Security → App passwords
   # 3. Generate app password (16 characters)
   # 4. Add to .env.local:
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   ```

8. **Run the applications**
   ```bash
   # Start Next.js full-stack app (API + PWA)
   cd web
   pnpm dev
   
   # Start mobile app (in new terminal)
   cd mobile
   pnpm start
   ```

## 📱 App Screens

### Customer Screens
- **Home** - Featured phones and categories
- **Search** - Advanced search and filters
- **Product Details** - Phone specifications and images
- **Profile** - User profile and settings
- **Favorites** - Saved items
- **Chat** - Communication with retailers

### Retailer Screens
- **Dashboard** - Sales analytics and overview
- **Add Product** - Create new listings
- **My Products** - Manage existing listings
- **Orders** - Customer inquiries and orders
- **Profile** - Retailer profile and settings

### Admin Screens
- **Dashboard** - Platform analytics
- **Retailer Approval** - Review retailer applications
- **User Management** - Manage users
- **Reports** - Platform reports and insights

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React Native best practices
- Implement proper error handling
- Use custom hooks for reusable logic
- Write comprehensive tests

### Git Workflow
- Use feature branches for new features
- Write descriptive commit messages
- Create pull requests for code review
- Use conventional commits format

## 🚀 Deployment

### 🌐 PWA (Web App) - **FREE Deployment**
- **Deploy to Vercel**: `vercel deploy` (FREE tier available)
- **No app store approval** needed
- **Instant updates** without app store review
- **Works on all devices** (iOS, Android, Desktop)
- **Add to home screen** functionality

### 📱 Mobile App (Optional)
- **iOS**: Deploy to App Store using Expo Application Services (EAS)
- **Android**: Deploy to Google Play Store using EAS
- **Cost**: $124/year (Google Play: $25 one-time, iOS: $99/year)

### 🖥️ Backend (Unified API)
- **Deploy to Vercel**: `vercel deploy` (FREE tier available)
- **Use Neon PostgreSQL** for database (serverless, FREE tier)
- **Configure environment variables** in Vercel dashboard
- **Same API serves both mobile and web apps**

### 💰 Cost Comparison

| Platform | Development | Deployment | App Store | Authentication | Total Year 1 |
|----------|-------------|------------|-----------|----------------|--------------|
| **PWA Only** | FREE | FREE | $0 | **FREE** | **$0** |
| **PWA + Mobile** | FREE | FREE | $124 | **FREE** | **$124** |
| **Mobile Only** | FREE | $29/month | $124 | **FREE** | **$472** |

### 🆓 **Authentication Costs (FREE)**
- **NextAuth.js**: Completely FREE (open source)
- **Gmail SMTP**: FREE (500 emails/day, unlimited monthly)
- **Google OAuth**: FREE (unlimited logins)
- **Neon Database**: FREE (3GB storage, 10GB transfer/month)
- **Total Authentication Cost**: **$0**

## 📊 Database Schema

### Core Entities
- **Users** (customers, retailers, admins)
- **Products** (phone listings)
- **Categories** (phone brands, models)
- **Orders** (transactions)
- **Reviews** (ratings and feedback)
- **Messages** (chat system)

## 🔐 Authentication System

### **NextAuth.js v4 Implementation**
- **Google OAuth** for social login
- **Email OTP** for passwordless authentication
- **JWT tokens** for session management
- **Role-based access control** (Customer, Retailer, Admin)

### **Email OTP Setup (FREE)**
```typescript
// Install dependencies
pnpm add next-auth nodemailer @types/nodemailer

// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      },
      from: process.env.GMAIL_USER,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Custom user creation logic
      return true
    }
  }
})
```

### **Gmail SMTP Setup (FREE)**
1. **Enable 2-Factor Authentication** on Gmail
2. **Generate App Password**: Google Account → Security → App passwords
3. **Use 16-character password** in environment variables
4. **FREE limit**: 500 emails/day (unlimited monthly)

### **Environment Variables**
```bash
# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Gmail SMTP (FREE)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

## 🔒 Security Features

- **NextAuth.js** secure authentication
- **JWT-based** session management
- **Role-based authorization** (Customer, Retailer, Admin)
- **Input validation** and sanitization
- **Rate limiting** on API endpoints
- **Secure image upload** with validation
- **HTTPS enforcement**
- **OTP expiration** (10 minutes)
- **Email verification** required

## 📈 Future Enhancements

- **Payment Integration** (Stripe, PayPal)
- **Real-time Chat** with WebSocket
- **Push Notifications** for updates
- **Advanced Analytics** for retailers
- **AI-powered Recommendations**
- **Barcode Scanner** for quick product lookup
- **Warranty Tracking** system
- **Offline Support** for PWA
- **Progressive Web App** features (install prompts, background sync)
- **Cross-platform synchronization** between mobile and web

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

## 📋 **Development Plan**

**For detailed development plan with phases, timelines, and progress tracking, see [plan.md](./plan.md)**

### **Quick Overview:**
- **Phase 1**: Foundation Setup (Week 1-2)
- **Phase 2**: PWA Development (Week 3-4) 
- **Phase 3**: Mobile App Development (Week 5-6)
- **Phase 4**: Advanced Features (Week 7-8)
- **Phase 5**: Testing & Deployment (Week 9-10)
- **Phase 6**: Mobile App Store (Week 11-12)

**Total Timeline**: 12 weeks | **Total Cost**: $0 - $124/year

---

**Built with ❤️ for the mobile phone trading community**