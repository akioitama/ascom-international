# Architecture

The public site is a Next.js application. It does not use a database, an API, or a sign-in.

Pages read `frontend/content/site.json`. Photographs and the logo live in `frontend/public/media`.

The contact form checks the fields in the browser, then opens the visitor's email program addressed to info@ascomintl.com. The message is not saved. Careers asks people to email hr@ascomintl.com.

Inactive divisions, road beautification and waste management, are kept in the content file and left off the public navigation until the company writes a description.
