# SellerApp Mobile

A modern React Native mobile application built with Expo, featuring shared authentication with the web application.

## Features

- 🔐 **Shared Authentication** - Seamless login between web and mobile
- 📱 **Modern UI** - Clean, responsive design with NativeWind
- 🚀 **Latest Tech Stack** - React Native, Expo, TypeScript
- 🔄 **State Management** - React Query for server state
- 🎨 **Design System** - Consistent theming and components
- 📊 **Real-time Updates** - Live data synchronization

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v7
- **State Management**: React Query + Context API
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Authentication**: Secure token storage with Expo SecureStore
- **HTTP Client**: Axios
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your API URL
```

3. Start the development server:
```bash
pnpm start
```

### Available Scripts

- `pnpm start` - Start Expo development server
- `pnpm android` - Run on Android device/emulator
- `pnpm ios` - Run on iOS simulator
- `pnpm web` - Run on web browser

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Theme, etc.)
├── navigation/        # Navigation configuration
├── screens/           # Screen components
│   ├── auth/         # Authentication screens
│   └── main/         # Main app screens
├── services/          # API services and utilities
├── types/            # TypeScript type definitions
└── config/           # App configuration
```

## Authentication

The mobile app shares authentication with the web application:

- **Login**: Email/password or OTP-based authentication
- **Registration**: User registration with email verification
- **Token Management**: Secure token storage and refresh
- **Session Persistence**: Automatic login on app restart

## API Integration

The app connects to the same backend API as the web application:

- **Base URL**: Configurable via environment variables
- **Authentication**: Bearer token authentication
- **Error Handling**: Comprehensive error handling and user feedback
- **Offline Support**: Basic offline functionality with React Query

## Development

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Consistent naming conventions

### Testing

- Unit tests with Jest
- Component tests with React Native Testing Library
- E2E tests with Detox (planned)

## Deployment

### Android

1. Build APK:
```bash
expo build:android
```

2. Or build AAB for Play Store:
```bash
expo build:android --type app-bundle
```

### iOS

1. Build for iOS:
```bash
expo build:ios
```

2. Submit to App Store:
```bash
expo submit:ios
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

