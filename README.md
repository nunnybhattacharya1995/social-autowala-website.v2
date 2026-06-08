# Social Autowala — Website (v2)

Single-page marketing website for **Social Autowala** — Kolkata's strategy-first digital marketing and influencer agency. _Meter Down. Marketing On._

**🔗 Live site:** https://nunnybhattacharya1995.github.io/social-autowala-website.v2/

Built with **Vite 8 + React 19**, GSAP (ScrollTrigger) + Lenis smooth scroll, a Three.js particle hero, CSS Modules, and a dark/light theme. Includes a full `prefers-reduced-motion` fallback.

## Develop locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build → localhost:4173
npm run lint
```

> Animations (scroll scrub, particles, float) only run with motion enabled — view in a normal browser, not a reduced-motion environment.

## Deployment

Pushing to `main` auto-builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.

See `CLAUDE.md` for architecture and the critical animation/layout constraints.
