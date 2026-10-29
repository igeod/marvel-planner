import { Info } from "lucide-react";
import { MissingNote } from "../MissingNote";
import { SpoilerBox } from "../../../../components/ui/SpoilerBox";
import { Tooltip } from "../../../../components/ui/Tooltip";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import { getEasterEggs, type EasterEggKind } from "../../data/easterEggs";

const KIND_KEYS: Record<EasterEggKind, TranslationKey> = {
  stanLee: "details.easterEggs.stanLee",
};

interface EasterEggsProps {
  titleId: string;
}

export function EasterEggs({ titleId }: EasterEggsProps) {
  const { t, language } = useI18n();
  const eggs = getEasterEggs(titleId);

  if (eggs.length === 0) {
    return (
      <SpoilerBox
        className="spoiler-box--eggs"
        title={t("details.easterEggs.heading")}
        intro={<MissingNote tone="dark">{t("details.missing.eggs")}</MissingNote>}
      />
    );
  }

  return (
    <SpoilerBox
      className="spoiler-box--eggs"
      title={t("details.easterEggs.heading")}
      spoiler={{
        showLabel: t("details.easterEggs.show"),
        hideLabel: t("details.easterEggs.hide"),
        warning: t("details.easterEggs.warning"),
      }}
    >
      <ul className="spoiler-list">
        {eggs.map((egg) => (
          <li key={`${egg.kind}-${egg.description.en}`} className="spoiler-item">
            <span>
              <strong>{t(KIND_KEYS[egg.kind])}:</strong> {egg.description[language]}
            </span>
            <Tooltip content={t("details.easterEggs.source")}>
              {(describedBy) => (
                <a
                  className="spoiler-item__source"
                  href={egg.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("details.easterEggs.source")}
                  aria-describedby={describedBy}
                >
                  <Info data-tooltip-anchor aria-hidden />
                </a>
              )}
            </Tooltip>
          </li>
        ))}
      </ul>
    </SpoilerBox>
  );
}
