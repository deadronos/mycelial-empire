/* eslint-disable simple-import-sort/imports */
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import App from "./App";
import "./index.css";
/* eslint-enable simple-import-sort/imports */

/**
 * Entry point for the Mycelial Empire application.
 * Initializes the React root and renders the main App component within StrictMode.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
