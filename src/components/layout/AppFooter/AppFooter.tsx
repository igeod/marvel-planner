import { ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { FOOTER_ID } from "../../../app/dom";
import { PATHS } from "../../../app/paths";
import { SITE } from "../../../app/site";
import { usePrivacySettings } from "../../../features/privacy/hooks/usePrivacySettings";
import { useI18n } from "../../../i18n/useI18n";
import { Button } from "../../ui/Button";
import { CoffeeLink } from "../CoffeeLink";
import tmdbLogo from "./tmdb-logo.svg";

const FONT_LICENSE_URL = "/licenses/fonts-OFL.txt";

export function AppFooter() {
  const { t, rich } = useI18n();
  const { open } = usePrivacySettings();

  return (
    <footer id={FOOTER_ID} className="site-footer on-panel">
      <div className="site-footer__columns">
        <div className="site-footer__about">
          <p className="wordmark wordmark--large">{SITE.name}</p>
          <p className="muted">{t("footer.disclaimer")}</p>
          <p className="muted">
            {rich("footer.credits", {
              justwatch: (
                <a href="https://www.justwatch.com" rel="noreferrer">
                  JustWatch
                </a>
              ),
              wikipedia: (
                <a href="https://www.wikipedia.org" rel="noreferrer">
                  Wikipedia
                </a>
              ),
              license: (
                <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="noreferrer">
                  {t("footer.creditsLicense")}
                </a>
              ),
            })}
          </p>
          <p className="muted">
            {rich("footer.fonts", {
              license: <a href={FONT_LICENSE_URL}>{t("footer.fontsLicense")}</a>,
            })}
          </p>
        </div>
        <div className="site-footer__tmdb">
          <img className="site-footer__tmdb-logo" src={tmdbLogo} alt="" />
          <p className="muted">
            This product uses the TMDB API but is not endorsed or certified by{" "}
            <a href="https://www.themoviedb.org" rel="noreferrer">
              TMDB
            </a>
            .
          </p>
        </div>
      </div>
      <nav className="site-footer__legal" aria-label={t("footer.legal")}>
        <Link to={PATHS.privacy}>{t("footer.privacy")}</Link>
        <Button
          variant="text"
          icon={<ShieldCheck aria-hidden />}
          aria-haspopup="dialog"
          onClick={open}
        >
          {t("footer.privacySettings")}
        </Button>
        <CoffeeLink />
        <span className="site-footer__made muted" lang="en">
          Made in Italy
        </span>
      </nav>
    </footer>
  );
}
