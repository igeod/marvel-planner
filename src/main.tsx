import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { applyTheme, readStoredTheme } from "./features/theme/theme";
import "@fontsource/anton/latin-400.css";
import "@fontsource/anton/latin-ext-400.css";
import "@fontsource-variable/hanken-grotesk/wght.css";
import "./styles/index.less";

applyTheme(readStoredTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Theme crossfade is enabled after first paint so the page never fades in from the wrong colors.
requestAnimationFrame(() =>
  requestAnimationFrame(() => document.documentElement.classList.add("theme-ready")),
);
