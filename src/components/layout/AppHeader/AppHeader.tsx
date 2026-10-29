import { Link } from "react-router";
import { PATHS } from "../../../app/paths";
import { SITE } from "../../../app/site";
import { AccountMenu } from "../../../features/auth/components/AccountMenu";
import { ThemeSwitcher } from "../../../features/theme/ThemeSwitcher";
import { useI18n } from "../../../i18n/useI18n";
import { HeaderMenu } from "../HeaderMenu";
import { LanguageSwitcher } from "../LanguageSwitcher";

export function AppHeader() {
  const { t } = useI18n();

  return (
    <header className="site-header">
      <nav className="site-header__bar" aria-label={t("nav.main")}>
        <Link to={PATHS.home} className="wordmark">
          {SITE.name}
        </Link>
        <div className="site-header__actions">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <AccountMenu />
        </div>
        <HeaderMenu />
      </nav>
    </header>
  );
}
