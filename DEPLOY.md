Deployment Guide

Quick steps to deploy this Vite + React app.

1) Prepare environment

- Copy `.env.example` to `.env.local` and fill values (OpenAI + Firebase keys).

2) Build locally (optional test)

```bash
npm run build
# serve the `dist` directory to inspect production output
npx serve dist
```

3) Deploy to Vercel (recommended)

- Create a GitHub repo and push your project.
- Sign in to https://vercel.com and "Import Project" from GitHub.
- In Vercel dashboard -> Project Settings -> Environment Variables, add the keys from `.env.local` (use names starting with `VITE_` exactly).
- Vercel will detect the static build. If needed, set the build command to `npm run build` and output directory to `dist`.

4) Deploy to Netlify (alternative)

- Create a GitHub repo and connect in Netlify.
- Set "Build command" to `npm run build` and "Publish directory" to `dist`.
- Add environment variables in Site Settings -> Build & Deploy -> Environment.

5) Firebase Hosting (alternative, for Firebase-first flows)

- Install Firebase CLI: `npm i -g firebase-tools`
- `firebase login`
- `firebase init hosting` (choose the project and set `dist` as public directory, configure as single-page app)
- `firebase deploy --only hosting`

6) After deploy

- Verify login flow (Firebase Auth) and Firestore reads/writes.
- Make sure `VITE_OPENAI_API_KEY` is set in the deployment environment for the Accountability Coach to function.

Notes & Tips

- Keep `.env.local` out of Git (it's ignored by default). Commit `.env.example` only.
- If you want automated deploys with previews, connect your GitHub repo to Vercel/Netlify.
- If main JS chunk is large, I can implement route-based code-splitting (lazy-loading pages) to reduce initial bundle size.
