import { GitBranch } from "lucide-react";
import { InfoTip } from "../../../../components/ui/InfoTip/InfoTip";
import { useI18n } from "../../../../i18n/useI18n";
import type { Title } from "../../types";

interface TitleTagsProps {
  title: Title;
  // Film page only: a short explanation next to "Alternate continuity". Not in a list row, where the
  // tag sits inside a <summary> and a nested control does not belong.
  withHint?: boolean;
  className?: string;
}

// The label that sets a title apart from the main story: alternate continuity.
// Rendered as nothing when the title is in the main one. (Not yet out is said in words, not here.)
export function TitleTags({ title, withHint = false, className }: TitleTagsProps) {
  const { t } = useI18n();
  const isAlternate = title.continuity === "alternate";
  if (!isAlternate) return null;

  return (
    <span className={className ? `title-tags ${className}` : "title-tags"}>
      <span className="title-tag">
        <GitBranch aria-hidden />
        {t("planner.tags.alternate")}
      </span>
      {withHint && (
        <InfoTip label={t("planner.tags.alternate")}>{t("planner.tags.alternateHint")}</InfoTip>
      )}
    </span>
  );
}
