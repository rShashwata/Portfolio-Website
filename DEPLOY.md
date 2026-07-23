# Deploying to Cloudflare Pages (via GitHub)

This is a **static** Astro site — no server, no adapter. Cloudflare Pages builds
it straight from the GitHub repo on every push.

## One-time setup

### 1. Push this project to GitHub

This folder is its own git repository (root = the `Portfolio Website` folder).
Create an **empty** repo on GitHub (no README/licence), then:

```bash
git remote add origin https://github.com/<you>/<repo>.git
git branch -M main
git push -u origin main
```

### 2. Connect the repo to Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**, and pick this repository.
2. Set the build configuration:

   | Setting                | Value           |
   | ---------------------- | --------------- |
   | Framework preset       | `Astro`         |
   | Build command          | `npm run build` |
   | Build output directory | `dist`          |

   The Node version is pinned by [`.nvmrc`](.nvmrc) (22), so no env var is needed.
3. **Save and Deploy.** Every push to `main` now triggers a build; pull requests
   get preview deployments automatically.

### 3. Custom domain

The canonical/OG origin is set to `https://www.shashwataroy.com` in
[`astro.config.mjs`](astro.config.mjs). In the Pages project → **Custom domains**,
add `www.shashwataroy.com` (and, if you want, `shashwataroy.com` redirecting to
`www`). If you deploy under a different domain, update `site:` to match.

## Local preview of the production build

```bash
npm run build     # → ./dist
npm run preview   # serve ./dist locally
```

## Notes

- Project slugs (`id` in [`src/data/site.js`](src/data/site.js)) must stay
  lowercase-with-dashes and ASCII — they become URL paths. Same for image
  filenames in `public/`.
- No `wrangler.toml` or GitHub Actions workflow is needed: Cloudflare's Git
  integration handles the build and deploy.
