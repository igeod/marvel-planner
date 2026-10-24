import { Check } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "../../../../components/ui/Button";
import { useI18n } from "../../../../i18n/useI18n";
import { MEDIA_TYPE_KEYS } from "../../data/labels";
import type { PhaseNumber, Title } from "../../types";
import { useTitleDetails } from "../../hooks/useTitleDetails";
import { backdropUrl, formatRelease } from "../../utils/format";
import { TitleDetailsDialog } from "../TitleDetailsDialog";

interface NextToWatchProps {
  title: Title | null;
  phase: PhaseNumber | null;
  isHiddenByFilters: boolean;
  onMarkWatched: (id: string) => void;
}

function Backdrop({ titleId }: { titleId: string }) {
  const state = useTitleDetails(titleId);

  if (state.status !== "ready" || !state.details.backdropPath) return null;
  return (
    <img className="next-card__backdrop" src={backdropUrl(state.details.backdropPath)} alt="" />
  );
}

const MEDIUM_TITLE_LENGTH = 18;
const LONG_TITLE_LENGTH = 30;

function titleSizeClass(name: string): string {
  if (name.length > LONG_TITLE_LENGTH) return " next-card__title--small";
  if (name.length > MEDIUM_TITLE_LENGTH) return " next-card__title--medium";
  return "";
}

export function NextToWatch({ title, phase, isHiddenByFilters, onMarkWatched }: NextToWatchProps) {
  const i18n = useI18n();
  const { t } = i18n;
  const headingId = useId();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <section className="next-card card" aria-labelledby={headingId}>
      {title && <Backdrop titleId={title.id} />}
      <h2 id={headingId} className="section-title">
        {t("planner.next.heading")}
      </h2>
      {title ? (
        <>
          <div key={title.id} className="next-card__swap">
            <p className={`next-card__title${titleSizeClass(title.name)}`} lang="en">
              {title.name}
            </p>
            <p className="next-card__meta">
              {[
                t(MEDIA_TYPE_KEYS[title.type]),
                formatRelease(title.release, i18n),
                phase && t(`catalog.phases.${phase}`),
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
            {isHiddenByFilters && (
              <p className="next-card__note">{t("planner.next.hiddenByFilters")}</p>
            )}
          </div>
          <div className="next-card__actions">
            <Button
              variant="accent"
              size="lg"
              icon={<Check aria-hidden />}
              onClick={() => onMarkWatched(title.id)}
            >
              {t("planner.next.markWatched")}
            </Button>
            <Button variant="text" aria-haspopup="dialog" onClick={() => setIsDetailsOpen(true)}>
              {t("planner.next.details")}
            </Button>
          </div>
          <TitleDetailsDialog
            isOpen={isDetailsOpen}
            titleId={title.id}
            titleName={title.name}
            onClose={() => setIsDetailsOpen(false)}
          />
        </>
      ) : (
        <p className="next-card__meta">{t("planner.next.allDone")}</p>
      )}
    </section>
  );
}
