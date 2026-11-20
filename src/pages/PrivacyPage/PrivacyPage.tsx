import type { ReactNode } from "react";
import { SITE } from "../../app/site";
import { useAuthDialog } from "../../features/auth/hooks/useAuthDialog";
import { BackToTop } from "../../features/planner/components/BackToTop/BackToTop";
import { usePrivacySettings } from "../../features/privacy/hooks/usePrivacySettings";
import type { TranslationKey } from "../../i18n/types";
import { useI18n } from "../../i18n/useI18n";
import { usePageTitle } from "../../i18n/usePageTitle";

const GARANTE_URL = "https://www.garanteprivacy.it";

const DATA_ITEMS: { label: TranslationKey; text: TranslationKey }[] = [
  { label: "privacy.data.accountLabel", text: "privacy.data.accountText" },
  { label: "privacy.data.progressLabel", text: "privacy.data.progressText" },
  { label: "privacy.data.technicalLabel", text: "privacy.data.technicalText" },
  { label: "privacy.data.deviceLabel", text: "privacy.data.deviceText" },
  { label: "privacy.data.shareLabel", text: "privacy.data.shareText" },
  { label: "privacy.data.suggestionsLabel", text: "privacy.data.suggestionsText" },
];

const PURPOSE_KEYS: TranslationKey[] = [
  "privacy.purposes.service",
  "privacy.purposes.security",
  "privacy.purposes.suggestions",
];

export function PrivacyPage() {
  usePageTitle("privacy.title");
  const { t, rich, formatDate } = useI18n();
  const { open } = useAuthDialog();
  const { open: openPrivacySettings } = usePrivacySettings();
  const email = <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>;
  const settingsLink = (
    <button type="button" className="link-button" onClick={openPrivacySettings}>
      {t("footer.privacySettings")}
    </button>
  );

  // The anchors (/privacy#h-rights) point at the headings.
  const sections: { id: string; heading: TranslationKey; body: ReactNode }[] = [
    {
      id: "controller",
      heading: "privacy.controller.heading",
      body: <p>{rich("privacy.controller.body", { email }, { name: SITE.name })}</p>,
    },
    {
      id: "data",
      heading: "privacy.data.heading",
      body: (
        <ul>
          {DATA_ITEMS.map((item) => (
            <li key={item.label}>
              <strong>{t(item.label)}</strong>: {rich(item.text, { link: settingsLink })}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "purposes",
      heading: "privacy.purposes.heading",
      body: (
        <>
          <ul>
            {PURPOSE_KEYS.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
          <p>{t("privacy.purposes.noProfiling")}</p>
        </>
      ),
    },
    {
      id: "cookies",
      heading: "privacy.cookies.heading",
      body: <p>{rich("privacy.cookies.body", { link: settingsLink })}</p>,
    },
    {
      id: "providers",
      heading: "privacy.providers.heading",
      body: <p>{t("privacy.providers.body")}</p>,
    },
    {
      id: "retention",
      heading: "privacy.retention.heading",
      body: <p>{t("privacy.retention.body")}</p>,
    },
    {
      id: "rights",
      heading: "privacy.rights.heading",
      body: (
        <p>
          {rich("privacy.rights.body", {
            email,
            account: (
              <button type="button" className="link-button" onClick={() => open("account")}>
                {t("privacy.rights.accountLink")}
              </button>
            ),
            garante: (
              <a href={GARANTE_URL} rel="noreferrer">
                garanteprivacy.it
              </a>
            ),
          })}
        </p>
      ),
    },
    {
      id: "other",
      heading: "privacy.other.heading",
      body: <p>{rich("privacy.other.body", { email })}</p>,
    },
    {
      id: "minors",
      heading: "privacy.minors.heading",
      body: <p>{rich("privacy.minors.body", { email })}</p>,
    },
    {
      id: "changes",
      heading: "privacy.changes.heading",
      body: <p>{rich("privacy.changes.body", { email })}</p>,
    },
  ];

  return (
    <>
      <article className="text-page" aria-labelledby="privacy-title">
        <header className="text-head">
          <p className="text-head__kicker muted">{t("footer.legal")}</p>
          <h1 id="privacy-title">{t("privacy.title")}</h1>
          <p className="text-head__meta muted">
            {t("privacy.updated", { date: formatDate(SITE.privacyLastUpdated) })}
          </p>
        </header>
        <div className="text-page__body">
          {sections.map((section, index) => (
            <section
              key={section.id}
              className="card text-section"
              aria-labelledby={`h-${section.id}`}
            >
              <h2 id={`h-${section.id}`}>
                <span className="text-section__n" aria-hidden="true">
                  {index + 1}
                </span>
                {t(section.heading)}
              </h2>
              {section.body}
            </section>
          ))}
        </div>
      </article>
      <BackToTop />
    </>
  );
}
