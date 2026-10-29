import { Eye, EyeOff } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { useI18n } from "../../../i18n/useI18n";
import { Tooltip } from "../Tooltip";

interface SpoilerLabels {
  showLabel: string;
  hideLabel: string;
  warning: string;
}

interface SpoilerBoxProps {
  title: string;
  className?: string;
  // Present when the content tells the story: it stays blurred and inert until the eye is pressed.
  spoiler?: SpoilerLabels;
  headerExtra?: ReactNode;
  // Not a spoiler: stays readable while the content is blurred.
  intro?: ReactNode;
  // A function receives whether the content is still hidden, to drop its buttons from the tab order.
  children?: ReactNode | ((isHidden: boolean) => ReactNode);
}

export function SpoilerBox({
  title,
  className,
  spoiler,
  headerExtra,
  intro,
  children,
}: SpoilerBoxProps) {
  const { t } = useI18n();
  const [isRevealed, setIsRevealed] = useState(false);
  const titleId = useId();
  const contentId = useId();
  const isHidden = spoiler !== undefined && !isRevealed;
  const Icon = isRevealed ? EyeOff : Eye;

  return (
    <article className={["spoiler-box", className].filter(Boolean).join(" ")}>
      <div className="spoiler-box__head">
        <h3 id={titleId} className="section-title">
          {title}
        </h3>
        {headerExtra}
        {spoiler && (
          <Tooltip content={t("prerequisites.warning")} tone="warning">
            {(describedBy) => (
              <button
                type="button"
                className="spoiler-box__eye"
                aria-expanded={isRevealed}
                aria-controls={contentId}
                aria-describedby={describedBy}
                aria-label={isRevealed ? spoiler.hideLabel : spoiler.showLabel}
                onClick={() => setIsRevealed(!isRevealed)}
              >
                <Icon aria-hidden />
              </button>
            )}
          </Tooltip>
        )}
      </div>
      {intro}
      {children && (
        <div
          id={contentId}
          className="spoiler-box__content"
          role="region"
          aria-labelledby={titleId}
          data-hidden={isHidden || undefined}
          aria-hidden={isHidden || undefined}
          inert={isHidden}
          tabIndex={isHidden ? undefined : 0}
        >
          {typeof children === "function" ? children(isHidden) : children}
        </div>
      )}
    </article>
  );
}
