import { ChartNoAxesColumn, KeyRound, LogOut, UserRound, X } from "lucide-react";
import { useState, type ComponentType } from "react";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import { useAuth } from "../../../auth/hooks/useAuth";
import type { User } from "../../../auth/types";
import { initials } from "../../../auth/utils/initials";
import { DeleteAccountSection } from "../DeleteAccountSection";
import { ExportSection } from "../ExportSection";
import { PasswordSection } from "../PasswordSection";
import { ProfileSection } from "../ProfileSection";
import { ProgressStatsSection } from "../ProgressStatsSection";

export const PROFILE_TITLE_ID = "profile-title";

type Tab = "progress" | "profile" | "password" | "account";

const TABS: { id: Tab; labelKey: TranslationKey; icon: ComponentType }[] = [
  { id: "progress", labelKey: "account.tabs.progress", icon: ChartNoAxesColumn },
  { id: "profile", labelKey: "account.tabs.profile", icon: UserRound },
  { id: "password", labelKey: "account.tabs.password", icon: KeyRound },
  { id: "account", labelKey: "account.tabs.account", icon: LogOut },
];

const TITLE_KEYS: Record<Tab, TranslationKey> = {
  progress: "account.stats.heading",
  profile: "account.tabs.profile",
  password: "account.tabs.password",
  account: "account.tabs.account",
};

interface AccountSettingsProps {
  user: User;
  onClose: () => void;
}

export function AccountSettings({ user, onClose }: AccountSettingsProps) {
  const { t } = useI18n();
  const { logout } = useAuth();
  const [tab, setTab] = useState<Tab>("progress");

  return (
    <div className="profile">
      <aside className="profile__side">
        <div className="profile__id">
          <div className="profile__avatar" aria-hidden="true">
            {initials(user.name).slice(0, 1)}
          </div>
          <p className="profile__name">{user.name}</p>
        </div>
        <nav className="profile__nav" aria-label={t("account.nav")}>
          {TABS.map(({ id, labelKey, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className="profile__tab"
              aria-current={tab === id ? "page" : undefined}
              onClick={() => setTab(id)}
            >
              <Icon aria-hidden />
              {t(labelKey)}
            </button>
          ))}
        </nav>
      </aside>

      <section className="profile__content">
        <button
          type="button"
          className="dialog__close profile__close"
          aria-label={t("common.close")}
          onClick={onClose}
        >
          <X aria-hidden />
        </button>
        <h2 id={PROFILE_TITLE_ID} className="profile__title">
          {t(TITLE_KEYS[tab])}
        </h2>
        <div className="profile__scroll">
          {tab === "progress" && <ProgressStatsSection />}
          {tab === "profile" && <ProfileSection user={user} />}
          {tab === "password" && <PasswordSection />}
          {tab === "account" && (
            <>
              <section className="profile__logout">
                <div>
                  <h3>{t("account.logout.heading")}</h3>
                  <p className="muted">{t("account.logout.note")}</p>
                </div>
                <button type="button" className="btn btn--ink" onClick={logout}>
                  <LogOut aria-hidden />
                  {t("account.logout.heading")}
                </button>
              </section>
              <ExportSection />
              <DeleteAccountSection />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
