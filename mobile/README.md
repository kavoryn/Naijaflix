# NaijaFlix Mobile

Expo + React Native app that shares the existing NaijaFlix Supabase project and user accounts.

## Setup

1. Install Node.js LTS.
2. From this folder, run `npm install`.
3. Copy `.env.example` to `.env`.
4. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` using the Supabase project URL and publishable key. Never put a Supabase secret/service-role key in this app.
5. Run `npx expo start`, then scan the QR code with Expo Go.

## Current foundation

- Expo Router bottom navigation: Home, Clips, Search, My Profile.
- Supabase Auth session persistence shared with the existing project.
- Home and Search read the safe `movies_catalogue` view.
- Movie cards link to the title route (player/detail work is next).

## Planned next modules

Onboarding, title details and video player, shared watchlist/progress, profiles, ratings, licensed clips feed, downloads, Cast support, notifications, games and podcasts. Offline downloads and Cast require native-device testing and suitable licensed media delivery.