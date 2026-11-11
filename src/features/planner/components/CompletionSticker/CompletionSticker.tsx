import { X } from "lucide-react";
import { useI18n } from "../../../../i18n/useI18n";

export function CompletionSticker({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();

  return (
    <div className="completion-sticker" role="status">
      <div>
        <p className="completion-sticker__title">{t("planner.completion.title")}</p>
        <p>{t("planner.completion.line")}</p>
      </div>
      <button
        type="button"
        className="completion-sticker__close"
        aria-label={t("common.close")}
        onClick={onClose}
      >
        <X aria-hidden />
      </button>
    </div>
  );
}
