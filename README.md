# ASCOM International

A separate Next.js site and FastAPI service for ASCOM International. Company copy is stored in PostgreSQL and edited in the admin dashboard. The public text comes from the current website at https://ascomintl.com/, checked on 9 November 2026. Claims that could not be verified are listed in `docs/verification-needed.md` and are not shown as facts.

## What you get

- Public site: home, about, businesses, products, projects, industries, resources, careers, contact, and the code of conduct.
- API under `/api/v1`, with OpenAPI at `http://localhost:8000/docs`.
- Admin at `/admin` for company details, homepage copy, divisions, products, projects, organisations, resources, vacancies, applications, inquiries, statistics, and uploads.
- Inquiries and CVs are stored in the database. Uploaded files stay in the backend `uploads` folder.

## Requirements

Node.js 22.

## Run locally

The site does not use a database or a sign-in. Page content lives in `frontend/content/site.json`.

```powershell
cd h:\Projects\Ascom\ascom-international\frontend
npm install
npm run dev
```

Open http://localhost:3000.

The contact form opens the visitor's email program. It does not save the message.

## Content rules

- Statistics appear on the site only when an editor marks them verified and public. The old “70,000+ sq ft” and “100+” figures are stored and hidden, because the source page says the area should be customised to the actual size.
- Road beautification and waste management exist as inactive divisions. They have no published service text.
- Atmospheric photographs (technology and road safety) are labelled in the interface. Project photographs are the company’s own, taken from the existing project galleries.
- A logo is captioned as a mark from the previous site, not as a contract.

## Images

Project photographs and the logo were copied from https://ascomintl.com/. Two atmospheric photographs are from Unsplash and are labelled as such:

- Technology: photo `1558494949-ef010cbdcc31`
- Road: photo `1465447142348-e9952c393450`

Refresh the local copies with `python scripts/fetch_media.py` if those files are missing. The script expects the logo downloads already saved under `research-raw/logos` from the research pass, or you can place the logo and organisation marks in `frontend/public/media` yourself.

## Documents

- `docs/company-research.md` — what the current site actually says
- `docs/content-inventory.md` — where each fact lives on the new site
- `docs/design-references.md` — what was learned from the reference companies
- `docs/architecture.md` — how the two applications fit together
- `docs/api-documentation.md` — endpoints
- `docs/verification-needed.md` — questions for the company before more claims are published
