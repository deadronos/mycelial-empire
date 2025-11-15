# [TASK003] - Restore Prototype SVG Visual Style

**Status:** In Progress  
**Added:** 2025-11-15  
**Updated:** 2025-11-15

## Original Request

User noticed the current implementation doesn't match the original prototype's visual style. The prototype used SVG with dramatic glowing effects, gradient edges, and a specific dark aesthetic, while the current version uses React Three Fiber 3D rendering.

## Thought Process

The prototype had a distinctive underground/mycelial aesthetic that was achieved through:
- SVG-based 2D rendering with radial gradients
- Multi-stop linear gradients on edges creating flowing color effects
- Dramatic glow effects using drop-shadow filters
- Message overlay system at bottom of graph
- Stats panel positioned on right side in a full-height sidebar

The current R3F implementation is more 3D-focused but lacks the atmospheric quality of the original.

## Implementation Plan

1. Replace GraphScene 3D canvas with SVG-based rendering
2. Restore gradient definitions for nodes and edges
3. Add message overlay system to graph view
4. Adjust layout to match prototype (stats on right, full sidebar)
5. Implement glow effects using SVG filters
6. Maintain ECS entity subscriptions but render to SVG instead of Three.js

## Progress Tracking

**Overall Status:** In Progress - 90%

### Subtasks

| ID | Description | Status | Updated | Notes |
|----|-------------|--------|---------|-------|
| 3.1 | Create new SVG-based GraphScene component | Complete | 2025-11-15 | Replaced R3F with SVG rendering |
| 3.2 | Implement node rendering with radial gradients | Complete | 2025-11-15 | Added gradient defs and glow effects |
| 3.3 | Implement edge rendering with animated gradients | Complete | 2025-11-15 | Linear gradients with color stops |
| 3.4 | Add message overlay system | Complete | 2025-11-15 | Added latestMessage to UI store |
| 3.5 | Adjust App.tsx layout for right sidebar | Complete | 2025-11-15 | Horizontal resource bar + right stats sidebar |
| 3.6 | Update StatsPanel for sidebar placement | Complete | 2025-11-15 | Full-height sidebar with sections |
| 3.7 | Update ActionBar styling | Complete | 2025-11-15 | Emoji icons + hotkey hints |
| 3.8 | Update ResourceTray for horizontal layout | Complete | 2025-11-15 | Compact pills in top bar |
| 3.9 | Fix linting issues | Not Started | | Inline styles warnings remain |

## Progress Log

### 2025-11-15

- Created task to track SVG visual restoration
- Replaced React Three Fiber canvas with SVG-based rendering
- Implemented radial gradient definitions for node glowing effects
- Implemented linear gradient edges with multi-color stops
- Added message overlay system to UI store and GraphScene
- Restructured App.tsx layout: top resource bar + main area with left graph/actions + right stats sidebar
- Updated ResourceTray to display horizontally with compact pill design
- Updated StatsPanel for full-height sidebar with sectioned content
- Updated ActionBar with emoji icons, hotkey hints, and prototype-matching button styles
- Connected action outcomes to message overlay system
- Dev server running successfully on localhost:5175
