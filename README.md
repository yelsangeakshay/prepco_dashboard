# Prep Co app mockups

A small React site that presents the mockups for The Prep Co app: journey maps, every screen at full size, and
the open product decisions. The mockups come from a Claude Design canvas.

Built with Vite, React 19 and TypeScript, the same stack as the landing page. Styles are plain CSS.

| Route | What it is |
|---|---|
| `/` | Start page |
| `/journeys` | 21 journeys as numbered sequences of the real screens |
| `/gallery` | All 52 screens, grouped by role, with phone layouts and edge cases |
| `/decisions` | Open decisions, edge cases and what is not designed yet |

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

## Deploy on Vercel

1. In Vercel choose **Add New → Project** and import `yelsangeakshay/prepco_dashboard`.
2. Vercel detects Vite on its own. Leave the defaults: build command `npm run build`, output directory `dist`.
3. Deploy. Every push to `main` redeploys; other branches get preview URLs.

`vercel.json` rewrites every route to the app, caches images and hashed assets, and sends `noindex`.

The site is meant to be public. The production URL (`<project>.vercel.app`) is open by default. If it asks visitors to
sign in to Vercel, go to **Settings → Deployment Protection** and turn protection off for production. Branch preview
URLs may still require a Vercel login. The site tells search engines not to list it; to allow listing, remove the
`robots` meta tag in `index.html` and the `X-Robots-Tag` header in `vercel.json`.

For a custom domain such as `mockups.theprep.co.in`, add it under **Settings → Domains** and create the DNS record
Vercel shows.

## Where things live

| Path | What |
|---|---|
| `src/data/journeys.ts` | The journeys and their steps |
| `src/data/decisions.ts` | Decisions, edge cases and build order |
| `src/data/screens.json` | The 52 screens (generated, see below) |
| `src/pages/` | The four pages |
| `src/components/` | Site navigation and the full-size viewer |
| `src/styles/` | Plain CSS. Each page's rules are scoped under `.pg-<page>` |
| `public/shared/` | Full-size PNGs (`img/`) and thumbnails (`thumb/`) |

## Update the mockups

Export the canvas as PNGs, then regenerate the images and the screen list:

```bash
npm run images -- path/to/png-export-folder
```

This rewrites `public/shared` and `src/data/screens.json` from the board order and titles in `scripts/canvas.json`.
Replace `scripts/canvas.json` with the canvas's new `project/canvas.json` first if boards were added or renamed.
To change journeys, steps, decisions or copy, edit the files in `src/data`.
