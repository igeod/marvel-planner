import { Share2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../../../../components/ui/Button/Button";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Switch } from "../../../../components/ui/Switch/Switch";
import { useI18n } from "../../../../i18n/useI18n";
import { playCelebrationSound } from "../../../../lib/celebrationSound";
import { STORAGE_KEYS } from "../../../../lib/storageKeys";
import { usePersistentState } from "../../../../lib/usePersistentState";

const PIECES = 28;
const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

// Confetti: positions and timings come from the stylesheet (no random, no inline style), falling from
// the top of the popup.
// They never take focus or clicks, and under reduced motion they are not drawn at all.
function Confetti() {
  return (
    <div className="completion__confetti" aria-hidden>
      {Array.from({ length: PIECES }, (_, index) => (
        <span key={index} className={`completion__piece completion__piece--${index % 3}`} />
      ))}
    </div>
  );
}

interface CompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
}

// Shown once, when every title is watched. The sound is off until the person turns it on.
export function CompletionDialog({ isOpen, onClose, onShare }: CompletionDialogProps) {
  const { t } = useI18n();
  const [isSoundOn, setIsSoundOn] = usePersistentState(STORAGE_KEYS.sound, false, isBoolean);

  // A person who turned the sound on earlier hears it once when the popup opens.
  useEffect(() => {
    if (isOpen && isSoundOn) playCelebrationSound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} title={t("planner.completion.title")} onClose={onClose}>
      <div className="completion">
        {isOpen && <Confetti />}
        <p className="completion__chip">100%</p>
        <p>{t("planner.completion.line")}</p>
        <Button
          variant="primary"
          size="lg"
          icon={<Share2 aria-hidden />}
          onClick={() => {
            onClose();
            onShare();
          }}
        >
          {t("planner.completion.share")}
        </Button>
        <div className="completion__sound">
          <Switch
            label={t("planner.completion.sound")}
            checked={isSoundOn}
            onChange={(checked) => {
              setIsSoundOn(checked);
              if (checked) playCelebrationSound();
            }}
          />
          <p className="muted">{t("planner.completion.soundHint")}</p>
        </div>
      </div>
    </Modal>
  );
}
