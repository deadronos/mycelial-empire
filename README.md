# Mycelial Empire

A modern Vite + React + TypeScript sandbox for simulating a glowing underground fungal colony. This project implements a resource management and network growth simulation where players manage a mycelial network.

## Features

- **Network Simulation**: Manage nodes (heart, junction, water, carbon, etc.) and edges (hyphae) with flow capacity and strain.
- **Resource Management**: Collect and balance Sugar, Water, Carbon, Nutrients, and Spores.
- **Dynamic Growth**: Explore to reveal new nodes or spawn them procedurally.
- **Prestige System**: "Fruiting" resets the network but grants Spores for permanent upgrades.
- **Visuals**: Glowing SVG-based hyphae network with dynamic effects.

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **Radix UI** (available in dependencies)

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)

### Installation

```bash
npm install
```

### Running the App

```bash
npm run dev
```

### Previewing the GitHub Pages build 🚀

- **Production URL:** `https://deadronos.github.io/mycelial-empire/`
- **Preview locally (POSIX):**

```bash
VITE_BASE=/mycelial-empire/ npm run build
npx serve dist
```

- **Preview locally (PowerShell):**

```powershell
$env:VITE_BASE = '/mycelial-empire/'; npm run build
npx serve dist
```

- **Notes:** CI sets `VITE_BASE=/mycelial-empire/` for the Pages workflow; override with `VITE_BASE` if you need a different base.

### Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint.
- `npm run format`: Format code with Prettier.
- `npm run typecheck`: Run TypeScript compiler check.
- `npm test`: Run tests with Vitest.

## Project Structure

```text
src/
 ├─ App.tsx           # Main game logic, state, and UI rendering (Prototype Monolith)
 ├─ main.tsx          # Application entry point
 ├─ index.css         # Global styles and Tailwind directives
```

## Game Mechanics

1.  **Flow & Strain**: Resources flow from sources to the Heart. Edges have capacity; exceeding it causes strain.
2.  **Upgrades**: Spend Sugar to upgrade Node efficiency.
3.  **Reinforcement**: Spend Sugar to increase Edge capacity.
4.  **Exploration**: Spend Sugar to discover new parts of the map.
5.  **Prestige**: Trigger "Fruiting" to gain Spores and unlock permanent buffs like "Rich Mycelium" or "Tensile Hyphae".

## Documentation

All source code is fully documented with JSDoc/TSDoc comments. Hover over functions and types in your IDE for details.
