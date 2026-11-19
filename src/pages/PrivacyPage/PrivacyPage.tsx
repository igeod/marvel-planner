import { SITE } from "../../app/site";
import { useAuthDialog } from "../../features/auth/hooks/useAuthDialog";
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

const PLAIN_SECTIONS: { heading: TranslationKey; body: TranslationKey }[] = [
  { heading: "privacy.providers.heading", body: "privacy.providers.body" },
  { heading: "privacy.retention.heading", body: "privacy.retention.body" },
];

const CLOSING_SECTIONS: { heading: TranslationKey; body: TranslationKey }[] = [
  { heading: "privacy.other.heading", body: "privacy.other.body" },
  { heading: "privacy.minors.heading", body: "privacy.minors.body" },
  { heading: "privacy.changes.heading", body: "privacy.changes.body" },
];

export function PrivacyPage() {
  usePageTitle("privacy.title");
  const { t, rich, formatDate } = useI18n();
  const { open } = useAuthDialog();
  const { open: openPrivacySettings } = usePrivacySettings();
  const email = <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>;

  return (
    <article className="privacy-page" aria-labelledby="privacy-title">
      <h1 id="privacy-title">{t("privacy.title")}</h1>
      <p>{t("privacy.updated", { date: formatDate(SITE.privacyLastUpdated) })}</p>

      <section aria-labelledby="privacy-controller">
        <h2 id="privacy-controller">{t("privacy.controller.heading")}</h2>
        <p>{rich("privacy.controller.body", { email }, { name: SITE.name })}</p>
      </section>

      <section aria-labelledby="privacy-data">
        <h2 id="privacy-data">{t("privacy.data.heading")}</h2>
        <ul>
          {DATA_ITEMS.map((item) => (
            <li key={item.label}>
              <strong>{t(item.label)}</strong>: {t(item.text)}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="privacy-purposes">
        <h2 id="privacy-purposes">{t("privacy.purposes.heading")}</h2>
        <ul>
          {PURPOSE_KEYS.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
        <p>{t("privacy.purposes.noProfiling")}</p>
      </section>

      <section aria-labelledby="privacy-cookies">
        <h2 id="privacy-cookies">{t("privacy.cookies.heading")}</h2>
        <p>
          {rich("privacy.cookies.body", {
            link: (
              <button type="button" className="link-button" onClick={openPrivacySettings}>
                {t("privacy.cookies.link")}
              </button>
            ),
          })}
        </p>
      </section>

      {PLAIN_SECTIONS.map((section) => (
        <section key={section.heading} aria-label={t(section.heading)}>
          <h2>{t(section.heading)}</h2>
          <p>{t(section.body)}</p>
        </section>
      ))}

      <section aria-labelledby="privacy-rights">
        <h2 id="privacy-rights">{t("privacy.rights.heading")}</h2>
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
      </section>

      {CLOSING_SECTIONS.map((section) => (
        <section key={section.heading} aria-label={t(section.heading)}>
          <h2>{t(section.heading)}</h2>
          <p>{rich(section.body, { email })}</p>
        </section>
      ))}
    </article>
  );
}
