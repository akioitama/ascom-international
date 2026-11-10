# API documentation

Base path: `/api/v1`. Interactive schema: `/docs` on the API host.

Successful responses:

```json
{ "data": {}, "meta": { "page": 1, "page_size": 12, "total": 1 } }
```

`meta` is present on lists. Errors:

```json
{ "error": { "code": "not_found", "message": "Project not found", "details": [] } }
```

Validation errors use HTTP 422 and `details` entries of `loc` and `msg`.

## Public

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/health` | Liveness |
| GET | `/api/v1/home` | Homepage aggregate |
| GET | `/api/v1/company` | Profile, values, public statistics |
| GET | `/api/v1/divisions` | Active divisions |
| GET | `/api/v1/divisions/{slug}` | Division, offerings, related projects |
| GET | `/api/v1/products` | Search and filter. Query: `q`, `category`, `division`, `page`, `page_size`, `sort` (`name`, `newest`, `featured`) |
| GET | `/api/v1/products/{slug}` | Product, specs, documents, related products and projects |
| GET | `/api/v1/product-categories` | Active categories |
| GET | `/api/v1/projects` | Query: `q`, `division`, `page`, `page_size` |
| GET | `/api/v1/projects/{slug}` | Project and gallery |
| GET | `/api/v1/industries` | Active industries |
| GET | `/api/v1/industries/{slug}` | Industry detail |
| GET | `/api/v1/resources` | Query: `category` |
| GET | `/api/v1/resources/{slug}` | Resource detail |
| GET | `/api/v1/careers` | Active vacancies. Empty array if none |
| GET | `/api/v1/careers/{slug}` | Vacancy detail |
| POST | `/api/v1/contact` | Multipart inquiry |
| POST | `/api/v1/careers/apply` | Multipart application. `job_id` optional |

### Contact fields

`full_name`, `company`, `email`, `phone`, `country`, `category`, `subject`, `message`, optional `attachment`, and `fax_number`.

`fax_number` is a honeypot. A non-empty value is rejected. Categories include the business divisions, products, careers, code of conduct, and general.

Attachments are limited to images, PDF, DOC, and DOCX, and to the configured size (default 8 MB).

## Authentication

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/v1/auth/login` | JSON `email` and `password`. Returns a bearer token |
| GET | `/api/v1/auth/me` | Current user |
| POST | `/api/v1/auth/password` | JSON `current_password` and `new_password` |

Send `Authorization: Bearer <token>` to admin routes. Through the website, the Next.js proxy stores the token in an httpOnly cookie and adds the header itself.

## Admin

All of these require an active authenticated user.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/admin/dashboard` | Counts and recent inquiries |
| GET, PATCH | `/api/v1/admin/company` | Company profile |
| PUT | `/api/v1/admin/values` | Replace the value list |
| GET, PUT | `/api/v1/admin/settings` | Homepage and site copy |
| GET, POST | `/api/v1/admin/divisions` | List, including inactive, and create |
| GET, PATCH, DELETE | `/api/v1/admin/divisions/{id}` | Update or delete. Offerings can be replaced in the PATCH body |
| GET, POST | `/api/v1/admin/products` | List and create |
| GET, PATCH, DELETE | `/api/v1/admin/products/{id}` | Update, including specs and documents |
| GET, POST | `/api/v1/admin/categories` | Product categories |
| PATCH, DELETE | `/api/v1/admin/categories/{id}` | Update or delete a category |
| GET, POST | `/api/v1/admin/projects` | List and create |
| GET, PATCH, DELETE | `/api/v1/admin/projects/{id}` | Update, including gallery rows |
| GET, POST | `/api/v1/admin/industries` | List and create |
| PATCH, DELETE | `/api/v1/admin/industries/{id}` | Update or delete |
| GET, POST | `/api/v1/admin/resources` | List and create |
| PATCH, DELETE | `/api/v1/admin/resources/{id}` | Update or delete |
| GET, POST | `/api/v1/admin/organizations` | Logos and names |
| PATCH, DELETE | `/api/v1/admin/organizations/{id}` | Update or delete |
| GET, POST | `/api/v1/admin/jobs` | Vacancies |
| PATCH, DELETE | `/api/v1/admin/jobs/{id}` | Update or delete |
| GET | `/api/v1/admin/applications` | Applications |
| GET | `/api/v1/admin/applications/{id}/cv` | Download a CV |
| GET | `/api/v1/admin/inquiries` | Inquiries |
| PATCH | `/api/v1/admin/inquiries/{id}` | Status: `new`, `reviewed`, `closed` |
| GET | `/api/v1/admin/inquiries/{id}/attachment` | Download an attachment |
| GET, POST | `/api/v1/admin/statistics` | Figures, including unpublished ones |
| PATCH, DELETE | `/api/v1/admin/statistics/{id}` | A figure appears on the site only when verified and public |
| POST | `/api/v1/admin/media` | Multipart upload. Returns the public `/uploads/...` path |
| GET | `/api/v1/admin/media` | Uploaded media records |

Deletes are permanent. They are not exposed to anonymous users.

## Seed

On startup the API inserts the researched content if the company row is missing. Running it again does not duplicate that row. Set `SEED_ON_STARTUP=false` to disable this after go-live if editors have replaced the seed and you do not want a fresh database to be refilled automatically. A genuinely empty database is still filled when the flag is true.
