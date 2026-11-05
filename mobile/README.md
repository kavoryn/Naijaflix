# NaijaFlix Mobile

Expo + React Native app using the existing NaijaFlix Supabase project and user accounts.

## Run on Android / iPhone

1. Install Node.js LTS and Expo Go on your phone.
2. From this folder, run `npm install`.
3. Copy `.env.example` to `.env` (the example already contains the project's public URL/key).
4. Run `npx expo start` and scan the QR code in Expo Go.

The app only uses the Supabase publishable key. Never put a secret/service-role key in a mobile app or commit it to Git.

## Build an Android APK

1. Install EAS CLI: `npm install -g eas-cli`.
2. Sign in: `eas login`.
3. From this folder run `eas build --platform android --profile preview`.
4. EAS will provide a build URL when the APK is ready.

For a Play Store release, use `eas build --platform android --profile production`. iOS builds require an Apple Developer account and signing setup.

## Implemented

- First-run six-screen onboarding.
- Home, Clips, Search and My Profile bottom navigation.
- Shared Supabase authentication and persistent sessions.
- Catalogue and title details from the website's shared database.
- Watchlist add/remove and Watchlist screen.
- Three-way title ratings stored in the user's private ratings table.
- Video playback with Premium subscription check and watch-progress resume/sync.

## Still to build / verify

- Vertical licensed clips feed, series/episodes, games and podcasts.
- Offline downloads, Cast to TV and push notifications.
- Multiple household profiles and saved moments.
- Payment checkout handoff and native-device end-to-end testing.
- Final Android/iOS release builds and store submission.

Some playback and access behavior depends on published video URLs, storage/CDN configuration, and the existing Supabase RLS policies.