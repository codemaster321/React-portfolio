# Portfolio v2 — Shivendra Shukla

Personal portfolio of a Python full-stack developer: a typography-led,
dark editorial design with selected work, an about statement, experience and
a contact form wired to EmailJS.

Built with **React 18 + Vite**, plain JavaScript and hand-written CSS with a
design-token system. Smooth scrolling via Lenis, animation via GSAP.

> **v2** is a full redesign. The original v1 site (animated terminal hero,
> emerald theme, skills logo wall) is preserved at the
> [`v1.0.0`](https://github.com/codemaster321/React-portfolio/tree/v1.0.0) tag.

### Interaction details

- **Intro:** the name rises letter by letter, then the curtain lifts (~1.6s).
- **Hover letters:** headings split into letters that jitter and flash the
  accent colour under the cursor, rippling into their neighbours (`HoverText`).
- **Work list:** a screenshot preview follows the cursor and slides between
  projects; touch screens show the screenshot inline instead.
- **About statement:** pins mid-screen and fills word by word as you scroll;
  the page moves on once it is full.
- **Marquee:** a GSAP loop that eases to a stop on hover, speeds up while
  scrolling and runs backwards when scrolling up.
- **Nav:** inverts over content, hides on scroll down, returns on scroll up.

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
```

### Environment

The contact form needs EmailJS credentials. Create a `.env` in the project root:

```bash
VITE_PUBLIC_KEY=your_emailjs_public_key
VITE_SERVICE_ID=your_emailjs_service_id
VITE_TEMPLATE_ID=your_emailjs_template_id
```

Without these the form renders but reports a configuration error on submit
rather than failing silently. These values are public by design — EmailJS
expects them in the client — so enable **domain allowlisting** in the EmailJS
dashboard to stop others burning your quota.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint (zero warnings tolerated) |
| `npm run test` | Vitest in watch mode |
| `npm run test:run` | Vitest once — what CI runs |

## Project layout

```
public/projects/     Landing-page screenshots (1280w + 640w WebP)
src/components/      One file per section, plus HoverText and Marquee
src/hooks/           useSectionScroll — Lenis-aware anchor scrolling
src/lib/motion.js    Shared motion helpers: reveal, magnetic, intro signal
src/index.css        Design tokens, then section styles
```

Content lives in plain arrays at the top of the component that renders it:

| To change | Edit |
| --- | --- |
| Projects | `PROJECTS` in `src/components/Portfolio.jsx` |
| Headline | `HEADLINE` in `src/components/MainComponent.jsx` |
| About statement & skills | `STATEMENT`, `CAPABILITIES` in `src/components/About.jsx` |
| Experience | `ENTRIES` in `src/components/Timeline.jsx` |
| Marquee | `ITEMS` in `src/components/Marquee.jsx` |

## Deployment

Static build, output in `dist/`. The app uses `createBrowserRouter`, so the
host **must** rewrite unmatched paths to `index.html` or deep links 404.
Configs for the common hosts are committed:

- `vercel.json` — Vercel
- `netlify.toml` — Netlify
- `public/_redirects` — Netlify / Cloudflare Pages

## Accessibility & motion

Under `prefers-reduced-motion`, large movement is dropped: the intro
curtain, the rising headline, scroll reveals and CSS transitions. Gentle,
visitor-driven effects stay on: the hover-letter jitter, the about-text fill
(a colour change driven by the visitor's own scrolling) and the marquee,
which stops on hover. Scroll-triggered reveals use `immediateRender: false`
so content is never stranded invisible if a trigger doesn't fire.

## CI

`.github/workflows/react.js.yml` runs lint, tests and build on Node 18/20/22
for every push and PR to `main`.
