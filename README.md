# ASCOM International

The public website for ASCOM International. Page content lives in `frontend/content/site.json`. There is no database and no sign-in. The contact form opens the visitor's email program.

## Requirements

Node.js 22.

## Run locally

```powershell
cd h:\Projects\Ascom\ascom-international\frontend
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy on Vercel

Import [the GitHub repository](https://github.com/akioitama/ascom-international). Before the first deploy, set **Root Directory** to `frontend`. Leave the framework as Next.js, and leave the install, build, and output commands on their defaults (`npm install`, `npm run build`, `.next`).

No environment variables are required. Vercel fills the sitemap and page addresses from the deployment URL. To use a custom domain such as `https://ascomintl.com` in those addresses, add `NEXT_PUBLIC_SITE_URL` with that exact value and redeploy.

## Content rules

- Statistics appear on the site only when an editor marks them verified and public. The old “70,000+ sq ft” and “100+” figures are stored and hidden, because the source page says the area should be customised to the actual size.
- Road beautification and waste management exist as inactive divisions. They have no published service text.
- Atmospheric photographs (technology and road safety) are labelled in the interface. Project photographs are the company’s own, taken from the existing project galleries.
- A logo is captioned as a mark from the previous site, not as a contract.

## Images

Project photographs and the logo were copied from https://ascomintl.com/. Two atmospheric photographs are from Unsplash and are labelled as such:

- Technology: photo `1558494949-ef010cbdcc31`
- Road: photo `1465447142348-e9952c393450`

Items without a photograph show a drawn placeholder with an icon. To replace one, put the file in `frontend/public/media` and set `hero_image` (products) or `image` (industries) in `frontend/content/site.json`. Photographs still needed, landscape 4:3 and at least 1600 px wide:

- 26 catalogue items: road safety products, signage, creative services and technology
- The Agriculture and Energy and power industries
- ASCOM's own photography for Technology Solutions, Road Safety and Automotive, which use labelled atmospheric images

Refresh the local copies with `python scripts/fetch_media.py` if those files are missing. The script expects the logo downloads already saved under `research-raw/logos` from the research pass, or you can place the logo and organisation marks in `frontend/public/media` yourself.

## Documents

- `docs/company-research.md` — what the current site actually says
- `docs/content-inventory.md` — where each fact lives on the new site
- `docs/design-references.md` — what was learned from the reference companies
- `docs/architecture.md` — how the two applications fit together
- `docs/api-documentation.md` — endpoints
- `docs/verification-needed.md` — questions for the company before more claims are published
