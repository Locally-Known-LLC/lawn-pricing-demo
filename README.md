# Lawn Pricing — Dashboard Prototype

Demo-only prototype of the Lawn Pricing contractor dashboard. Built with Bolt, deployed on Vercel.

**Live:** https://project-six-black-99.vercel.app

## Stack

- Vite + React + TypeScript + Tailwind CSS
- Supabase (optional — app renders in demo mode without it)
- Lucide React (icons)

## Local Development

```bash
npm install
npm run dev
```

Runs on http://localhost:5173.

To connect Supabase data, create a `.env` file:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

## Vercel Deployment

### Already deployed at:
https://project-six-black-99.vercel.app

### Environment Variables (set in Vercel dashboard):
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase public anon key

The `VITE_` prefix means these are bundled into frontend JS. This is expected — the Supabase anon key is a public key. Security is enforced via Supabase Row Level Security (RLS), not by hiding the key.

### Connect GitHub for auto-deploy:
1. Go to [Vercel project settings → Git](https://vercel.com/locallyknownseo-9398s-projects/project/settings/git)
2. Click "Connect Git Repository"
3. Select `Locally-Known-LLC/lawn-pricing-demo`
4. Grant Vercel access to the Locally-Known-LLC org if prompted
5. Future pushes to `main` auto-deploy

### Custom domain (optional):
In Vercel → Project Settings → Domains, add `demo.lawnpricing.com` or any subdomain you control.

## What This Is

This is a **UI prototype only** — not production code. It uses Supabase (which will be removed in the real dashboard) and contains deposit/booking features that are V1.2 scope.

The production dashboard will be built fresh in `packages/dashboard/` of the [main repo](https://github.com/Locally-Known-LLC/lawn-pricing), using this prototype as a visual/UX reference.

## Version History

This repo contains the full iteration history from Bolt (25 snapshots, Feb 14-20 2026). Each commit represents one Bolt export with its original timestamp preserved.

## Repo

- **This repo:** `Locally-Known-LLC/lawn-pricing-demo` (prototype demo)
- **Production repo:** `Locally-Known-LLC/lawn-pricing` (actual codebase)
