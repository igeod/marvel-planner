import { Check } from "lucide-react";

interface StatusProps {
  children?: string | null;
  className?: string;
  // "success" adds the tick circle; a new resultKey starts the fade again for a repeated message.
  tone?: "success";
  resultKey?: number | string;
}

// Live region that stays in the DOM: screen readers only announce changes to a region that already exists.
export function Status({ children, className, tone, resultKey }: StatusProps) {
  const isSuccess = tone === "success" && Boolean(children);
  const classes = [
    className,
    isSuccess ? "status status--success" : null,
    children ? null : "visually-hidden",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <p role="status" className={classes || undefined}>
      {isSuccess ? (
        <span key={resultKey} className="status__inner">
          <span className="status__mark" aria-hidden="true">
            <Check />
          </span>
          <span className="status__text">{children}</span>
        </span>
      ) : (
        children
      )}
    </p>
  );
}
