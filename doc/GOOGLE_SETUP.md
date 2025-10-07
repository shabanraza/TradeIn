# Google OAuth Setup for Mobile App

## 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application" for the type
6. Add authorized redirect URIs:
   - For development: `https://auth.expo.io/@your-expo-username/your-app-slug`
   - For production: Your app's redirect URI

## 2. Configure Environment Variables

Create a `.env` file in the mobile directory:

```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
EXPO_PUBLIC_API_URL=http://192.168.31.53:3000
```

## 3. Update app.json

Add the following to your `app.json`:

```json
{
  "expo": {
    "scheme": "your-app-scheme",
    "web": {
      "bundler": "metro"
    }
  }
}
```

## 4. Test Google Authentication

1. Start your web server: `cd web && npm run dev`
2. Start your mobile app: `cd mobile && npm start`
3. Try the "Continue with Google" button

## Notes

- The Google Client ID should be the same as used in your web app
- Make sure your web server is running and accessible from your mobile device
- The redirect URI must match exactly what you configured in Google Console
