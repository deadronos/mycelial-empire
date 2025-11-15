# TASK004 - Visual polish & canvas sizing retrospective

**Status:** Completed  
**Added:** 2025-11-15  
**Updated:** 2025-11-15

## Original Request

The user asked to "polish visuals" after previous layout work: make the central card have a soft milky glass appearance, add soft periphery dimming, ensure the Three.js canvas sizes reliably inside the card, and keep the mobile drawer behavior for the stats column. The scope included tuning DPR handling for crisp rendering on high-DPI screens.

## Thought Process

This task grouped UI polish items that are highly visual and iterative. Key constraints:

- Keep the rendering robust (avoid pointer-event problems introduced by full-screen masked canvases).
- Prioritize subtlety — the glass and vignette should be understated.
- Balance visual fidelity and runtime cost (DPR increases buffer memory usage).

Because the canvas had previously mounted to the browser's default 300×150 fallback (R3F measured wrong size), we prioritized fixing sizing first so visual tweaks would be reliable across devices.

## Implementation Plan

1. Force the R3F `<Canvas>` to fill its parent via `w-full h-full` and explicit inline style so R3F measures the correct container size on mount.
2. Compute a `maxDpr` from `window.devicePixelRatio` and pass `dpr={[1, maxDpr]}` to `<Canvas>` (cap at 2 by default).
3. Add a soft periphery dim layer (pointer-events-none radial overlay) behind the central card.
4. Increase central card blur and add a subtle milky overlay + faint ring highlight and an inner vignette (inset box-shadow) to increase perceived depth.
5. Tweak the noise overlay SVG (lower turbulence & opacity) to remain subtle.
6. Update `ActionBar` styles to match the glassy aesthetic (translucent fills, softened borders, small backdrop blur on hover areas).
7. Verify via DevTools: measure CSS canvas size and canvas buffer, validate clipping and overlay layering.

## Progress Tracking

**Overall Status:** Completed — 100%  

### Subtasks

| ID  | Description | Status | Updated | Notes |
| --- | ----------- | ------ | ------- | ----- |
| 4.1 | Fix R3F canvas sizing & force fill | Completed | 2025-11-15 | Added `w-full h-full` and inline styles to `<Canvas>`. |
| 4.2 | DPR cap & logic | Completed | 2025-11-15 | Computed `maxDpr` from `window.devicePixelRatio` and capped at 2; passed this value to Canvas `dpr`. |
| 4.3 | Add soft periphery vignette (behind card) | Completed | 2025-11-15 | Implemented pointer-events-none radial overlay. |
| 4.4 | Add milky overlay + inner vignette | Completed | 2025-11-15 | Added `.inner-vignette` utility and milky overlay layer. |
| 4.5 | Tune noise overlay | Completed | 2025-11-15 | Reduced turbulence & opacity; lowered overall noise opacity. |
| 4.6 | ActionBar style tuning | Completed | 2025-11-15 | Updated translucent/button styles. |
| 4.7 | DevTools verification | Completed | 2025-11-15 | Verified CSS/physical sizes and layer stacking. |

### Progress Log

#### 2025-11-15

- Started by inspecting the running site at `http://localhost:5173` using DevTools; observed `canvas` mounted at 300×150 (default) — root cause: R3F measured wrong parent size.
- Implemented forcing canvas wrapper to `w-full h-full` and added inline style on `<Canvas>` to ensure correct measurement on mount; reloaded page — canvas now sized to card.
- Added `maxDpr` logic and passed `dpr={[1, maxDpr]}` to `<Canvas>` (cap = 2). Verified `canvas.width/height` matched CSS × DPR cap.
- Implemented periphery vignette overlay and subtle milky overlay inside the card; created `.inner-vignette` class and moved inline inset shadow into CSS utility.
- Reduced noise overlay intensity (SVG turbulence & opacity) for subtle texture.
- Tuned `ActionBar` styles to use translucent backgrounds, softened borders, and small backdrop blur.
- Performed final DevTools checks of measurements and layer ordering.

## Acceptance

- Visual: central card exhibits subtle milky glass, inner vignette, and soft periphery dimming.
- Technical: canvas CSS size equals card inner area; `canvas.width/height` equals CSS × DPR cap. Verified on desktop with devicePixelRatio=2.
- Responsive: `StatsPanel` remains hidden at small breakpoints and accessible via `LeftDrawer`.

## Files changed (reference)

- `src/graphics/GraphScene.tsx`
- `src/App.tsx`
- `src/index.css`
- `src/components/actions/ActionBar.tsx`

## Next / Follow-up

- If a perfect cutout vignette is required, implement an SVG mask or CSS `mask`/`clip-path`, and carefully handle pointer-events and accessibility.
- Consider making `maxDpr` configurable (dev setting) or automatically lower DPR on low-power devices.

---

Recorded by: Build Agent (automated edits & DevTools verification)
