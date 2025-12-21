// eslint-disable-next-line simple-import-sort/imports
import { StrictMode } from "react";
// eslint-disable-next-line simple-import-sort/imports
import { createRoot } from "react-dom/client";

// eslint-disable-next-line simple-import-sort/imports
import App from "./App";
// eslint-disable-next-line simple-import-sort/imports
import "./index.css";

/**
 * Entry point for the Mycelial Empire application.
 * Initializes the React root and renders the main App component within StrictMode.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
