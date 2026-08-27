# Ibrahimig.com SEO and Launch Overhaul Audit

Date: 2026-07-03

## Scope Completed In This Pass

- Added server-rendered/prerendered public HTML for the main public routes.
- Added real bilingual URL paths for Arabic and English.
- Standardized primary SEO identity around `Ibrahim Ghaiyth` and Arabic `إبراهيم غيث`.
- Generated a correct 1200x630 Open Graph image.
- Added complete favicon and web manifest assets.
- Improved accessibility on navigation, contact form labels, icon-only links, and focus states.
- Added a floating WhatsApp CTA.
- Added a testimonials structure without fake testimonials.
- Added canonical host redirect logic for `ibrahimig.com` to `https://www.ibrahimig.com`.
- Added a Permissions-Policy security header.

## Issues Found

### Indexability

- The original app was a client-rendered Vite SPA with an empty `#root`.
- Public pages depended on JavaScript before crawlers could see meaningful content.
- `/ar` and `/en` did not exist as crawlable language routes.
- `/products` and `/blog` were SPA routes only and could fail on production fallback.

### SEO Metadata

- The page title used `in Iraq`, which was too geographically narrow.
- `meta keywords` was present and unnecessary.
- No route-level hreflang implementation existed.
- `sitemap.xml` listed only the home page.
- `opengraph.jpg` was 1280x720 instead of 1200x630.
- JSON-LD only described a Person, not the website and professional service context.

### Language And Content

- Language switching was stored in localStorage only.
- Several Arabic fallback skill labels were corrupted by encoding.
- Several Arabic project descriptions were still written in English.
- Some project SVG covers contained `?` as a broken separator.

### Accessibility

- The viewport prevented user zoom.
- Some icon-only controls had no accessible labels.
- Contact form labels were not connected to their inputs.
- Focus states were not guaranteed globally.

### Performance

- The public bundle is still large and needs deeper optimization in a later pass.
- Blog and Products pages were split into lazy chunks in this pass.

### Technical Hygiene And Security

- Missing full favicon set and web manifest.
- Missing Permissions-Policy header.
- Existing CSP, HSTS, Referrer-Policy, and rate limits were preserved.

## Files Changed

- `artifacts/api-server/src/app.ts`
- `artifacts/api-server/src/data/projectArchive.ts`
- `artifacts/api-server/src/seo/public-pages.ts`
- `artifacts/portfolio/index.html`
- `artifacts/portfolio/public/opengraph.jpg`
- `artifacts/portfolio/public/sitemap.xml`
- `artifacts/portfolio/public/favicon.ico`
- `artifacts/portfolio/public/apple-touch-icon.png`
- `artifacts/portfolio/public/icon-192.png`
- `artifacts/portfolio/public/icon-512.png`
- `artifacts/portfolio/public/site.webmanifest`
- `artifacts/portfolio/public/project-covers/*.svg`
- `artifacts/portfolio/src/App.tsx`
- `artifacts/portfolio/src/components/AboutSection.tsx`
- `artifacts/portfolio/src/components/ContactSection.tsx`
- `artifacts/portfolio/src/components/FloatingWhatsApp.tsx`
- `artifacts/portfolio/src/components/Footer.tsx`
- `artifacts/portfolio/src/components/Navigation.tsx`
- `artifacts/portfolio/src/components/TestimonialsSection.tsx`
- `artifacts/portfolio/src/contexts/LanguageContext.tsx`
- `artifacts/portfolio/src/index.css`

## Verification

- `corepack pnpm --filter @workspace/api-server run typecheck`: passed.
- `corepack pnpm --filter @workspace/portfolio run typecheck`: passed.
- `corepack pnpm --filter @workspace/portfolio run build`: passed.
- `corepack pnpm --filter @workspace/api-server run build`: passed.
- Local server checks:
  - `/`: 200 and contains prerendered Arabic content.
  - `/en/products`: 200 and contains prerendered English product content.
  - `/products`: 301 redirect to `/ar/products`.
  - `/sitemap.xml`: contains Arabic and English public routes.

## Remaining TODO: Ibrahim

- Provide real testimonials. Current testimonial cards are marked `TODO: Ibrahim`.
- Provide a Telegram username or public channel link before adding Telegram as a working contact channel.
- Connect privacy-friendly analytics provider such as Plausible or GA4 and define event names for WhatsApp, email, and Telegram clicks.
- Provide final product payment gateway provider details. For Iraq, Mastercard-only checkout should be connected through a local merchant-supported gateway after account approval.
- Submit `https://www.ibrahimig.com/sitemap.xml` to Google Search Console and Bing Webmaster Tools after deployment.
- Run Lighthouse on the live Railway deployment after DNS propagation and production cache settle.
