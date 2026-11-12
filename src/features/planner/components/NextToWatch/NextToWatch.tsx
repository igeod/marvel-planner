import { Check, Maximize2 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { titlePath } from "../../../../app/paths";
import { Button } from "../../../../components/ui/Button/Button";
import { ButtonLink } from "../../../../components/ui/Button/ButtonLink";
import { useI18n } from "../../../../i18n/useI18n";
import { MEDIA_TYPE_KEYS } from "../../data/labels";
import type { PhaseNumber, Title } from "../../types";
import { useTitleDetails } from "../../hooks/useTitleDetails";
import { backdropUrl, formatRelease } from "../../utils/format";

interface NextToWatchProps {
  title: Title | null;
  phase: PhaseNumber | null;
  // The card stays on screen while the watched list loads; only its content waits.
  isLoading: boolean;
  isHiddenByFilters: boolean;
  onMarkWatched: (id: string) => void;
}

// How long the new cover fades in over the old one (--dur-enter) before the old one is dropped.
const COVER_SWAP_MS = 300;

function BackdropImage({ src, onLoaded }: { src: string; onLoaded: () => void }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const markLoaded = () => {
    setIsLoaded(true);
    onLoaded();
  };

  return (
    <img
      className="next-card__backdrop"
      data-loaded={isLoaded || undefined}
      src={src}
      alt=""
      ref={(img) => {
        if (img?.complete && !isLoaded) markLoaded();
      }}
      onLoad={markLoaded}
    />
  );
}

// The card never unmounts: when the next title changes, the old cover stays until the new one is
// ready and fades in over it, so there is never an empty frame.
function Backdrop({ titleId }: { titleId: string }) {
  const state = useTitleDetails(titleId);
  const next =
    state.status === "ready" && state.details.backdropPath
      ? backdropUrl(state.details.backdropPath)
      : null;
  const [shown, setShown] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded) return;
    const timer = window.setTimeout(() => setShown(loaded), COVER_SWAP_MS);
    return () => window.clearTimeout(timer);
  }, [loaded]);

  return (
    <>
      {shown && shown !== next && (
        <img className="next-card__backdrop" data-loaded src={shown} alt="" />
      )}
      {/* Keyed by source so a new cover fades in on its own instead of popping. */}
      {next && <BackdropImage key={next} src={next} onLoaded={() => setLoaded(next)} />}
    </>
  );
}

const MEDIUM_TITLE_LENGTH = 18;
const LONG_TITLE_LENGTH = 30;

function titleSizeClass(name: string): string {
  if (name.length > LONG_TITLE_LENGTH) return " next-card__title--small";
  if (name.length > MEDIUM_TITLE_LENGTH) return " next-card__title--medium";
  return "";
}

export function NextToWatch({
  title,
  phase,
  isLoading,
  isHiddenByFilters,
  onMarkWatched,
}: NextToWatchProps) {
  const i18n = useI18n();
  const { t } = i18n;
  const headingId = useId();

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
            <ButtonLink to={titlePath(title.id)} variant="text" iconEnd={<Maximize2 aria-hidden />}>
              {t("planner.next.details")}
            </ButtonLink>
          </div>
        </>
      ) : isLoading ? (
        <div className="next-card__loading skeleton" aria-hidden="true" />
      ) : (
        <p className="next-card__meta">{t("planner.next.allDone")}</p>
      )}
    </section>
  );
}
