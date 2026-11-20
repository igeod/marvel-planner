import { Mail } from "lucide-react";
import { SITE } from "../../app/site";
import { buttonClass } from "../../components/ui/Button/buttonClass";
import { BackToTop } from "../../features/planner/components/BackToTop/BackToTop";
import type { TranslationKey } from "../../i18n/types";
import { useI18n } from "../../i18n/useI18n";
import { usePageTitle } from "../../i18n/usePageTitle";

const USE_ITEMS: { heading: TranslationKey; body: TranslationKey }[] = [
  { heading: "a11y.vision.heading", body: "a11y.vision.body" },
  { heading: "a11y.hearing.heading", body: "a11y.hearing.body" },
  { heading: "a11y.motion.heading", body: "a11y.motion.body" },
  { heading: "a11y.keyboard.heading", body: "a11y.keyboard.body" },
];

const LIMIT_KEYS: TranslationKey[] = [
  "a11y.limits.contrast",
  "a11y.limits.title",
  "a11y.limits.screenReader",
];

// What the site does for people who see, hear or move differently, and what is still missing.
export function AccessibilityPage() {
  usePageTitle("a11y.title");
  const { t, formatDate } = useI18n();

  return (
    <>
      <article className="text-page" aria-labelledby="a11y-title">
        <header className="text-head">
          <p className="text-head__kicker muted">{t("footer.legal")}</p>
          <h1 id="a11y-title">{t("a11y.title")}</h1>
          <p className="text-head__meta muted">
            {t("privacy.updated", { date: formatDate(SITE.a11yCheckedAt) })}
          </p>
          <p className="text-head__intro">{t("a11y.intro")}</p>
        </header>
        <div className="text-page__body">
          <section className="card text-section" aria-labelledby="h-conformance">
            <h2 id="h-conformance">
              <span className="text-section__n" aria-hidden="true">
                1
              </span>
              {t("a11y.conformance.heading")}
            </h2>
            <dl className="text-page__facts">
              <div>
                <dt>{t("a11y.conformance.standardLabel")}</dt>
                <dd>{t("a11y.conformance.standard")}</dd>
              </div>
              <div>
                <dt>{t("a11y.conformance.statusLabel")}</dt>
                <dd>{t("a11y.conformance.status")}</dd>
              </div>
              <div>
                <dt>{t("a11y.conformance.checkedLabel")}</dt>
                <dd>{formatDate(SITE.a11yCheckedAt)}</dd>
              </div>
              <div>
                <dt>{t("a11y.conformance.howLabel")}</dt>
                <dd>{t("a11y.conformance.how")}</dd>
              </div>
            </dl>
          </section>

          <section className="card text-section" aria-labelledby="h-use">
            <h2 id="h-use">
              <span className="text-section__n" aria-hidden="true">
                2
              </span>
              {t("a11y.use.heading")}
            </h2>
            <ul>
              {USE_ITEMS.map((item) => (
                <li key={item.heading}>
                  <strong>{t(item.heading)}</strong>: {t(item.body)}
                </li>
              ))}
            </ul>
          </section>

          <section className="card text-section" aria-labelledby="h-limits">
            <h2 id="h-limits">
              <span className="text-section__n" aria-hidden="true">
                3
              </span>
              {t("a11y.limits.heading")}
            </h2>
            <ul>
              {LIMIT_KEYS.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          </section>

          <section className="text-ticket" aria-labelledby="h-report">
            <h2 id="h-report">
              <span className="text-section__n text-section__n--ink" aria-hidden="true">
                4
              </span>
              {t("a11y.report.heading")}
            </h2>
            <p>{t("a11y.report.body")}</p>
            <a className={buttonClass("ink", "lg")} href={`mailto:${SITE.contactEmail}`}>
              <Mail aria-hidden />
              {SITE.contactEmail}
            </a>
          </section>
        </div>
      </article>
      <BackToTop />
    </>
  );
}
