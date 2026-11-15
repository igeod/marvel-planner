import { useEffect, useRef, useState } from "react";
import { readCssMs } from "../../../lib/cssDuration";

interface CountUpOptions {
  // Duration of the count from 0 on the first arrival; left out, the number starts at its target and
  // only counts when it changes.
  initialMs?: number;
  changeMs: number;
  enabled: boolean;
  // False holds the number at 0 until it turns true (the planner starts it with its entrance).
  isStarted?: boolean;
}

// The first count takes --dur-progress, the same as the bars' first fill and the strip's battery:
// one source, read from the stylesheet (300ms if the token is missing).
export const countInitialMs = () => readCssMs("--dur-progress", 300);

// Decelerating exit: 1 − (1 − t)³.
export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

// Whole steps from `from` to `to`; `progress` runs from 0 to 1.
export function countUpValue(from: number, to: number, progress: number): number {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return Math.round(from + (to - from) * easeOutCubic(clamped));
}

// Counts up to `target` (the first time from 0), also down when it drops. With `enabled` false
// (reduced motion) the value jumps straight to the target.
export function useCountUp(
  target: number,
  { initialMs, changeMs, enabled, isStarted = true }: CountUpOptions,
) {
  const [value, setValue] = useState(enabled && initialMs ? 0 : target);
  const currentRef = useRef(value);
  const isFirstRef = useRef(true);

  useEffect(() => {
    if (!isStarted) return;
    const isFirst = isFirstRef.current;
    isFirstRef.current = false;
    const from = currentRef.current;
    const show = (next: number) => {
      currentRef.current = next;
      setValue(next);
    };
    if (!enabled || from === target) {
      show(target);
      return;
    }
    const duration = isFirst ? (initialMs ?? changeMs) : changeMs;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const progress = (now - start) / duration;
      show(countUpValue(from, target, progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [target, enabled, initialMs, changeMs, isStarted]);

  return enabled ? value : target;
}
