# CLAUDE.md

> This file is the single source of truth for this project. Read it fully before making any changes.

## Business

- **Client:** Hammerslate Roofing and Building
- **Trading as:** Hammerslate Roofing
- **Website:** https://hammerslateroofing.co.uk/ (this project - landing page replacing existing GHL page)
- **Existing site:** https://hammerslateroofingandbuilding.com/ (stays live, not part of this project)
- **Services:** New roofs / re-roofs, roof repairs, flat roofs (EPDM, fibreglass, felt, asphalt), commercial roofing, conservatory roofs, guttering and fascias, emergency roof repair (24/7), chimney repairs and repointing, leadwork
- **Primary service area:** North London / Enfield
- **Secondary areas:** Walthamstow, surrounding North London (to be confirmed with Daniel)
- **Key differentiator:** Family-run, Daniel personally oversees every job, 30 years experience, 15-year warranty, no hidden fees, same-day quotes

## Owner and team

- **Daniel** - owner, runs every project. Frequently mentioned by name in reviews.
- **Chris** - team member, mentioned alongside Daniel in several reviews.

## Voice and tone

- Write as the business, first person plural ("we", "our team")
- Straight-talking, local tradesman tone. Not a marketing agency voice.
- Confident but not salesy. Honest, grounded, direct.
- Never use em dashes. Use commas, full stops, or restructure the sentence.
- Never use: "we pride ourselves", "second to none", "bespoke", "competitive prices", "passionate about", "look no further"
- Short sentences. Maximum two sentences per paragraph on the landing page.
- Use real numbers: 30 years, 15-year warranty, 97+ reviews, 24/7.
- British English throughout: colour, neighbour, recognise, kerb, authorised.

## Brand and design

### Colours

- **Brand / primary:** Dark navy/charcoal (#1c2130) - used ONLY on header, footer, final CTA band, step number circles
- **Action / CTA:** Warm orange (#f0882d) - used ONLY on CTA buttons and key accent elements
- **Body backgrounds:** White (#ffffff), off-white (#f9f9f7), light grey (#f2f1ef) - alternating sections
- **Text:** Near-black (#1a1a1a) for headings, dark grey (#4a4a4a) for body copy
- **The brand colour is NOT teal/green.** Reference the current site at hammerslateroofingandbuilding.com for visual direction.

### Design principles

- Extreme colour restraint. The brand colour appears on maybe 5% of the page surface.
- White/off-white/grey section rhythm creates separation without borders.
- Real project photography, never stock images. British houses, British weather.
- Trust signals front-loaded: review platform logos with scores visible near the top.
- Every section ends with a CTA (button, phone number, or both).
- Phone number appears at least 5 times across the page.
- Clean, professional, generous whitespace. Looks like a premium trades business, not a template.

### Typography

- Headings: DM Serif Display (serif)
- Body: DM Sans (sans-serif)
- This pairing gives an established, grounded feel without being stuffy.

### Visual references

- **Primary reference:** Hodgson Roofing landing page (get.hodgsonroofing.com/survey-quote/) - best example of restraint, whitespace, trust presentation
- **Secondary reference:** Aventus Roofing (get.aventusroofing.co.uk/oxfordshire/) - good header structure, trust strip, testimonial layout
- **Tertiary reference:** Prestige Roofers (prestigeroofers.co.uk) - FAQ layout, form + trust signal pairing
- Screenshots of all three are in the `/reference/` directory

## SEO conventions

### Local hierarchy

Street > Town > Borough > County

- **Town** is the primary local keyword (matches how people search)
- **Borough** is structural (used in taxonomy/categories, not repeated in copy)
- **County** is covered by brand name/domain, never included at page level

### Meta titles

- Landing page: `Trusted Roofers North London | Hammerslate Roofing`
- Location variants: `[Service] in [Town] | Hammerslate Roofing`

### Image naming

`[descriptive-subject]-[location].webp`

Alt text always includes the subject and location.

### Schema markup

- LocalBusiness on every page
- Service schema for roofing services
- FAQPage schema for the FAQ section
- Include geo coordinates for the business address

## Reviews

- **Google:** 28 reviews, rated 4.7
- **Facebook:** 16 reviews, rated 5.0
- **Checkatrade:** 40+ reviews, rated 10/10
- **Aggregate claim used on page:** "97+ verified reviews" / "Rated 4.9"

## Content collections

Not applicable yet. This project is a single landing page. Content collections will be set up if/when the site expands to a full multi-page site.

## Technical

- **Framework:** Astro (static output, no SSR)
- **Styling:** Vanilla CSS with custom properties (CSS variables) in `src/styles/global.css`
- **Icons:** Heroicons (raw SVGs from GitHub, not a package). Solid set for trust strip, outline set for USP cards.
- **Forms:** Simple 4-field form (name, phone, postcode, service dropdown). Form handler TBC.
- **Image generation:** Nano Banana plugin (Gemini Flash model). All images in `src/assets/images/` as WebP. Use Astro `<Image>` component with large source width and CSS for display sizing.
- **Tracking:** Google Ads tag + conversion tracking needed. Google Analytics / Search Console to be connected.

## Deployment

- **Hosting:** Cloudflare Pages
- **Project name:** `hammerslate-staging`
- **Staging URL:** https://hammerslate-staging.pages.dev
- **Custom domain:** https://get.hammerslateroofing.co.uk
- **Deploy command:** `npx astro build && npx wrangler pages deploy dist --project-name=hammerslate-staging`
- **Page route pattern:** `/[town]/` (e.g. `/enfield/`). Root `/` redirects to `/enfield/`.
- **Future location pages:** Add `src/pages/[town]/index.astro` for each new area.

## Design system goals

This project is intended as a **reusable template for trade/service business landing pages**. The long-term goal is composable section components and a design token system that can be themed per client and deployed rapidly.

### Current status

The design system is partially there. CSS variables handle colours and spacing. Most components accept a `phone` prop. But many components still have hardcoded content (testimonials, services, trust strip items, platform ratings). These need refactoring into prop-driven or data-driven components.

### Design tokens (CSS variables)

Defined in `:root` in `global.css`. These are the theming layer for new clients:

- `--brand`, `--brand-light` (primary colour)
- `--action`, `--action-hover` (CTA colour)
- `--white`, `--off-white`, `--light-grey`, `--mid-grey` (backgrounds)
- `--text`, `--text-secondary`, `--text-light` (copy)
- `--gold` (stars)
- `--radius`, `--radius-lg`, `--max-width`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`

### Responsive breakpoints

Two breakpoints in `global.css`:
- **Tablet:** `max-width: 960px` (header hides review badges, shows logo + checkatrade + phone. Grids reduce columns.)
- **Mobile:** `max-width: 640px` (header: logo left, checkatrade right, phone hidden. Hero hides bullets and CTAs. Services 2x3 grid. Testimonials become auto-sliding carousel. USP bar 2x2 grid. Mobile sticky bar appears.)

## Component catalogue

### Prop-driven (configurable per client)

| Component | File | Props | Notes |
|---|---|---|---|
| Hero | `Hero.astro` | `headline`, `subtitle`, `phone`, `bullets[]` | Hero bg image hardcoded via import |
| Faq | `Faq.astro` | `faqs[]` (question/answer pairs) | Fully data-driven |
| FinalCta | `FinalCta.astro` | `phone` | Headline/subtitle hardcoded |
| Footer | `Footer.astro` | `phone` | Column content hardcoded |
| MobileBar | `MobileBar.astro` | `phone` | |

### Partially configurable (need refactoring)

| Component | File | What's hardcoded | To do |
|---|---|---|---|
| Header | `Header.astro` | Logo imports, badge images, review counts | Extract to props or config |
| ServicesGrid | `ServicesGrid.astro` | Service list with images | Accept services[] prop with image imports |
| About | `About.astro` | All copy, team image, checklist items | Extract to props |
| Testimonials | `Testimonials.astro` | All review data, avatar images, platform logos | Move to content collection or props |

### Fully hardcoded (need refactoring)

| Component | File | Notes |
|---|---|---|
| TrustStrip | `TrustStrip.astro` | Items and icons defined inline |
| PlatformRatings | `PlatformRatings.astro` | Platform data and logos inline |
| Accreditations | `Accreditations.astro` | 6 logos, greyscale with hover. Equal-width grid cells. |
| WhyChooseUs | `WhyChooseUs.astro` | USP items and icons inline |
| Steps | `Steps.astro` | Step content inline |
| UspBar | `UspBar.astro` | 4 items with icons |

### Section order (page: `/enfield/`)

1. Header (sticky, white bg, logo left, badges + phone right)
2. TrustStrip (navy bg, 4 USPs with Heroicon solid icons)
3. Hero (dark bg with background image, headline + form card)
4. Accreditations (light grey bg, 6 logos in a row with dividers, greyscale with hover colour)
5. ServicesGrid (3x2 photo cards with generated images)
6. About (image left, copy right, orange check list)
7. Testimonials (2x2 grid desktop, auto-sliding carousel on mobile with dots)
8. PlatformRatings (Google, Facebook, Checkatrade with logos and stars)
9. WhyChooseUs (2x2 USP cards with Heroicon outline icons)
10. Steps (3-step numbered process)
11. Faq (accordion, 6 questions)
12. FinalCta (brand bg, phone, buttons)
13. UspBar (4 items with icons)
14. Footer (3 columns)
15. MobileBar (sticky bottom, mobile only)

## Phone numbers

- **Primary (use everywhere):** 020 4634 7883
- **Secondary (do not use on landing page):** 07349 868577

## Accreditations

- Fully insured (confirmed)
- TrustMark (PLACEHOLDER - to confirm with Daniel)
- NFRC member (PLACEHOLDER - to confirm with Daniel)

## Image assets

All in `src/assets/images/`. Generated images use Nano Banana (Gemini Flash). Brand logos provided by client.

### Generated (AI, placeholder until real photos available)
- `hero-roofer-inspecting-slate-roof-north-london.webp`
- `new-roof-slate-tiles-british-house.webp`
- `roof-repair-replacing-broken-tiles.webp`
- `flat-roof-epdm-rubber-membrane.webp`
- `guttering-fascias-upvc-british-house.webp`
- `chimney-repair-repointing-leadwork.webp`
- `emergency-roof-repair-storm-damage.webp`
- `roofing-team-north-london-street.webp`
- `customer-avatar-1.webp` through `customer-avatar-4.webp`

### Brand / third-party logos (in `src/assets/logos/`)
- `hammerslate-logo-transparent.png` (trimmed, main logo)
- `hammerslate-logo.webp`
- `google-colorful-logo.png` (trimmed)
- `Facebook.png`
- `checkatrade-approved-roofer.png`
- `Checkatrade-badge.png`
- `review-platform-icons.webp` (Google/Yell/Checkatrade/Facebook circles)
- `NHBC.webp`, `Constructiononline.webp`, `MasterBuilders.webp` (accreditations)
- `CHAS.webp`, `NFRC.webp`, `Confederation-of-roofing-contractors.webp` (accreditations)
- `myjobquote-badge.png`, `trustedtrader-badge.png` (available, not yet used)

## Notes

- This is a Google Ads landing page. Single goal: generate inbound enquiries (calls + form submissions).
- No navigation links that take the user away from the page.
- The existing site at hammerslateroofingandbuilding.com is NOT being replaced.
- Experience claim: "30 years" refers to Daniel's personal experience.
- The current GHL page at hammerslateroofing.co.uk references Bristol in the FAQ - this is a template error, do not carry over.
- Two phone numbers exist across the current sites. Use only 020 4634 7883 on the landing page.
- Multi-step quote form is planned for a future iteration. Keep the simple 4-field form for now.
- AI-generated images are placeholders. Replace with real project photography when available.
- To spin up a new location page, copy `/enfield/` to `/[town]/` and adjust headline, subtitle, and meta title.
