import { RotateCcw, TriangleAlert } from "lucide-react";
import { useI18n } from "../../../i18n/useI18n";
import { Button } from "../Button";
import { StateBox } from "../StateBox";

interface LoadErrorProps {
  variant?: "block" | "inline";
  onRetry: () => void;
  title?: string;
  message?: string;
}

const BARS_ART = (
  <svg viewBox="0 0 96 96" aria-hidden>
    <g fill="currentColor" opacity="0.28">
      <rect x="10" y="54" width="16" height="30" rx="3" />
      <rect x="32" y="38" width="16" height="46" rx="3" />
      <rect x="54" y="24" width="16" height="60" rx="3" />
      <rect x="76" y="46" width="10" height="38" rx="3" />
    </g>
    <path d="M8 90 88 16" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
  </svg>
);

export function LoadError({ variant = "block", onRetry, title, message }: LoadErrorProps) {
  const { t } = useI18n();
  const heading = title ?? t("loadError.title");
  const text = message ?? t("loadError.body");

  if (variant === "block") {
    return (
      <StateBox
        role="alert"
        art={BARS_ART}
        title={heading}
        actions={
          <Button variant="soft" icon={<RotateCcw aria-hidden />} onClick={onRetry}>
            {t("common.retry")}
          </Button>
        }
      >
        {text}
      </StateBox>
    );
  }

  return (
    <div className="load-error load-error--inline" role="alert">
      <TriangleAlert className="load-error__icon" aria-hidden />
      <div className="load-error__text">
        <strong>{heading}</strong>
        <p>{text}</p>
      </div>
      <Button variant="soft" size="sm" icon={<RotateCcw aria-hidden />} onClick={onRetry}>
        {t("common.retry")}
      </Button>
    </div>
  );
}
