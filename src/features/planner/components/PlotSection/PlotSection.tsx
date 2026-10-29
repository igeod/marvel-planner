import { useId, useState } from "react";
import { LANGUAGE_NAMES } from "../../../../../shared/languages";
import type { TitleDetails } from "../../../../../shared/titleDetails";
import { useI18n } from "../../../../i18n/useI18n";
import { MissingNote } from "../MissingNote";
import { Chevron } from "../../../../components/ui/Chevron";
import { SpoilerBox } from "../../../../components/ui/SpoilerBox";

const LICENSE_URL = "https://creativecommons.org/licenses/by-sa/4.0/";

function PlotText({ plot }: { plot: NonNullable<TitleDetails["plot"]> }) {
  const { t, language } = useI18n();

  return (
    <>
      {plot.language !== language && (
        <p>{t("details.plot.fallbackLanguage", { language: LANGUAGE_NAMES[plot.language] })}</p>
      )}
      {plot.text.split("\n\n").map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <p>
        {t("details.plot.sourceBefore")}{" "}
        <a href={plot.sourceUrl} rel="noreferrer">
          {t("details.plot.sourceLink")}
        </a>
        , <a href={LICENSE_URL}>{t("details.plot.license")}</a>
      </p>
    </>
  );
}

// Each planner entry is a single season, so there is no season picker.
function Episodes({
  season,
  isHidden,
}: {
  season: TitleDetails["seasons"][number];
  isHidden: boolean;
}) {
  const tabIndex = isHidden ? -1 : 0;
  const { t } = useI18n();
  const baseId = useId();
  const [openEpisode, setOpenEpisode] = useState<number | null>(null);

  return (
    <ol className="episodes">
      {season.episodes.map((episode) => {
        const isOpen = openEpisode === episode.number;
        const textId = `${baseId}-${episode.number}`;
        return (
          <li key={episode.number} className="episode">
            <button
              type="button"
              className="episode__head"
              tabIndex={tabIndex}
              aria-expanded={isOpen}
              aria-controls={textId}
              onClick={() => setOpenEpisode(isOpen ? null : episode.number)}
            >
              <span className="episode__number">E{episode.number}</span>
              <span className={episode.title.trim() ? "episode__title" : "episode__title is-empty"}>
                {episode.title.trim() || t("details.plot.noEpisodeTitle")}
              </span>
              <Chevron />
            </button>
            {isOpen && (
              <p
                id={textId}
                className={episode.summary ? "episode__text" : "episode__text is-empty"}
              >
                {episode.summary || t("details.plot.noEpisodeSummary")}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

interface PlotSectionProps {
  details: TitleDetails;
}

export function PlotSection({ details }: PlotSectionProps) {
  const { t } = useI18n();
  const hasSeasons = details.seasons.length > 0;
  if (!details.plot && !hasSeasons) {
    return (
      <SpoilerBox
        className="spoiler-box--plot"
        title={t("details.plot.heading")}
        intro={<MissingNote tone="dark">{t("details.missing.plot")}</MissingNote>}
      />
    );
  }

  return (
    <SpoilerBox
      className="spoiler-box--plot"
      title={t("details.plot.heading")}
      spoiler={{
        showLabel: t("details.plot.show"),
        hideLabel: t("details.plot.hide"),
        warning: t("details.plot.warning"),
      }}
    >
      {(isHidden) => (
        <div className="plot">
          {hasSeasons ? (
            <Episodes season={details.seasons[0]} isHidden={isHidden} />
          ) : (
            details.plot && <PlotText plot={details.plot} />
          )}
        </div>
      )}
    </SpoilerBox>
  );
}
