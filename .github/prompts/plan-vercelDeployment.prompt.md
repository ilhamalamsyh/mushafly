# Vercel Auto-Deployment Configuration Plan

## Overview

Set up automatic deployment to Vercel on every GitHub push. Replace the local Bun proxy with Vercel serverless functions.

---

## Files to Create/Update

### 1. `vercel.json` (Project Root)

```json
{
  "buildCommand": "bun run build",
  "installCommand": "bun install",
  "framework": "vite",
  "env": {
    "VITE_API_BASE": {
      "value": "/api"
    }
  }
}
```

### 2. `api/index.ts` (Vercel Serverless Function)

- Replaces Bun proxy on production
- Forwards `/api/*` requests to `https://equran.id/api/v2/*`
- Handles CORS headers and preflight requests
- Caches responses with `Cache-Control: public, max-age=3600`

```typescript
import { VercelRequest, VercelResponse } from "@vercel/node";

const TARGET = "https://equran.id/api/v2";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.status(200);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end();
    return;
  }

  // Get path from URL
  const path = new URL(req.url ?? "", "http://localhost").pathname.replace(
    /^\/api/,
    "",
  );
  const queryString = new URL(req.url ?? "", "http://localhost").search;
  const upstreamUrl = `${TARGET}${path}${queryString}`;

  try {
    const response = await fetch(upstreamUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({
      code: 500,
      message: "Proxy error",
    });
  }
}
```

### 3. `.env.development` (Local Development)

```
VITE_API_BASE=http://localhost:8787/api
```

### 4. `.env.production` (Vercel Production)

```
VITE_API_BASE=/api
```

### 5. Update `src/constants.ts`

```typescript
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8787/api";
// For production (Vercel): /api
// For development (local): http://localhost:8787/api
```

---

## Deployment Workflow

### Local Development (unchanged)

1. Run `bun install` to install dependencies
2. In one terminal: `bun run start:proxy` (Bun proxy on `http://localhost:8787`)
3. In another terminal: `bun dev` (Vite dev server on `http://localhost:5173`)
4. Vite proxies `/api/*` to `http://localhost:8787/api/*` (see `vite.config.ts`)
5. App uses `VITE_API_BASE=http://localhost:8787/api` from `.env.development`

### Production (Vercel)

1. Push code to GitHub
2. Vercel automatically:
   - Clones the repo
   - Runs `bun install` (from `vercel.json`)
   - Runs `bun run build` (from `vercel.json`)
   - Deploys built files + serverless functions
3. App uses `VITE_API_BASE=/api` from `vercel.json` env config
4. `/api/*` requests route to `api/index.ts` serverless function
5. Function forwards to `https://equran.id/api/v2/*`

---

## Vercel Setup (One-time)

1. Visit [vercel.com](https://vercel.com) → Sign up/login
2. Click **"Add New → Project"**
3. Click **"Import Git Repository"**
4. Search for and select repo: `musahfly` (or your fork)
5. Vercel auto-detects settings from `vercel.json`
6. Click **"Deploy"**
7. After deployment succeeds, every GitHub push auto-deploys

---

## Architecture Differences

| Aspect          | Development                      | Production (Vercel)                         |
| --------------- | -------------------------------- | ------------------------------------------- |
| Frontend        | Vite dev server (localhost:5173) | Static build (`dist/`)                      |
| API Proxy       | Bun HTTP server (localhost:8787) | Vercel serverless function (`api/index.ts`) |
| `VITE_API_BASE` | `http://localhost:8787/api`      | `/api`                                      |
| CORS            | Bun proxy handles it             | Vercel function handles it                  |

---

## Implementation Checklist

- [ ] Create `vercel.json` in project root
- [ ] Create `api/` directory and add `api/index.ts`
- [ ] Create `.env.development` and `.env.production` files
- [ ] Update `src/constants.ts` to use `import.meta.env.VITE_API_BASE`
- [ ] Install `@vercel/node` types if using TypeScript in serverless functions
- [ ] Push all changes to GitHub
- [ ] Connect GitHub repo to Vercel via dashboard
- [ ] Verify deployment succeeds
- [ ] Test app on Vercel URL (check surah list loads, search works, audio plays)
- [ ] Monitor Vercel logs for errors

---

## Troubleshooting

**Problem**: Build fails on Vercel.

- Check Vercel build logs (in deployment details)
- Ensure `bun.lock` is committed to GitHub
- Verify `tsconfig.json` is valid

**Problem**: API calls return 500 errors.

- Check `api/index.ts` is in the root or `api/` folder
- Verify Vercel environment variables match production needs
- Check equran.id API is reachable from Vercel

**Problem**: CORS errors on frontend.

- Ensure `api/index.ts` sets `Access-Control-Allow-Origin: *`
- Check API URL in constants matches Vercel deployment URL

---

## Next Steps

1. Create all files listed above
2. Commit and push to GitHub
3. Connect Vercel to GitHub (one-time setup)
4. Vercel auto-deploys on every push
5. Local development continues with `bun run start:proxy` + `bun dev`
