import { CircleHelp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HEADER_HELP_SLOT_ID } from "../../../../app/dom";
import { Button } from "../../../../components/ui/Button/Button";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { useI18n } from "../../../../i18n/useI18n";
import { STORAGE_KEYS } from "../../../../lib/storageKeys";
import { usePersistentState } from "../../../../lib/usePersistentState";

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

interface GuideHelpProps {
  // The invitation waits for the page to be drawn.
  isReady: boolean;
  isChronological: boolean;
  showAlternate: boolean;
}

// The "?" in the header opens the guide (it is mounted there through a portal, only while the planner is on screen). On a first visit (signed in or not) a small invitation
// appears next to it, once: it asks nothing, goes away at the first interaction, and does not return.
export function GuideHelp({ isReady, isChronological, showAlternate }: GuideHelpProps) {
  const { t, rich } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isSeen, setIsSeen] = usePersistentState(STORAGE_KEYS.guideSeen, false, isBoolean);
  const calloutRef = useRef<HTMLDivElement>(null);
  const isCalloutShown = isReady && !isSeen && !isOpen;

  useEffect(() => {
    if (!isCalloutShown) return;
    const dismiss = (event: Event) => {
      if (calloutRef.current?.contains(event.target as Node)) return;
      setIsSeen(true);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", dismiss);
    window.addEventListener("scroll", dismiss, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", dismiss);
      window.removeEventListener("scroll", dismiss);
    };
  }, [isCalloutShown, setIsSeen]);

  // Names of tabs and filters come from their own keys, so the text stays right if a label changes.
  const names = {
    chrono: <strong>{t("planner.order.chronological")}</strong>,
    tag: <strong>{t("planner.tags.alternate")}</strong>,
    filter: <strong>{t("planner.filters.showAlternate")}</strong>,
  };

  const slot = document.getElementById(HEADER_HELP_SLOT_ID);
  if (!slot) return null;

  return createPortal(
    <div className="guide-help">
      <button
        type="button"
        className="btn btn--panel btn--icon"
        aria-label={t("planner.guide.help")}
        aria-haspopup="dialog"
        onClick={() => {
          setIsSeen(true);
          setIsOpen(true);
        }}
      >
        <CircleHelp aria-hidden />
      </button>

      {isCalloutShown && (
        <div className="guide-help__callout" role="status" ref={calloutRef}>
          <p>{t("planner.guide.callout")}</p>
          <div className="guide-help__actions">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsSeen(true);
                setIsOpen(true);
              }}
            >
              {t("planner.guide.calloutOpen")}
            </Button>
            <Button variant="text" size="sm" onClick={() => setIsSeen(true)}>
              {t("planner.guide.calloutDismiss")}
            </Button>
          </div>
        </div>
      )}

      <Modal isOpen={isOpen} title={t("planner.guide.title")} onClose={() => setIsOpen(false)}>
        <div className="guide-help__items">
          <div>
            <h3>{t("planner.guide.startTerm")}</h3>
            <p>{t("planner.guide.startText")}</p>
          </div>
          {!isChronological && (
            <div>
              <h3>{t("planner.guide.orderTerm")}</h3>
              <p>{rich("planner.guide.orderText", names)}</p>
            </div>
          )}
          {showAlternate && (
            <div>
              <h3>{t("planner.guide.alternateTerm")}</h3>
              <p>{rich("planner.guide.alternateText", names)}</p>
            </div>
          )}
        </div>
      </Modal>
    </div>,
    slot,
  );
}
