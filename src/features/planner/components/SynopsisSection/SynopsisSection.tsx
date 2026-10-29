import { useId } from "react";
import { useI18n } from "../../../../i18n/useI18n";

interface SynopsisSectionProps {
  synopsis: string;
}

export function SynopsisSection({ synopsis }: SynopsisSectionProps) {
  const { t } = useI18n();
  const headingId = useId();

  return (
    <section className="synopsis" aria-labelledby={headingId}>
      <h2 id={headingId} className="visually-hidden">
        {t("details.synopsis")}
      </h2>
      <p>{synopsis || t("details.noSynopsis")}</p>
    </section>
  );
}
