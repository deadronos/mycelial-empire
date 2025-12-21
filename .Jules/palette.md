# Palette's Journal

## 2024-05-20 - Accessible Game Feedback
**Learning:** In a React-based game loop, state changes (like "Not enough sugar") are often reflected only in a visual log. For screen reader users, this silence is confusing. Adding `role="log"` and `aria-live="polite"` to the event container instantly transforms the experience from "broken/unresponsive" to "immersive" without changing the visual design.
**Action:** Always check if the primary feedback mechanism of an interactive app is announced to assistive technology, especially for custom log components.
