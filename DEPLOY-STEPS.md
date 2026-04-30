# Cloud Save Deploy Pack

## What this pack contains

- Updated `package.json` with `@supabase/supabase-js`
- `src/lib/supabaseClient.js`
- `src/lib/cloudSave.js`

Your game code in Canvas has already been updated to use Supabase login/cloud-save logic. This pack is for making sure the GitHub/Vercel project has the required dependency and helper files.

## Vercel Environment Variables

Already added:

```text
VITE_SUPABASE_URL=https://nateazymeuevplbmmgae.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_6KKb25AzC0fkCzUmRDPXEg_3alfLuHO
```

## GitHub upload

1. Open your GitHub repo: `Dek-Swag-Runner`
2. Upload the contents of this ZIP into the repo root.
3. If GitHub asks, allow replacing `package.json`.
4. Commit changes.
5. Go back to Vercel → Deployments → Redeploy.

## Important

If you want the exact newest full game component too, copy the latest Canvas code into:

```text
src/SwagRunnerNightCityGame.jsx
```

Then commit and redeploy.
