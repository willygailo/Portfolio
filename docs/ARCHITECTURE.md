# Portfolio Architecture

Mobile-only, zero-dependency static portfolio for **Willy Jr Carnasa Gailo** (`@willygailo` / `PENTESTER willygailo`). Designed as a thumb-friendly 430px mobile app shell that runs identically over `file://`, local HTTP servers, and static hosts like GitHub Pages with no build step.

## Overview

- **Zero frameworks / zero bundlers**: Pure HTML5, CSS3, and classic `<script defer>` IIFEs.
- **Offline & `file://` safe**: Avoids ES module CORS restrictions on `file://` by loading scripts in deterministic order onto `window.PortfolioData` and `window.Portfolio`.
- **Safe DOM rendering**: UI hydration uses `document.createElement` and `textContent` rather than injecting untrusted HTML strings.
- **PWA-ready**: Includes `manifest.json`, SVG app/favicon icons, and mobile viewport/safe-area support.

## File Responsibilities

| Path | Owner / Role | Responsibility |
| --- | --- | --- |
| `index.html` | Markup | Semantic HTML5 shell, 4 mobile sections (`#home`, `#projects`, `#skills`, `#connect`), bottom navigation, bottom-sheet modal, and toast region. |
| `manifest.json` | Markup | PWA metadata referencing `index.html` and `assets/icons/app-icon.svg`. |
| `robots.txt` | Markup | Crawler directives (`Allow: /`). |
| `css/reset.css` | Styles | Box-sizing reset, touch-action defaults, focus-visible ring, and `[hidden]` enforcement. |
| `css/tokens.css` | Styles | Dark-cyber default theme tokens (`[data-theme="dark"]`), light theme overrides (`[data-theme="light"]`), fluid typography, spacing, z-index, and safe-area variables. |
| `css/layout.css` | Styles | Full-bleed mobile layout below `768px`, centered `430px` app frame on wider viewports, sticky `.top-bar`, and fixed `.bottom-nav`. |
| `css/components.css` | Styles | Hero card, 2x2 Bento stats, mini-terminal, search/filter chips, project cards, skill clusters, connect form, bottom-sheet modal, and toast. |
| `css/animations.css` | Styles | Bottom-sheet slide-up, status dot pulse, intersection reveal states, and `prefers-reduced-motion` overrides. |
| `js/data/portfolio-data.js` | Data | Frozen `window.PortfolioData` store containing verified profile, 6 repositories, 4 skill groups, social links, and terminal commands. |
| `js/utils/dom.js` | Scripts | `window.Portfolio.dom` helpers (`qs`, `qsa`, `el`, `showToast`). |
| `js/utils/theme.js` | Scripts | `window.Portfolio.theme` state persistence via `localStorage("portfolio-theme")` and toggle control. |
| `js/components/nav.js` | Scripts | Smooth section scrolling and `IntersectionObserver` scroll-spy for `.bottom-nav`. |
| `js/components/modal.js` | Scripts | `#project-modal` bottom-sheet open/close, focus trapping, Escape handling, and touch swipe-down dismissal. |
| `js/components/projects.js` | Scripts | Category filter chips, live search filtering, project card rendering, and modal triggers. |
| `js/components/terminal.js` | Scripts | Interactive mini-terminal chip execution, command parsing, and log output. |
| `js/main.js` | Scripts | `DOMContentLoaded` bootstrap hydrating stats, skills, socials, clipboard copy, contact composer, and scroll reveals. |
| `assets/icons/favicon.svg` | Assets | Dark-cyber shield + geometric `"WG"` monogram favicon. |
| `assets/icons/app-icon.svg` | Assets | 512x512 PWA icon with cyber grid, shield frame, and `"WG"` terminal emblem. |
| `assets/images/avatar.svg` | Assets | Stylized cyber developer/pentester avatar emblem. |

## Mobile-Only Design Rules

1. **Constrained mobile shell**: Full-bleed on viewports `< 768px`; centered `max-width: 430px` frame on tablet/desktop viewports with `overflow-x: clip`.
2. **Thumb-zone ergonomics**: Primary navigation sits in a fixed bottom bar (`.bottom-nav`) with `>= 44px` tap targets and safe-area bottom padding (`env(safe-area-inset-bottom)`).
3. **Bottom-sheet inspection**: Project details open in a mobile bottom sheet (`#project-modal`) supporting backdrop tap, close button, `Escape`, and downward swipe (`> 70px`).
4. **No iOS Safari auto-zoom**: Form inputs (`#terminal-input`, `#project-search`, `#contact-form` fields) use `>= 16px` font size.
5. **High contrast & reduced motion**: Dark mode is default (`#090d12` base, `#10b981` / `#22d3ee` accents) with an accessible light theme and full `@media (prefers-reduced-motion: reduce)` support.

## Static Deployment

### 1. Direct Local File (`file://`)
Open `index.html` directly in any modern mobile or desktop browser. Because all scripts use classic `<script defer>` globals instead of ES modules, data hydration and interactions work without a local server.

### 2. Local Development Server
Run any zero-config static file server from the repository root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` (use browser DevTools mobile emulation at `390x844` or `430x932` to preview touch layout).

### 3. GitHub Pages
1. Push the repository contents (including `index.html`, `manifest.json`, `robots.txt`, `css/`, `js/`, and `assets/`) to GitHub.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, select **Deploy from a branch** (`main` / `/ (root)`).
4. Save and visit `https://willygailo.github.io/<repo-name>/` (or `https://willygailo.github.io/` if hosted in `willygailo.github.io`).
