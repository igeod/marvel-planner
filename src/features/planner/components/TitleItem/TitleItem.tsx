import { Check, Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../../components/ui/Button";
import { Chevron } from "../../../../components/ui/Chevron";
import { useI18n } from "../../../../i18n/useI18n";
import { MEDIA_TYPE_KEYS, NOTE_KEYS } from "../../data/labels";
import type { Title } from "../../types";
import { formatRelease } from "../../utils/format";
import { BeforeYouWatch } from "../BeforeYouWatch";
import { MarkWatchedButton } from "../MarkWatchedButton";
import { PosterThumb } from "../PosterThumb";
import { TitleDetailsDialog } from "../TitleDetailsDialog";
import { TitleSummaryPanel } from "../TitleSummaryPanel";

const OPEN_ANIMATION_MS = 220;

interface TitleItemProps {
  title: Title;
  isWatched: boolean;
  watched: ReadonlySet<string>;
  onToggle: (id: string) => void;
}

export function TitleItem({ title, isWatched, watched, onToggle }: TitleItemProps) {
  const i18n = useI18n();
  const { t } = i18n;
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const rowRef = useRef<HTMLLIElement>(null);

  // Scrolls only when the open panel's bottom falls below the viewport, once the open animation ends.
  useEffect(() => {
    if (!isOpen) return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(
      () => rowRef.current?.scrollIntoView({ block: "nearest" }),
      isReduced ? 0 : OPEN_ANIMATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const meta = [
    t(MEDIA_TYPE_KEYS[title.type]),
    formatRelease(title.release, i18n),
    title.note && t(NOTE_KEYS[title.note]),
    title.continuity === "alternate" && t("planner.tags.alternate"),
    title.status === "upcoming" && t("planner.tags.upcoming"),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <li ref={rowRef} className={`title-row${isOpen ? " title-row--open" : ""}`}>
      <label className="title-row__check">
        <input
          type="checkbox"
          checked={isWatched}
          aria-label={t("planner.markWatched", { name: title.name })}
          onChange={() => onToggle(title.id)}
        />
        <span className="title-row__box" aria-hidden="true">
          <Check />
        </span>
      </label>

      <PosterThumb titleId={title.id} isLarge={isOpen} />

      <details
        className="title-row__details"
        onToggle={(event) => {
          const open = event.currentTarget.open;
          setIsOpen(open);
          if (open) setHasBeenOpened(true);
        }}
      >
        <summary className="title-row__summary">
          <span className="title-row__heading">
            <span lang="en" className="title-row__name">
              {isWatched ? <s>{title.name}</s> : title.name}
            </span>
            <span className="title-row__meta">{meta}</span>
          </span>
          <Chevron />
        </summary>

        {hasBeenOpened && (
          <div className="title-row__content">
            <MarkWatchedButton isWatched={isWatched} onToggle={() => onToggle(title.id)} />
            <TitleSummaryPanel titleId={title.id} />
            <BeforeYouWatch title={title} watched={watched} />
            <div className="title-row__actions">
              <Button
                variant="primary"
                iconEnd={<Maximize2 aria-hidden />}
                aria-haspopup="dialog"
                onClick={() => setIsDetailsOpen(true)}
              >
                {t("details.open")}
              </Button>
            </div>
          </div>
        )}
      </details>

      <TitleDetailsDialog
        isOpen={isDetailsOpen}
        titleId={title.id}
        titleName={title.name}
        onClose={() => setIsDetailsOpen(false)}
      />
    </li>
  );
}
