import type { TranslationKey } from "../../i18n/types";
import { useI18n } from "../../i18n/useI18n";
import { usePageTitle } from "../../i18n/usePageTitle";

const SECTIONS: { heading: TranslationKey; body: TranslationKey }[] = [
  { heading: "a11y.vision.heading", body: "a11y.vision.body" },
  { heading: "a11y.hearing.heading", body: "a11y.hearing.body" },
  { heading: "a11y.motion.heading", body: "a11y.motion.body" },
  { heading: "a11y.keyboard.heading", body: "a11y.keyboard.body" },
  { heading: "a11y.missing.heading", body: "a11y.missing.body" },
];

// What the site does for people who see, hear or move differently, and what is still missing.
export function AccessibilityPage() {
  usePageTitle("a11y.title");
  const { t } = useI18n();

  return (
    <article className="accessibility-page" aria-labelledby="a11y-title">
      <h1 id="a11y-title">{t("a11y.title")}</h1>
      <p>{t("a11y.intro")}</p>
      {SECTIONS.map((section) => (
        <section key={section.heading}>
          <h2>{t(section.heading)}</h2>
          <p>{t(section.body)}</p>
        </section>
      ))}
    </article>
  );
}
