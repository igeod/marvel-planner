import { Chevron } from "../../../../components/ui/Chevron";
import { useI18n } from "../../../../i18n/useI18n";
import { usePhaseMotion } from "../../hooks/usePhaseMotion";

interface PlannerGuideProps {
  isOpen: boolean;
  isChronological: boolean;
  showAlternate: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

// Same family as a phase: a <details> card with the phase summary row, chevron and open/close motion.
export function PlannerGuide({
  isOpen,
  isChronological,
  showAlternate,
  onOpenChange,
}: PlannerGuideProps) {
  const { t, rich } = useI18n();
  const ref = usePhaseMotion(!isOpen);

  // Names of tabs and filters come from their own keys, so the text stays right if a label changes.
  const names = {
    chrono: <strong>{t("planner.order.chronological")}</strong>,
    release: <strong>{t("planner.order.release")}</strong>,
    tag: <strong>{t("planner.tags.alternate")}</strong>,
    filter: <strong>{t("planner.filters.showAlternate")}</strong>,
  };

  return (
    <details
      ref={ref}
      className="phase card planner-guide"
      open={isOpen}
      onToggle={(event) => {
        // Ignore toggles caused by the animation; react only to native ones (e.g. find in page).
        const details = event.currentTarget;
        if (details.dataset.motion || details.open === isOpen) return;
        onOpenChange(details.open);
      }}
    >
      <summary
        className="phase__summary"
        onClick={(event) => {
          event.preventDefault();
          onOpenChange(!isOpen);
        }}
      >
        <h2 className="phase__name phase__heading">{t("planner.guide.title")}</h2>
        <Chevron />
      </summary>

      <div className="planner-guide__items">
        <div>
          <h3>{t("planner.guide.orderTerm")}</h3>
          <p>
            {rich(
              isChronological ? "planner.guide.orderTextChrono" : "planner.guide.orderText",
              names,
            )}
          </p>
        </div>
        {showAlternate && (
          <div>
            <h3>{t("planner.guide.alternateTerm")}</h3>
            <p>{rich("planner.guide.alternateText", names)}</p>
          </div>
        )}
      </div>
    </details>
  );
}
