import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Vite configuration file.
 * Configures React plugin, Tailwind CSS, path aliases, and server settings.
 *
 * - Defaults `base` to `/` for local dev.
 * - In CI (or when VITE_BASE is provided) it will use the appropriate base
 *   so the app can be deployed under `https://deadronos.github.io/mycelial-empire/`.
 */
export default defineConfig(() => {
  const base =
    process.env.VITE_BASE ??
    (process.env.GITHUB_ACTIONS || process.env.CI ? "/mycelial-empire/" : "/");

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      tsconfigPaths: true,
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: 5173,
      open: true,
    },
  };
});
