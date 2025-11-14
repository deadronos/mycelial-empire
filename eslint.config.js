import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vitestPlugin from "eslint-plugin-vitest";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import jestDomPlugin from "eslint-plugin-jest-dom";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "coverage"]),
  {
    files: ["**/*.{ts,tsx}", "*.{ts,tsx}"],
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite, prettier],
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: [
      "**/*.{test,spec}.{ts,tsx,js,jsx}",
      "tests/**/*.{test,spec}.{ts,tsx,js,jsx}",
    ],
    plugins: {
      vitest: vitestPlugin,
      "testing-library": testingLibraryPlugin,
      "jest-dom": jestDomPlugin,
      "@typescript-eslint": tsPlugin,
    },
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite, prettier],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.test.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    rules: {
      'vitest/no-focused-tests': 'error',
      'vitest/no-disabled-tests': 'warn',
      'testing-library/no-debugging-utils': 'warn',
      // 'jest-dom/prefer-enabled-assertion': 'warn',
    },
  },
]);
