# Content inventory

This is the content map for the new site. Public wording is stored in PostgreSQL and edited in the admin dashboard. The notes here say what was published, what was withheld, and which admin record holds it.

Tone rule used everywhere: keep a published activity, drop an unsupported superlative, and never turn a logo into a case study.

## Global

| Item | Source | Where it lives |
| --- | --- | --- |
| ASCOM International, Lahore | Footer and logo | `company_profiles` |
| info@ascomintl.com | Header and footer | Primary email |
| hr@ascomintl.com | Careers page | Careers email |
| +92 423 518 9595 and +92 323 899 4888 | Footer | Primary phones |
| +92-42-35189034 | Contact page only | Secondary phone, shown on the contact page |
| info@ascomint.com | Contact page only | Not shown. Recorded as a likely typo |
| Head office and factory | Footer | Contact, footer, about |
| Monday–Saturday 09:00–17:00, Sunday closed | Footer | Footer and contact |
| Facebook profile | Footer | Footer. Empty Instagram link is omitted |
| Signage media since 2018 | Homepage | About, creative, company profile |
| Six values | About page | `company_values` |
| Logo | 2025 logo PNG | `/media/brand/ascom-logo.png` |

## Home

| Section | Content used | Not used |
| --- | --- | --- |
| Hero | Headline and supporting line from the project brief. Background is ASCOM’s own fire-crash-truck photograph, captioned as published project photography | Empty “0+” counters. Stock hero art |
| Introduction | Lahore headquarters, multi-sector work, signage since 2018, factory at Sundar | “Multinational conglomerate”, “multiple geographies”, “connected countries” |
| Divisions | Four homepage divisions, with their published one-line summaries | Fashion shop blocks from `/home/` |
| Capabilities | Manufacturing, vehicles, metal fabrication, road safety, construction categories, signage. Each links to a real page | Invented capability metrics |
| Projects | All nine published projects | Invented dates and values |
| Industries | Seven industries tied to a published activity or a named project | An industry that exists only as a logo |
| Manufacturing band | Process list and Sundar address | 70,000 sq ft and 100+ people, until confirmed |
| Why ASCOM | In-house processes, vehicle projects, signage history, Sundar factory, OEM/ODM wording | “Leading”, “world-class”, “unparalleled” |
| Organisations | Logos whose names were read from the files, with a line that a logo is not a contract | ISO mark, certificate scans, Nestlé, University of Peshawar |
| Values | All six | — |
| Closing CTA | “Have a Project in Mind?” and the contact form | — |

Homepage sentences that the company should be able to edit without a developer sit in `site_settings` (hero, introduction, closing CTA).

## About

- Overview and the 2018 signage history.
- Head office, factory, and the four current divisions plus engineering, road safety, and vehicle work.
- Values.
- Manufacturing processes, without unverified measurements.
- Organisation wall, same disclaimer as the homepage.
- No leadership grid, no mission/vision labels, and no timeline beyond 2018. Certificate dates stay in the verification file until the company confirms they should be public.

## Businesses

| Page | What a visitor can read | Photography |
| --- | --- | --- |
| `/businesses` | Index of active divisions | Company photographs where a project exists |
| Construction | Six categories, the Sundar prefabricated project, and the published statement about timelines and machinery | Project photo for the prefabricated site. Category tiles that need a photo use an atmospheric image and say so |
| Manufacturing | Process list, responsible-manufacturing statements, Sundar address | Cylinder and foam photographs from published projects, clearly tied to those projects |
| Creative Solutions | The nine published offer groups | Wildlife and RWMC branding photographs |
| Technology Solutions | Equipment and IT categories actually listed on the technology page | Atmospheric equipment photograph, labelled as such. No brand names invented |
| Engineering | The published “what we do” list | Prefabricated-site photograph. The “Welcome to SECO” paragraphs are omitted |
| Road Safety | Road-safety products and road-sign types from Creative Solutions | Atmospheric road photograph, labelled, because the source page has icons rather than product photos |
| Vehicle Customisation | The five vehicle projects and the cycle boats | Those project galleries |

Inactive records, hidden from navigation until an editor activates them and writes a real description:

- Road beautification. Reason: the URL 404s and no description exists.
- Waste management. Reason: no service page. Waste recycling remains a manufacturing practice. RWMC remains a branding project.

## Products

Every row is a dedicated URL. Specifications are empty unless the source stated them.

| Category | Products | Specification that is safe to show |
| --- | --- | --- |
| Firefighting vehicles | Fire crash truck | None published |
| Mobile foam units | Mobile foam unit | None published |
| Firefighting equipment | Firefighting cylinders | None published |
| Water trailers | Water trailer | 1.5 ton, two-wheeler, 400 gallons |
| Vehicle bodies | Wildlife ranger back body; vehicle painting and branding | None beyond the project description |
| Manufactured equipment | Cycle boats | Locations and client as published |
| Road safety products | Cones, barriers, reflective tapes, road studs, speed breakers, convex mirrors, bollards, high-visibility gear | None published. The page says these are listed categories, not a sized range |
| Signage | Regulatory, warning, directional, reflective boards, highway, urban and industrial, custom signage | None published |
| Creative services | Petroleum retail signage, trade-marketing signage, shop and showroom branding | Described only at the level of the source list |
| Technology | Computers and workstations, servers, storage, CCTV and recording, office supplies, IT infrastructure, network security, IT support | Category scope only. “NIAS” is not shown; storage copy says NAS/SAN and the verification file records the source typo |

Technical documents: none were available, so the document area is empty until an editor uploads one.

## Projects

`/projects` lists all nine, with division filters and search. Each detail page has the source statement, the gallery, the related division, related products, and a link to the inquiry form. Fields for date, value, and location exist in the database and are filled only when the source gave them (cycle-boat locations, Sundar prefabricated site, and the clients named in the project sentences).

## Industries

| Page | Why it is included |
| --- | --- |
| Infrastructure | Construction categories and the Sundar prefabricated project |
| Government and public sector | Named project clients (DGP Army, Tourism Development Corporation of Punjab, Wildlife and Parks) and the government marks on the logo wall |
| Industrial manufacturing | Manufacturing page and factory address |
| Emergency and fire safety | Fire truck, foam unit, cylinders |
| Transportation | Road signs, road-safety products, highway category |
| Municipal services | RWMC vehicle branding. WASA is only a logo, so the page does not describe a WASA project |
| Commercial organisations | Signage, branding, and giveaway lists. Commercial logos are shown as logos |

## Resources

| Category | Current content |
| --- | --- |
| Governance | Code of conduct, full text, on its own page |
| Company profile, brochures, catalogues, specifications, safety documents, news, articles, case studies, certifications | No file was published. The page explains that and the admin upload is ready |

Expired scans (PEC licence, professional tax, LCCI membership, FBR screenshot) are not offered as downloads.

## Careers

Introduction based on the published careers text, without the “over 10 years” claim. Values repeated. No vacancy is seeded. The empty state asks candidates to email hr@ascomintl.com or use the application form, which stores the CV in PostgreSQL-linked storage.

## Contact

Head office, factory, phones, email, hours, a search link for the head office, and an area map for Sundar Industrial Estate. The form fields match the brief. Department is the inquiry category. Submissions are validated in the browser and again by the API, then stored.

## Code of conduct

Full published policy, plus the inquiry path for a concern and an optional evidence file.

## Admin-only or withheld

| Item | Reason |
| --- | --- |
| 70,000+ sq ft and 100+ people | Source marks the area as “customize based on actual size”. Both sit in `statistics` with public display off |
| 0+ homepage counters | Placeholders |
| ISO 9001:2015 mark | No certificate in the company’s name |
| PEC, tax, LCCI, and FBR scans | Dates and identifiers need confirmation. Details are in `verification-needed.md` |
| SECO prefab paragraphs | Another company’s name |
| WooCommerce dresses, watches, and shoes | Theme demo data |
| info@ascomint.com | Conflicts with the published primary email |
| Mission, vision, founders, overseas offices | Not published |
