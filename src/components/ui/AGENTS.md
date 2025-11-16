# AGENTS — `src/components/ui/`

Overview

- Purpose: Small UI primitives and overlays used across the app.

Files

- `CanvasMaskOverlay.tsx`: Visual mask/overlay for the canvas layer.
- `ToastHub.tsx`: Renders toasts pushed by `useUiStore.pushToast` and centralizes toast animations/queueing.

Notes

- `ToastHub` is the central place to show ephemeral user feedback (results of actions, errors). Use `useUiStore.pushToast` from components and stores.
