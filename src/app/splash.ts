import { useEffect } from "react";

const MIN_MS = 450;
const MAX_MS = 2000;
const INTRO_MS = 450;
const REMOVE_FALLBACK_MS = 600;

// The splash waits for these keys: fonts, "site" (auth + site status, via AppLayout) and any page that
// registers its own data (the planner). Pages call useSplashReady(key, isReady).
const pending = new Set<string>(["site", "fonts"]);
const html = document.documentElement;
let active = false;
let startedAt = 0;

function finish() {
  if (!active) return;
  active = false;
  // Past the cap the page shows without its data: skeletons appear at once (no --delay-pending).
  if (pending.size > 0) html.dataset.splashCapped = "";
  try {
    sessionStorage.setItem("splash-seen", "1");
  } catch {
    // Storage blocked: the splash simply shows again next load.
  }
  const splash = document.getElementById("splash");
  const root = document.getElementById("root");
  html.dataset.intro = "";
  window.setTimeout(() => delete html.dataset.intro, INTRO_MS);
  if (!splash) return;
  const remove = () => {
    splash.remove();
    root?.removeAttribute("inert");
    delete html.dataset.splash;
  };
  splash.dataset.leaving = "";
  splash.addEventListener("animationend", remove, { once: true });
  window.setTimeout(remove, REMOVE_FALLBACK_MS);
}

function check() {
  if (active && pending.size === 0 && performance.now() - startedAt >= MIN_MS) finish();
}

export function settle(key: string, isReady: boolean) {
  if (!active) return;
  if (isReady) pending.delete(key);
  else pending.add(key);
  check();
}

export function useSplashReady(key: string, isReady: boolean) {
  useEffect(() => settle(key, isReady), [key, isReady]);
}

export function startSplash() {
  const splash = document.getElementById("splash");
  if (html.dataset.splash !== "on" || !splash) {
    splash?.remove();
    return;
  }
  window.clearTimeout(Number(html.dataset.splashFallback));
  active = true;
  startedAt = Number(html.dataset.splashStart) || performance.now();
  const elapsed = performance.now() - startedAt;
  window.setTimeout(check, Math.max(MIN_MS - elapsed, 0));
  window.setTimeout(finish, Math.max(MAX_MS - elapsed, 0));
  Promise.all([
    document.fonts.load("1em Anton"),
    document.fonts.load('1em "Hanken Grotesk Variable"'),
  ])
    .catch(() => undefined)
    .then(() => settle("fonts", true));
}
