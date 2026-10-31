import { Check } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../../../../i18n/useI18n";

interface MarkWatchedButtonProps {
  isWatched: boolean;
  onToggle: () => void;
}

export function MarkWatchedButton({ isWatched, onToggle }: MarkWatchedButtonProps) {
  const { t } = useI18n();
  // The check draws itself only after the user presses the button, not when a watched title loads.
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="mark-watched">
      <button
        type="button"
        className={`mark-watched__button${isWatched ? " mark-watched__button--watched" : ""}${isPressed ? " mark-watched__button--pressed" : ""}`}
        aria-pressed={isWatched}
        onClick={() => {
          setIsPressed(true);
          onToggle();
        }}
      >
        <span className="mark-watched__pill">
          <Check aria-hidden />
          {isWatched ? t("prerequisites.watched") : t("planner.next.markWatched")}
        </span>
      </button>
    </div>
  );
}
