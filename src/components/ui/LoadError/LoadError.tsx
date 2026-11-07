import { RotateCcw, TriangleAlert } from "lucide-react";
import { useI18n } from "../../../i18n/useI18n";
import { Button } from "../Button";

interface LoadErrorProps {
  variant?: "block" | "inline";
  onRetry: () => void;
  title?: string;
  message?: string;
}

export function LoadError({ variant = "block", onRetry, title, message }: LoadErrorProps) {
  const { t } = useI18n();
  const isBlock = variant === "block";

  return (
    <div className={`load-error load-error--${variant}`} role="alert">
      {isBlock ? (
        <svg className="load-error__art" viewBox="0 0 96 96" aria-hidden>
          <g fill="currentColor" opacity="0.28">
            <rect x="10" y="54" width="16" height="30" rx="3" />
            <rect x="32" y="38" width="16" height="46" rx="3" />
            <rect x="54" y="24" width="16" height="60" rx="3" />
            <rect x="76" y="46" width="10" height="38" rx="3" />
          </g>
          <path
            d="M8 90 88 16"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      ) : (
        <TriangleAlert className="load-error__icon" aria-hidden />
      )}
      <div className="load-error__text">
        {isBlock ? (
          <h3>{title ?? t("loadError.title")}</h3>
        ) : (
          <strong>{title ?? t("loadError.title")}</strong>
        )}
        <p>{message ?? t("loadError.body")}</p>
      </div>
      <Button
        variant="soft"
        size={isBlock ? "md" : "sm"}
        icon={<RotateCcw aria-hidden />}
        onClick={onRetry}
      >
        {t("common.retry")}
      </Button>
    </div>
  );
}
