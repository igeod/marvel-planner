import { MessageSquarePlus } from "lucide-react";
import { Tooltip } from "../../../../components/ui/Tooltip/Tooltip";
import { useI18n } from "../../../../i18n/useI18n";
import { SECTION_KEYS } from "../../sectionKeys";
import type { SuggestTarget } from "../../context/SuggestContext";
import { useSuggest } from "../../hooks/useSuggest";

interface SuggestButtonProps {
  target: SuggestTarget;
  // icon: next to one line of a list. text: at the end of a section.
  variant: "icon" | "text";
}

// "Suggest a correction". The name says what it is about: the line, or the section.
export function SuggestButton({ target, variant }: SuggestButtonProps) {
  const { t } = useI18n();
  const { open } = useSuggest();
  const label = t("suggest.label", { item: target.item ?? t(SECTION_KEYS[target.section]) });

  if (variant === "text") {
    return (
      <button
        type="button"
        className="btn btn--text"
        aria-label={label}
        onClick={() => open(target)}
      >
        <MessageSquarePlus aria-hidden />
        {t("suggest.button")}
      </button>
    );
  }

  // The name already says what it is; the tooltip names the icon for the pointer and the keyboard.
  return (
    <Tooltip content={t("suggest.title")}>
      {() => (
        <button
          type="button"
          className="spoiler-item__source"
          aria-label={label}
          onClick={() => open(target)}
        >
          <MessageSquarePlus aria-hidden />
        </button>
      )}
    </Tooltip>
  );
}
