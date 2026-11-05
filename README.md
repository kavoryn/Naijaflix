# NaijaFlix
Next.js + TypeScript + Supabase Auth/Postgres + Paystack NGN streaming platform.

## Setup
- Copy `.env.example` to `.env.local` and set Supabase URL and publishable/anon key.
- Run `npm install && npm run dev`.
- Apply `supabase/migrations/202611050001_naijaflix_policies.sql` in Supabase SQL Editor.
- Add `PAYSTACK_SECRET_KEY` as a server-only Vercel environment variable.
- Set Supabase Auth redirect URLs for localhost and your production domain.

Admin: create a user, then promote that profile to admin in Supabase SQL editor as project owner. Never expose service role keys in the browser.
Payments: monthly plan ₦2,500; verification checks Paystack status, amount, currency and signed-in email. Configure and verify Paystack webhooks before production use. Only publish licensed video streams.