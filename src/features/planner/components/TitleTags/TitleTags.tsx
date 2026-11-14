import { Clock, GitBranch } from "lucide-react";
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

// The labels that set a title apart from the main story: alternate continuity and not yet out.
// Rendered as nothing when the title has neither.
export function TitleTags({ title, withHint = false, className }: TitleTagsProps) {
  const { t } = useI18n();
  const isAlternate = title.continuity === "alternate";
  const isUpcoming = title.status === "upcoming";
  if (!isAlternate && !isUpcoming) return null;

  return (
    <span className={className ? `title-tags ${className}` : "title-tags"}>
      {isAlternate && (
        <>
          <span className="title-tag">
            <GitBranch aria-hidden />
            {t("planner.tags.alternate")}
          </span>
          {withHint && (
            <InfoTip label={t("planner.tags.alternate")}>{t("planner.tags.alternateHint")}</InfoTip>
          )}
        </>
      )}
      {isUpcoming && (
        <span className="title-tag title-tag--status">
          <Clock aria-hidden />
          {t("planner.tags.upcoming")}
        </span>
      )}
    </span>
  );
}
