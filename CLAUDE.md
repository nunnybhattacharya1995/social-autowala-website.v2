# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

> **Node path note:** Node.js is installed at `D:\node js\node.exe` (path contains a space). Always invoke via `"D:\node js\npm.cmd"` in PowerShell, or run `npm.cmd` if `npm` isn't on PATH.

```powershell
# Development server (localhost:5173)
& "D:\node js\npm.cmd" run dev

# Production build → dist/
& "D:\node js\npm.cmd" run build

# Serve the production build (localhost:4173)
& "D:\node js\npm.cmd" run preview

# Lint
& "D:\node js\npm.cmd" run lint
```

There are no tests. The project is a single-page marketing website.

`.claude/launch.json` defines a `dev` server config (port 5173) for the Claude Preview tool. **Two hard limits make the preview unable to exercise motion — verify scroll/scrub/pin in a real browser:**
1. It hard-locks `prefers-reduced-motion: reduce`, so every animation takes its reduced-motion (static) branch (no Lenis, no scrub, no pin, no float).
2. Even if you defeat #1 (override `window.matchMedia`), the preview tab **freezes `requestAnimationFrame`**. The Loader's intro is a rAF-driven GSAP timeline, so it never completes → `onComplete`/`isLoaded` never fire → the Hero scroll effect (gated on `isLoaded`) never runs and the loader stays stuck on screen. To inspect motion you must *also* temporarily bypass the loader gate (e.g. `useState(true)` in `App.jsx`) and read geometry via `getBoundingClientRect()` rather than watching it animate. Always revert such test hacks before committing.

## Deployment

Auto-deploys to **GitHub Pages** via `.github/workflows/deploy.yml` (build + `actions/deploy-pages`) on every push to `main`. Because it's a *project* Pages site served from a sub-path, `vite.config.js` sets `base: '/social-autowala-website.v2/'` **for `command === 'build'` only** (dev stays at `/`). **Consequence:** any `public/` asset referenced at runtime from JSX must be prefixed with `import.meta.env.BASE_URL` (e.g. `` src={`${import.meta.env.BASE_URL}auto-3d.png`} ``) — a root-absolute `src="/auto-3d.png"` would 404 under the sub-path. Vite rewrites asset URLs in `index.html` automatically; it does **not** rewrite runtime string literals.

## Architecture Overview

**Vite 8 + React 19, CSS Modules, no router.** The entire site is a single scroll page; all navigation is hash-anchor based. The app is wrapped in `<React.StrictMode>` (`main.jsx`), so in dev every effect mounts→unmounts→remounts — animation setup must be idempotent and clean up after itself.

### Startup sequence (`src/main.jsx`)

GSAP plugins are registered **globally here, once, before any component mounts**:

```js
gsap.registerPlugin(ScrollTrigger, useGSAP);
```

Never call `gsap.registerPlugin` inside a component — it will double-register and break ScrollTrigger.

### Component tree

```
ThemeProvider
  └─ ErrorBoundary
       └─ SiteContent
            ├─ Loader      (fullscreen intro, calls onComplete → sets loaded=true)
            ├─ Cursor      (custom cursor; desktop only via pointer:fine media query)
            ├─ Nav
            └─ main
                 ├─ Hero        (Three.js particles + scroll-driven auto across the wordmark)
                 ├─ Story       (scrubbed slide-in lines)
                 ├─ Why
                 ├─ Services
                 ├─ Grow        (pinned horizontal scroll, ≥881px only)
                 ├─ Work
                 ├─ Testimonials
                 ├─ Founder
                 ├─ Team
                 ├─ Contact
                 └─ Footer
```

`SiteContent` calls `useLenis()` which wires Lenis smooth-scroll to GSAP's ticker, and fires `ScrollTrigger.refresh()` 400 ms after the loader completes (keyed on the `loaded` state).

### Theming

`src/context/ThemeContext.jsx` — `ThemeProvider` wraps the whole app. Theme is toggled via `useTheme().toggle()`. It sets `data-theme="light"` on `<html>` (absent in dark mode; **dark is the default**). Base styling lives in `src/styles/globals.css`; light-mode overrides live under `[data-theme='light']`. Component-level light-mode overrides use `:global([data-theme='light']) .className` inside their CSS Module file. CSS custom properties (`--green`, `--white`, `--bg`, etc.) are redefined under `[data-theme='light']`, so components adapt automatically by using the tokens rather than hard-coded colors.

### Smooth scroll

`src/hooks/useLenis.js` — Lenis is connected to `ScrollTrigger.update` via `lenis.on('scroll', ...)` and driven by `gsap.ticker`. The Lenis instance is exposed on `window.__lenis` so `Nav.jsx` can call `window.__lenis.scrollTo(el)` for anchor clicks. Skipped entirely under `prefers-reduced-motion: reduce`.

### Scroll-reveal utility

`src/hooks/useReveal.js` — returns a `ref`. Attach it to any element to get a `y:46→0, opacity:0→1` reveal triggered at `top 88%`. Uses `useGSAP` with `scope: ref` so GSAP auto-cleans on unmount.

### Static content

**All copy, stats, and data arrays live in `src/data/content.js`.** This is the single source of truth — edit here, not in the JSX.

### Animation patterns

- **`useGSAP` (from `@gsap/react`)** is used for all GSAP animations inside components, not `useEffect`. It handles cleanup automatically.
- **`gsap.matchMedia()`** is used for responsive animations (see `Grow.jsx`). Always call `mm.revert()` in the cleanup returned from `useGSAP`.
- **Every animated component checks `prefers-reduced-motion: reduce` first** and sets a static end-state instead of animating. Preserve this branch when editing.
- **Hero has two parallel `useGSAP` effects, both keyed on `[isLoaded]`** (`Hero.jsx`). They are deliberately *decoupled* — neither gates the other — so a flaky entrance can't block the scroll setup:
  1. *Entrance* — fades in tag/icons/sub/CTAs and rises `SOCIAL`/`AUTOWALA` into view, so the wordmark is visible at rest.
  2. *Scroll-driven auto* — **no pin**. A `gsap.matchMedia()` (with `mm.revert()` cleanup, the Grow pattern) holds a single scrubbed `fromTo` that drives the auto across the `AUTOWALA` wordmark: start `x = awRef.left − blockRef.left` (auto's left edge on the first letter) and travel `= AUTOWALA width − auto width` (right edge lands on the last letter). Both are **functions** + `invalidateOnRefresh: true` so they recompute on resize. Trigger = hero, `start: 'top top'`, `end: 'bottom top'`, `scrub: 1.2`. An earlier pinned (`+=280%`) version was abandoned — it was fragile under StrictMode and collapsed its own scroll range.
- **Story** (`Story.jsx`) — two lines slide in scrubbed (`scrub: 1.2`): white "FROM LOCAL STREETS" from the right (`x:110%→0`), green "TO SOCIAL FEEDS." from the left (`x:-110%→0`); the divider draws via `scaleX`. The section needs `overflow: hidden` so the off-screen start positions are clipped.
- **GSAP, not CSS, owns the transforms it animates.** For elements GSAP positions (wordmark `translateY`, auto `x`, Story line `x`), do NOT also set that transform in the CSS Module — the duplicate causes a flash/race before GSAP initializes. CSS only sets non-conflicting initial state like `opacity: 0`.

### Known critical constraints

1. **`Nav.module.css` — backdrop-filter must stay on `::before`**, not on `.nav` itself. `backdrop-filter` makes an element a containing block for `position: fixed` descendants. The mobile menu overlay uses `position: fixed; inset: 0` and would snap to the 70 px nav height instead of the viewport if the filter moves back onto `.nav`.

2. **`Cursor.jsx` — always renders its DOM nodes; never conditionally returns `null`**. The `useEffect` refs (`dotRef`, `ringRef`, `labelRef`) are read inside `loop()` which runs via `requestAnimationFrame`. If the component unmounts/returns null before cleanup the refs go null and crash. Touch-device hiding is handled entirely via CSS (`@media (pointer: coarse) { display: none }`).

3. **`ScrollTrigger.refresh()`** is fired from `App.jsx` after the loader sets `loaded` (a `setTimeout(400)` + `setTimeout(900)` + a `window 'load'` listener, to catch the late-created triggers and async image reflow). If you add/remove a section or change page height, this is the hook to re-trigger. Grow's pin and the Hero's geometry-computed auto travel both depend on a correct refresh.

4. **Only Grow pins.** Grow is the single pinned section (horizontal scroll, ≥881px, via `gsap.matchMedia()` + `mm.revert()`). The Hero does **not** pin — it uses a no-pin scrubbed tween (see Animation patterns). Any ScrollTrigger created after load must `kill()`/`mm.revert()` on cleanup so StrictMode's double-mount can't stack duplicates.

5. **3D icon rendering (`Hero.module.css .icon`).** The icons use `isolation: isolate` + `mix-blend-mode: normal` + a `drop-shadow` filter. This is deliberate: it creates a fresh stacking context that prevents the page-level grain overlay from bleeding into the icons' white edges (which otherwise look black/dim on the dark background), and the white `drop-shadow` halo keeps those edges crisp on dark. Don't replace this filter with `filter: none`.

6. **Grain overlay.** `globals.css` `body::after` is a fixed, full-viewport noise layer at `z-index: 9998` with `mix-blend-mode: overlay`. Anything that must not be blended by it needs its own stacking context (see constraint 5).
