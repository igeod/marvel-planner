import { ExternalLink, Globe } from "lucide-react";
import { useId, useState } from "react";
import type { WatchOptions } from "../../../../../shared/watchProviders";
import { InfoTip } from "../../../../components/ui/InfoTip";
import { SelectField } from "../../../../components/ui/SelectField";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import { DEFAULT_REGIONS } from "../../data/regions";
import { useWatchProviders } from "../../hooks/useWatchProviders";

const CATEGORIES: { key: Exclude<keyof WatchOptions, "link">; labelKey: TranslationKey }[] = [
  { key: "stream", labelKey: "details.watch.stream" },
  { key: "free", labelKey: "details.watch.free" },
  { key: "rent", labelKey: "details.watch.rent" },
  { key: "buy", labelKey: "details.watch.buy" },
];

interface WhereToWatchProps {
  titleId: string;
}

export function WhereToWatch({ titleId }: WhereToWatchProps) {
  const { t, language } = useI18n();
  const state = useWatchProviders(titleId);
  const [chosenRegion, setChosenRegion] = useState<string | null>(null);
  const headingId = useId();

  const regionNames = new Intl.DisplayNames([language], { type: "region" });
  const regionName = (code: string) => regionNames.of(code) ?? code;

  const renderBody = () => {
    if (state.status === "loading") return <p role="status">{t("details.watch.loading")}</p>;

    if (state.status === "error") {
      return (
        <div role="alert">
          <p>{t("details.watch.error")}</p>
          <button type="button" className="btn btn--panel" onClick={state.retry}>
            {t("common.retry")}
          </button>
        </div>
      );
    }

    const region = chosenRegion ?? DEFAULT_REGIONS[language];
    const options = Object.hasOwn(state.providers, region) ? state.providers[region] : undefined;
    const regions = [...new Set([...Object.keys(state.providers), region])].sort((a, b) =>
      regionName(a).localeCompare(regionName(b), language),
    );

    return (
      <>
        <div className="where-to-watch__head">
          <div className="where-to-watch__title">
            <h2 id={headingId}>{t("details.watch.heading")}</h2>
            <InfoTip label={t("details.watch.attribution")}>
              {t("details.watch.attribution")} JustWatch. {t("details.watch.disclaimer")}
            </InfoTip>
          </div>
          <SelectField
            label={t("details.watch.region")}
            value={region}
            options={regions.map((code) => ({ value: code, label: regionName(code) }))}
            icon={<Globe aria-hidden />}
            onChange={setChosenRegion}
          />
        </div>

        {options ? (
          <>
            {CATEGORIES.filter(({ key }) => options[key].length > 0).map(({ key, labelKey }) => (
              <section key={key} className="where-to-watch__group" aria-label={t(labelKey)}>
                <h3>{t(labelKey)}</h3>
                <ul className="where-to-watch__list">
                  {options[key].map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </section>
            ))}
            <a
              className="where-to-watch__all"
              href={options.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("details.watch.all")}
              <ExternalLink aria-hidden />
            </a>
          </>
        ) : (
          <p className="where-to-watch__none">
            {t("details.watch.none", { country: regionName(region) })}
          </p>
        )}
      </>
    );
  };

  return (
    <section className="where-to-watch" aria-labelledby={headingId}>
      {state.status === "ready" ? null : (
        <h2 id={headingId} className="visually-hidden">
          {t("details.watch.heading")}
        </h2>
      )}
      {renderBody()}
    </section>
  );
}
