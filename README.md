# House of Barber — website + CMS

- `web/`    Next.js 15 frontend (deployed to Vercel)
- `studio/` Sanity Studio (the CMS)
- `scripts/migrate-images.mjs` local version of the image migration

Sanity project `z4yj6bjg`, dataset `production`.
Production site: https://house-of-barber-hob6.vercel.app

## Local development

Two terminals:

    cd web && npm install && npm run dev       # http://localhost:3000
    cd studio && npm install && npm run dev    # http://localhost:3333

Allow the frontend to read Sanity from the browser (once):

    cd studio && npx sanity cors add http://localhost:3000 --credentials

## Deploying the Studio to sanity.studio

    cd studio
    npx sanity login      # opens a browser
    npx sanity deploy     # pick a hostname, e.g. house-of-barber

Lands at https://<hostname>.sanity.studio and auto-updates from then on.

## Media

The site currently renders images from the original houseofbarbernz.co.nz URLs
via `web/src/sanity/lib/legacyMedia.ts`. This is a **fallback only** — it is
used per-field, and any image uploaded in the Studio immediately takes over.

Once everything is migrated, delete `legacyMedia.ts`, its imports in
`page.tsx` and `WelcomeVideo.tsx`, and the houseofbarbernz.co.nz entry in
`next.config.ts`.

## Migrating the media into Sanity

The images live on houseofbarbernz.co.nz. The migration runs as an API route on
Vercel, because Vercel's servers can reach that host directly.

1. Create a token with **Editor** permissions:
   https://www.sanity.io/manage/project/z4yj6bjg/api#tokens
2. In the Vercel project's Environment Variables, add:
   - `SANITY_WRITE_TOKEN` — the token from step 1
   - `MIGRATE_SECRET`     — any random string you choose
3. Redeploy so the new variables are picked up.
4. Trigger it once:

       curl -X POST https://house-of-barber-hob6.vercel.app/api/migrate-images \
         -H "x-migrate-secret: YOUR_MIGRATE_SECRET"

It returns a JSON log of what was uploaded. Safe to re-run — anything already
migrated is skipped, so a timed-out run can just be repeated.

Once done, delete both environment variables; the route is a one-off.

## Notes

- `web/src/app/globals.css` is the original hand-authored stylesheet, copied
  verbatim. Only the three hardcoded hero-slide backgrounds were removed, since
  those images now come from the CMS.
- The homepage query is deliberately **not** wrapped in try/catch. A broken
  query or bad config fails the build rather than silently shipping a blank
  page — this caught a real GROQ bug that a catch block had been hiding.
- GROQ has no `replace()` function. Phone hrefs keep their spaces in the query
  and are normalised by `cleanHref()` in `web/src/sanity/lib/links.ts`.
- Products link out to the existing shop; there is no cart or checkout here.
- Prices in the CMS match the supplied HTML mockup, which differs from the
  current live site (mockup: Style Cut $45, Skin Fade $55; live site: $50/$60).
  Left as supplied — update in the Studio if the live prices are correct.
