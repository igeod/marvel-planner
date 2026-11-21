import { Link } from "react-router";
import { FOOTER_ID } from "../../../app/dom";
import { PATHS } from "../../../app/paths";
import { SITE } from "../../../app/site";
import { usePrivacySettings } from "../../../features/privacy/hooks/usePrivacySettings";
import { useI18n } from "../../../i18n/useI18n";
import { Button } from "../../ui/Button/Button";
import { CoffeeLink } from "../CoffeeLink/CoffeeLink";
import tmdbLogo from "./tmdb-logo.svg";

const FONT_LICENSE_URL = "/licenses/fonts-OFL.txt";

export function AppFooter() {
  const { t, rich } = useI18n();
  const { open } = usePrivacySettings();

  return (
    <footer id={FOOTER_ID} className="site-footer on-panel">
      <div className="site-footer__top">
        <div className="site-footer__about">
          <div>
            <p className="wordmark wordmark--large">{SITE.name}</p>
            <p>{t("footer.version", { version: __APP_VERSION__ })}</p>
          </div>
          <p>{t("footer.disclaimer")}</p>
        </div>
        <CoffeeLink />
      </div>
      <div className="site-footer__bottom">
        <div className="site-footer__info">
          <div className="site-footer__tmdb">
            <img className="site-footer__tmdb-logo" src={tmdbLogo} alt="" />
            <p lang="en">
              This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise
              approved by{" "}
              <a href="https://www.themoviedb.org" rel="noreferrer">
                TMDB
              </a>
              .
            </p>
          </div>
          <p>
            {rich("footer.fonts", {
              license: <a href={FONT_LICENSE_URL}>{t("footer.fontsLicense")}</a>,
            })}
          </p>
          {/* Provisional: the owner and an expert still have to confirm the notice and the year. */}
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
        </div>
        <nav className="site-footer__legal" aria-label={t("footer.legal")}>
          <Link to={PATHS.privacy}>{t("footer.privacy")}</Link>
          <Link to={PATHS.accessibility}>{t("footer.accessibility")}</Link>
          <Button variant="text" aria-haspopup="dialog" onClick={open}>
            {t("footer.privacySettings")}
          </Button>
        </nav>
        <span className="site-footer__made" lang="en">
          Made in Italy
        </span>
      </div>
    </footer>
  );
}
