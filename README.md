# Submit API – Marketing Website

Bilingual (German default + English) marketing site for **Submit API**, a secure
interface between web forms and email delivery with spam, virus and injection
protection. Built with [Astro](https://astro.build/), Preact islands and SCSS
Modules.

## Tech stack

- **Astro 7** – static site generation (`output: 'static'`).
- **Astro i18n routing** – German at the root (`/`), English under `/en/`
  (`prefixDefaultLocale: false`).
- **Preact** – powers the interactive pricing calculator island
  (`client:visible`).
- **SCSS Modules** – component-scoped styles plus global design tokens. No
  Tailwind.
- **@astrojs/sitemap** – i18n-aware `sitemap-index.xml`.

## Getting started

The repository uses **pnpm** (see `pnpm-lock.yaml`).

```bash
pnpm install        # install dependencies
pnpm dev            # start the dev server
pnpm build          # build the production site to dist/
pnpm preview        # preview the production build locally
```

> npm/yarn work too (`npm install` / `npm run dev` …), but the committed lockfile
> is for pnpm. `sharp` and `esbuild` are listed under `pnpm.onlyBuiltDependencies`
> so their native build scripts run on install.

Node `>= 22.12.0` is required (see `engines` in `package.json`).

### Background dev server

This workspace wraps `astro dev` so it can run detached:

```bash
astro dev --background     # start detached
astro dev status           # check status
astro dev logs             # tail logs
astro dev stop             # stop the server
```

## Project structure

```
astro.config.mjs           # site URL, i18n, integrations, SCSS loadPaths
src/
  i18n/
    de.json / en.json      # translation trees (parallel structure)
    utils.ts               # useTranslations, localizePath, locale helpers
  data/
    constants.ts           # SITE_URL, LOGIN_URL, contact, example endpoints
    plans.ts               # pricing tiers + price helpers
    snippets.ts            # code-example strings
    jsonld.ts              # JSON-LD builders (Org, SoftwareApplication, FAQ, Product)
  styles/
    _variables.scss        # SCSS-only vars (breakpoints, containers, z-index)
    _mixins.scss           # mq(), container(), card(), focus-ring, …
    globals.scss           # CSS custom-property design tokens + reset
  layouts/
    BaseLayout.astro       # <head>, SEO, hreflang, JSON-LD, header/footer
  components/              # reusable sections + UI
    pricing/
      PricingCalculator.tsx          # Preact island
      PricingCalculator.module.scss
    pages/                 # per-page content components (lang prop)
  pages/                   # German routes (root)
    en/                    # English routes (thin wrappers)
public/                    # favicon, logo, og-image, robots.txt
```

Each route is a thin wrapper that delegates to a shared `*Content.astro`
component receiving a `lang` prop, so German and English pages never duplicate
markup.

### Design tokens & SCSS sharing

`astro.config.mjs` injects the shared partials into every stylesheet via Vite:

```js
scss: {
  loadPaths: [/* src/styles */],
  additionalData: `@use "variables" as *;\n@use "mixins" as *;\n`,
}
```

This means component styles can use `mq()`, `$container-max`, etc. without an
explicit `@use`. Colors, spacing and typography are exposed as CSS custom
properties in `globals.scss` (including a `[data-theme='dark']` override).

## Routes

| German         | English           |
| -------------- | ----------------- |
| `/`            | `/en/`            |
| `/pricing`     | `/en/pricing`     |
| `/docs`        | `/en/docs`        |
| `/faq`         | `/en/faq`         |
| `/impressum`   | `/en/impressum`   |
| `/datenschutz` | `/en/datenschutz` |
| `/404`         | (shared)          |

All primary CTAs link to `https://www.submit-api.com/login`.

## Pricing calculator

The calculator (`src/components/pricing/PricingCalculator.tsx`) lets visitors:

- pick a monthly request volume (slider + tier ticks),
- toggle the optional **AI add-on** (applies a configurable surcharge),
- switch between **monthly** and **yearly** billing.

Pricing data and the calculation rules live in `src/data/plans.ts`:

- `plans[]` – five tiers (Starter, Growth, Business _(popular)_, Scale,
  Enterprise _(custom)_).
- `AI_FACTOR = 1.4` – the AI add-on multiplies the base price by **+40 %**.
- `YEARLY_MONTHS = 10` – yearly billing charges **10 months** (≈ 2 months free).

## Assumptions

The following details were **invented for the demo** and should be reviewed /
replaced before going live:

- **API specifics** – endpoint paths (e.g. `https://www.submit-api.com/f/abc123`),
  request/response shapes and HTTP status codes in the docs page are illustrative
  examples, not a real API contract.
- **Pricing** – tier names, request limits, prices, the AI surcharge (+40 %) and
  the yearly discount (2 months free) are placeholders.
- **Social proof** – customer logos in the trust bar and the testimonials are
  placeholders.
- **Legal pages** – Impressum and Datenschutz contain draft boilerplate marked
  with a notice; they must be completed with real company data and legal review.
- **Images** – `public/og-image.png`, `public/apple-touch-icon.png`,
  `public/logo.svg` and `public/favicon.svg` are generated placeholders.
- **Analytics** – a Plausible script placeholder is present in `BaseLayout.astro`
  but commented out.
  </content>
