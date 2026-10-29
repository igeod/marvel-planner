import { ArrowLeft, ImageOff, VideoOff } from "lucide-react";
import { useId } from "react";
import { useI18n } from "../../../../i18n/useI18n";
import { getEasterEggs } from "../../data/easterEggs";
import { getKeyScenes } from "../../data/keyScenes";
import { getPostCredits } from "../../data/postCredits";
import { backdropUrl } from "../../utils/format";
import { EasterEggs } from "../EasterEggs";
import { KeyScenes } from "../KeyScenes";
import { MissingNote } from "../MissingNote";
import { PlotSection } from "../PlotSection";
import { PostCreditsInfo } from "../PostCreditsInfo";
import { TitleDetailsSkeleton } from "../TitleDetailsSkeleton";
import { SynopsisSection } from "../SynopsisSection";
import { TrailerButton } from "../TrailerButton";
import { WhereToWatch } from "../WhereToWatch";
import { WithTitleDetails } from "../WithTitleDetails";

interface TitleDetailsPanelProps {
  titleId: string;
  onBack: () => void;
}

export function TitleDetailsPanel({ titleId, onBack }: TitleDetailsPanelProps) {
  const { t, formatDate } = useI18n();
  const titleHeadingId = useId();
  const creditHeadingId = useId();
  const castHeadingId = useId();
  const spoilerHeadingId = useId();

  return (
    <div className="film">
      <div className="film__bar">
        <button type="button" className="film__back" onClick={onBack}>
          <ArrowLeft aria-hidden />
          {t("details.back")}
        </button>
      </div>

      <WithTitleDetails titleId={titleId} skeleton={<TitleDetailsSkeleton />}>
        {(details) => {
          const credit =
            details.creators.length && !details.directors.length
              ? { label: t("details.creator"), names: details.creators }
              : { label: t("details.director"), names: details.directors };
          const hasSpoilers =
            details.plot !== null ||
            details.episodes.length > 0 ||
            getPostCredits(titleId) !== null ||
            getEasterEggs(titleId).length > 0 ||
            getKeyScenes(titleId).length > 0;

          return (
            <div className="film__main">
              <section className="film__card" aria-labelledby={titleHeadingId}>
                <div className="film__hero">
                  <div className="film__cover" aria-hidden="true">
                    {details.backdropPath && <img src={backdropUrl(details.backdropPath)} alt="" />}
                  </div>
                  {!details.backdropPath && (
                    <div className="film__cover-missing">
                      <MissingNote tone="dark" icon={ImageOff}>
                        {t("details.missing.cover")}
                      </MissingNote>
                    </div>
                  )}
                  <div className="film__hero-inner">
                    <div className="film__heading">
                      <h1 id={titleHeadingId} lang="en">
                        {details.name}
                      </h1>
                      {details.originalName !== details.name && (
                        <p lang="en">
                          {t("details.originalTitle", { name: details.originalName })}
                        </p>
                      )}
                      <div className="film__meta">
                        {details.releaseDate && <span>{formatDate(details.releaseDate)}</span>}
                        {details.runtime && (
                          <span>{t("details.minutes", { count: details.runtime })}</span>
                        )}
                        {!details.releaseDate && !details.runtime && (
                          <span className="film__meta-missing">{t("details.missing.meta")}</span>
                        )}
                      </div>
                    </div>
                    <div className="film__glass on-panel">
                      {details.trailer ? (
                        <TrailerButton trailer={details.trailer} titleName={details.name} />
                      ) : (
                        <MissingNote tone="dark" icon={VideoOff}>
                          {t("details.missing.trailer")}
                        </MissingNote>
                      )}
                      <WhereToWatch titleId={titleId} />
                    </div>
                  </div>
                </div>

                <div className="film__body">
                  <div className="film__story">
                    <SynopsisSection synopsis={details.synopsis} />
                    <section className="film__credit" aria-labelledby={creditHeadingId}>
                      <h2 id={creditHeadingId}>{credit.label}</h2>
                      {credit.names.length > 0 ? (
                        <p>{credit.names.join(", ")}</p>
                      ) : (
                        <p className="muted">{t("details.missing.director")}</p>
                      )}
                    </section>
                  </div>
                  <section className="film__cast" aria-labelledby={castHeadingId}>
                    <h2 id={castHeadingId}>{t("details.cast")}</h2>
                    {details.cast.length === 0 ? (
                      <p className="muted">{t("details.missing.cast")}</p>
                    ) : (
                      <ul>
                        {details.cast.map((member) => (
                          <li key={`${member.name}-${member.character}`}>
                            <span>{member.name}</span>
                            {member.character && <small>{member.character}</small>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </div>
              </section>

              <section className="spoiler-zone" aria-labelledby={spoilerHeadingId}>
                <div className="spoiler-zone__stripes" aria-hidden="true" />
                <div className="spoiler-zone__inner">
                  <h2 id={spoilerHeadingId}>{t("details.spoilerZone")}</h2>
                  {hasSpoilers ? (
                    <>
                      <div className="spoiler-zone__grid">
                        <PlotSection details={details} />
                        <div className="spoiler-zone__side">
                          <PostCreditsInfo titleId={titleId} />
                          <EasterEggs titleId={titleId} />
                        </div>
                      </div>
                      <KeyScenes titleId={titleId} />
                    </>
                  ) : (
                    <MissingNote tone="dark">{t("details.missing.spoilers")}</MissingNote>
                  )}
                </div>
              </section>
            </div>
          );
        }}
      </WithTitleDetails>
    </div>
  );
}
