---
id: DES003
title: Visual Polish & Canvas Sizing — Retrospective
status: Completed
added: 2025-11-15
updated: 2025-11-15
---

## DES003 — Visual Polish & Canvas Sizing Retrospective

## Summary

This design note records the decisions, trade-offs, and implementation details for the visual polish work completed on 2025-11-15. The work focused on: ensuring the Three.js canvas fills the central "card" element reliably, improving rendering crispness on high-DPI displays, and applying a subtle milky-glass visual treatment with a soft periphery dimming and inner vignette.

## Motivation / Goals

- Soft periphery dimming so the central card reads as the focal plane.
- Subtle milky-glass effect on the central card (backdrop blur + milky tint + faint ring/highlight).
- Reliable canvas sizing: R3F must measure the parent size on mount so CSS canvas size and drawing buffer match expected dimensions.
- Reasonable DPR handling: support high-DPI screens while limiting memory/GPU cost.
- Keep mobile behavior intact: stats column hidden on small screens, replaced by the left drawer.

## Requirements (EARS-style)

- WHEN the app renders the central view, THE SYSTEM SHALL render a rounded, translucent card with a subtle milky overlay and soft vignette [Acceptance: visual QA across desktop/mobile].
- WHEN the 3D scene mounts, THE SYSTEM SHALL ensure the WebGL canvas fills the central card and its internal pixel buffer scales with DPR up to a configurable cap (default cap = 2) [Acceptance: measured `canvas.getBoundingClientRect()` equals card inner box; `canvas.width/height` == CSS size × DPR].
- WHEN the viewport width is small, THE SYSTEM SHALL hide the right-hand `StatsPanel` and expose the same content via a slide-in drawer (mobile drawer) [Acceptance: responsive breakpoint checks].

## Design Options Considered

- Option A — Canvas inside the card (chosen): render the R3F `<Canvas>` within the central card DOM node and rely on `overflow:hidden` to clip. Advantages: simple stacking, predictable clipping, fewer pointer-event issues. Disadvantages: mask-shaped peripheral effects (cutouts) require additional effort if needed.
- Option B — Full-screen canvas + DOM/SVG mask: render canvas fullscreen and mask the center via an SVG/CSS mask so the periphery dims while the card remains visible. Advantages: precise mask cutouts and effects; Disadvantages: more complex (pointer-events passthrough, mask perf, z-indexing) and not necessary for current scope.

Decision: We chose Option A for robustness and simplicity. For most visual needs (subtle periphery dim + milky glass) DOM overlays + in-card canvas suffice and avoid extra complexity.

## Implementation Summary

- Force R3F `<Canvas>` to size to 100% of the parent via `className="w-full h-full"` and inline `style={{ width: '100%', height: '100%' }}` so it measures correctly on mount.
- Provide a DPR upper bound computed from `window.devicePixelRatio` (capped at 2) and pass `dpr={[1, maxDpr]}` to `<Canvas>` to balance sharpness and resource usage.
- Add a pointer-events-none radial vignette overlay behind the central card (soft periphery dim) and a faint milky overlay inside the card (mix-blend overlay + low opacity) to achieve the glass effect.
- Add an inner vignette via an inset box-shadow to increase perceived depth.
- Tweak the noise overlay texture to be subtle (lower SVG turbulence/opacity) so texture is present but unobtrusive.
- Update `ActionBar` element styles to match the milky glass aesthetic (translucent fills, softened borders, small backdrop blur on button hover areas).

## Files Changed

- `src/graphics/GraphScene.tsx` — force canvas sizing, compute `maxDpr` from `window.devicePixelRatio`, `dpr={[1, maxDpr]}`.
- `src/App.tsx` — added periphery vignette overlay, milky overlay, inner vignette (`.inner-vignette` class), and tuned card background/blur/ring.
- `src/index.css` — adjusted noise overlay SVG and opacity; added `.inner-vignette` utility class.
- `src/components/actions/ActionBar.tsx` — tuned backgrounds, borders, and blurs for ActionBar buttons and container.

## Validation / Acceptance

- Canvas fills card and is clipped correctly: verified via DevTools measurements: CSS canvas size and `canvas.width/height` match (CSS × DPR cap).
- Visual look: card uses `backdrop-blur-lg`, faint milky overlay, inner vignette, and soft vignette behind the card — subjective match to prototype verified by designer. Adjustments to gradient stops/opacity remain available.
- Mobile drawer behavior unchanged: `LeftDrawer` still opens on small screens.

## Trade-offs & Future Work

- Masked-vignette cutout: if you need a perfect rounded cutout for the vignette (with crisp edges), implement an SVG mask or CSS `mask`/`clip-path` approach. This adds complexity for pointer events and requires careful cross-browser testing.
- DPR cap: currently set to 2. Raising it increases sharpness on very high-DPI displays but increases GPU and memory usage. Consider exposing as a user or dev setting if desired.
- Performance monitoring: add a small performance budget test and optionally lower DPR or switch to dynamic DPR in low-power modes.

## Links

- Related task: `memory/tasks/TASK004-visual-polish-retrospective.md`
- Code references listed above.

**Date:** 2025-11-15
