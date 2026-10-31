import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { computePlacement, type Placement } from "./placement";

// Reads --delay-tooltip (400ms, 0 under reduced motion) so the delay lives with the other tokens.
function hoverOpenDelay(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--delay-tooltip");
  return Number.parseFloat(raw) || 0;
}

const HOVER_CLOSE_DELAY_MS = 100;

interface TooltipProps {
  content: ReactNode;
  children: (describedBy: string) => ReactNode;
  placement?: Placement;
  tone?: "neutral" | "warning";
  opensOnTap?: boolean;
}

export function Tooltip({
  content,
  children,
  placement = "top",
  tone = "neutral",
  opensOnTap = false,
}: TooltipProps) {
  const bubbleId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const pointerTypeRef = useRef("mouse");
  const isPointerFocusRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const clearTimer = () => window.clearTimeout(timerRef.current);

  const schedule = (open: boolean, delay: number) => {
    clearTimer();
    timerRef.current = window.setTimeout(() => setIsOpen(open), delay);
  };

  const position = useCallback(() => {
    const bubble = bubbleRef.current;
    const wrapper = wrapperRef.current;
    if (!bubble || !wrapper) return;

    const anchor = wrapper.querySelector("[data-tooltip-anchor]") ?? wrapper;
    const result = computePlacement(
      anchor.getBoundingClientRect(),
      { width: bubble.offsetWidth, height: bubble.offsetHeight },
      { width: window.innerWidth, height: window.innerHeight },
      placement,
    );
    bubble.dataset.placement = result.placement;
    bubble.style.left = `${result.left}px`;
    bubble.style.top = `${result.top}px`;
    bubble.style.setProperty("--tip-arrow", `${result.arrow}px`);
  }, [placement]);

  useEffect(() => {
    const bubble = bubbleRef.current;
    if (!bubble) return;

    if (!isOpen) {
      if (bubble.matches(":popover-open")) bubble.hidePopover();
      return;
    }

    bubble.showPopover();
    position();

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("scroll", position, true);
    window.addEventListener("resize", position);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", position, true);
      window.removeEventListener("resize", position);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, position]);

  useEffect(() => clearTimer, []);

  return (
    <span
      ref={wrapperRef}
      className={`tooltip tooltip--${tone}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") schedule(true, hoverOpenDelay());
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") schedule(false, HOVER_CLOSE_DELAY_MS);
      }}
      onPointerDown={(event) => {
        pointerTypeRef.current = event.pointerType;
        isPointerFocusRef.current = true;
      }}
      onFocus={() => {
        const isTouchFocus = isPointerFocusRef.current && pointerTypeRef.current !== "mouse";
        isPointerFocusRef.current = false;
        if (isTouchFocus) return;
        clearTimer();
        setIsOpen(true);
      }}
      onBlur={() => {
        clearTimer();
        setIsOpen(false);
      }}
      onClick={() => {
        if (opensOnTap && pointerTypeRef.current !== "mouse") setIsOpen((current) => !current);
      }}
    >
      {children(bubbleId)}
      <div
        ref={bubbleRef}
        id={bubbleId}
        className="tooltip__bubble"
        role="tooltip"
        popover="manual"
        onPointerEnter={clearTimer}
      >
        {content}
      </div>
    </span>
  );
}
