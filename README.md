# Portfolio — Shivendra Shukla

Personal portfolio site: hero with an animated terminal, skills, experience
timeline, project showcase, and a contact form wired to EmailJS.

Built with **React 18 + Vite**, plain JavaScript, hand-written CSS with a
design-token system. Smooth scrolling via Lenis, animation via GSAP.

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
src/components/      One file per section
src/hooks/           useSectionScroll — Lenis-aware anchor scrolling
src/index.css        Design tokens, then section styles
```

Content lives in plain arrays at the top of the component that renders it:

| To change | Edit |
| --- | --- |
| Projects | `SKILL_GROUPS`-style array in `src/components/Portfolio.jsx` |
| Skills | `SKILL_GROUPS` in `src/components/Skill.jsx` |
| Experience | `ENTRIES` in `src/components/Timeline.jsx` |
| Hero terminal | `SKILLS_JSON` in `src/components/MainComponent.jsx` |

## Deployment

Static build, output in `dist/`. The app uses `createBrowserRouter`, so the
host **must** rewrite unmatched paths to `index.html` or deep links 404.
Configs for the common hosts are committed:

- `vercel.json` — Vercel
- `netlify.toml` — Netlify
- `public/_redirects` — Netlify / Cloudflare Pages

## Accessibility & motion

Every animation is gated behind `prefers-reduced-motion`, and a global CSS
guard collapses transitions when it's set. Scroll-triggered reveals use
`immediateRender: false` so content is never stranded invisible if a trigger
doesn't fire.

## CI

`.github/workflows/react.js.yml` runs lint, tests and build on Node 18/20/22
for every push and PR to `main`.
