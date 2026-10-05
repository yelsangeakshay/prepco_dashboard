# Prep Co app mockups

A static site that presents the mockups for The Prep Co app: journey maps, every screen at full size,
and the open product decisions. There is no build step on the host; the pages are already generated and
committed. The mockups come from a Claude Design canvas.

| Path | What it is |
|---|---|
| `/` | Start page |
| `/journeys/` | 21 journeys as numbered sequences of the real screens |
| `/gallery/` | All 52 screens, grouped by role, with phone layouts and edge cases |
| `/decisions/` | Open decisions, edge cases and what is not designed yet |

## Deploy on Vercel

1. In Vercel choose **Add New → Project** and import `yelsangeakshay/prepco_dashboard`.
2. Framework preset **Other**. Leave the build command, install command and output directory empty.
3. Deploy. Every push to `main` redeploys; other branches get preview URLs.
4. The site is meant to be public. The production URL (`<project>.vercel.app`) is open by default. If it asks
   visitors to sign in to Vercel, go to **Settings → Deployment Protection** and turn protection off for
   production. Branch preview URLs may still require a Vercel login, which is fine for reviewing changes.
   The pages and `vercel.json` send `noindex`, so search engines skip the site while anyone with the link
   can open it. Remove the `robots` meta tag in `tools/build.py` and the `X-Robots-Tag` header in
   `vercel.json` if you want it to appear in search results.
5. Optional custom domain: **Settings → Domains**, add a subdomain such as `mockups.theprep.co.in`, then
   create the DNS record Vercel shows at the domain's DNS provider.

`vercel.json` turns on clean URLs with trailing slashes and sets cache and robots headers.

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Update the mockups

When the design changes, re-export the canvas as PNGs, then:

```bash
pip install -r tools/requirements.txt
python3 tools/process_images.py path/to/png-export-folder   # writes shared/img, shared/thumb, tools/data/screens.json
python3 tools/build.py                                      # regenerates the HTML and assets/
git add -A && git commit -m "Update mockups" && git push
```

Content lives in `tools/data`: `journeys.py` (the journeys and their steps), `decisions.py` (decisions, edge
cases, build order) and `canvas.json` (board order and titles, copied from the Design canvas). Page layouts are
in `tools/templates`. Do not edit the generated `index.html`, `*/index.html` or `assets/` by hand.
