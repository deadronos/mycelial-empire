import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import unicorn from "eslint-plugin-unicorn";
import vitestPlugin from "eslint-plugin-vitest";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import jestDomPlugin from "eslint-plugin-jest-dom";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  globalIgnores(["dist", "coverage"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tsPlugin.configs['flat/recommended'],
      reactPlugin.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      testingLibraryPlugin.configs['flat/react'],
      jestDomPlugin.configs['flat/recommended'],
      vitestPlugin.configs.recommended,
      prettier,
    ],
    plugins: {
      '@typescript-eslint': tsPlugin,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.eslint.json'],
        },
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-ignore': 'allow-with-description' }],
      'react/jsx-key': 'error',
      'react/jsx-no-useless-fragment': 'warn',
      'react/function-component-definition': ['warn', { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/no-duplicates': 'error',
      'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.{test,spec}.{ts,tsx,js,jsx}', 'tests/**', '**/setupTests.*', '**/vitest.setup.*', '**/vite.config.*', '**/vitest.config.*'] }],
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'unicorn/prefer-module': 'off',
      'unused-imports/no-unused-imports': 'error',
      'no-restricted-syntax': [
        'warn',
        {
          selector: "AssignmentExpression[left.type='MemberExpression'][left.object.type='CallExpression'][left.object.callee.type='MemberExpression'][left.object.callee.object.name='useGameStore'][left.object.callee.property.name='getState']",
          message: 'Do not assign to objects returned by useGameStore.getState(); use useGameStore.setState(...) instead',
        },
        {
          selector: "CallExpression[callee.type='MemberExpression'][callee.property.name=/^(push|pop|splice|unshift|shift|reverse|sort)$/][callee.object.type='MemberExpression'][callee.object.object.type='CallExpression'][callee.object.object.callee.type='MemberExpression'][callee.object.object.callee.object.name='useGameStore'][callee.object.object.callee.property.name='getState']",
          message: 'Do not mutate arrays from useGameStore.getState(); use useGameStore.setState(...) instead',
        },
      ],
    },
  },
  {
    files: ["src/graphics/**", "src/ecs/**"],
    rules: {
      'react/no-unknown-property': 'off',
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
      "@typescript-eslint": tsPlugin,
    },
    extends: [js.configs.recommended, tsPlugin.configs['flat/recommended'], reactHooks.configs.flat.recommended, reactRefresh.configs.vite, prettier],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: __dirname,
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
    },
  },
]);
