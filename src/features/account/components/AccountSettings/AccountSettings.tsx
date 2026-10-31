import { ChartLine, Lock, LogOut, UserRound, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentType,
  type FocusEvent,
  type KeyboardEvent,
  type MutableRefObject,
  type TouchEvent,
} from "react";
import { useMediaQuery } from "../../../../components/ui/useMediaQuery";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import { useAuth } from "../../../auth/hooks/useAuth";
import type { User } from "../../../auth/types";
import { initials } from "../../../auth/utils/initials";
import { UnsavedChangesContext } from "../../hooks/useReportDirty";
import { DeleteAccountSection } from "../DeleteAccountSection";
import { ExportSection } from "../ExportSection";
import { PasswordSection } from "../PasswordSection";
import { ProfileSection } from "../ProfileSection";
import { ProgressStatsSection } from "../ProgressStatsSection";

export const PROFILE_TITLE_ID = "profile-title";

const SHEET_QUERY = "(max-width: 639px)";
// A downward swipe on the header closes the sheet past this distance, if mostly vertical.
const SWIPE_CLOSE_DISTANCE = 70;
const SWIPE_MAX_DRIFT = 40;
// Space kept between a focused field and the edge of the visible area.
const FIELD_MARGIN = 16;
const FIELD_SCROLL_DELAY = 250;

type Tab = "progress" | "profile" | "password" | "account";

const TABS: { id: Tab; labelKey: TranslationKey; icon: ComponentType }[] = [
  { id: "progress", labelKey: "account.tabs.progress", icon: ChartLine },
  { id: "profile", labelKey: "account.tabs.profile", icon: UserRound },
  { id: "password", labelKey: "account.tabs.password", icon: Lock },
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
  // Set to this component's close request so Esc and the backdrop go through it too.
  closeRef: MutableRefObject<(() => void) | null>;
}

export function AccountSettings({ user, onClose, closeRef }: AccountSettingsProps) {
  const { t } = useI18n();
  const { logout } = useAuth();
  const [tab, setTab] = useState<Tab>("progress");
  const [isAskingDiscard, setIsAskingDiscard] = useState(false);
  const [isBannerLeaving, setIsBannerLeaving] = useState(false);
  const isSheet = useMediaQuery(SHEET_QUERY);
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dirtyForms = useRef(new Set<string>());
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const tabId = (id: Tab) => `${baseId}-tab-${id}`;

  const reportDirty = useCallback((id: string, isDirty: boolean) => {
    if (isDirty) dirtyForms.current.add(id);
    else dirtyForms.current.delete(id);
  }, []);

  const tryClose = () => {
    if (dirtyForms.current.size === 0) return onClose();
    setIsBannerLeaving(false);
    setIsAskingDiscard(true);
  };

  useEffect(() => {
    closeRef.current = tryClose;
    return () => {
      closeRef.current = null;
    };
  });

  // The sheet height follows the visual viewport so the keyboard and browser bars never cover fields.
  useEffect(() => {
    const dialog = rootRef.current?.closest("dialog");
    const viewport = window.visualViewport;
    if (!dialog || !viewport) return;
    const sync = () => dialog.style.setProperty("--viewport-height", `${viewport.height}px`);
    sync();
    viewport.addEventListener("resize", sync);
    window.addEventListener("resize", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      window.removeEventListener("resize", sync);
      dialog.style.removeProperty("--viewport-height");
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
    const nav = navRef.current;
    const button = document.getElementById(tabId(tab));
    if (isSheet && nav && button) {
      nav.scrollLeft = button.offsetLeft - (nav.clientWidth - button.offsetWidth) / 2;
    }
    // tabId only depends on baseId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, isSheet]);

  const selectTab = (id: Tab) => {
    setTab(id);
    document.getElementById(tabId(id))?.focus();
  };

  const handleTabKeys = (event: KeyboardEvent) => {
    const current = TABS.findIndex(({ id }) => id === tab);
    const target = {
      ArrowRight: current + 1,
      ArrowDown: current + 1,
      ArrowLeft: current - 1,
      ArrowUp: current - 1,
      Home: 0,
      End: TABS.length - 1,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    selectTab(TABS[(target + TABS.length) % TABS.length].id);
  };

  const handleSwipeEnd = (event: TouchEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || !isSheet) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (dy > SWIPE_CLOSE_DISTANCE && Math.abs(dx) < SWIPE_MAX_DRIFT) tryClose();
  };

  // Scroll the content, not the page, so a focused field clears the keyboard.
  const keepFieldVisible = (event: FocusEvent<HTMLElement>) => {
    const field = event.target;
    const box = event.currentTarget;
    if (!isSheet || !(field instanceof HTMLInputElement)) return;
    window.setTimeout(() => {
      const viewport = window.visualViewport;
      const f = field.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      const visibleBottom = Math.min(
        b.bottom,
        viewport ? viewport.offsetTop + viewport.height : b.bottom,
      );
      if (f.top < b.top + FIELD_MARGIN) box.scrollTop -= b.top + FIELD_MARGIN - f.top;
      else if (f.bottom > visibleBottom - FIELD_MARGIN) {
        box.scrollTop += f.bottom - (visibleBottom - FIELD_MARGIN);
      }
    }, FIELD_SCROLL_DELAY);
  };

  // The banner fades out (--dur-hover) before it leaves the DOM.
  const keepEditing = () => {
    setIsBannerLeaving(true);
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--dur-hover");
    window.setTimeout(() => setIsAskingDiscard(false), Number.parseFloat(raw) || 0);
    rootRef.current?.closest("dialog")?.focus();
  };

  return (
    <UnsavedChangesContext value={reportDirty}>
      <div className="profile" ref={rootRef}>
        <aside
          className="profile__side"
          onTouchStart={(event) => {
            const touch = event.touches[0];
            swipeStart.current = { x: touch.clientX, y: touch.clientY };
          }}
          onTouchEnd={handleSwipeEnd}
        >
          <div className="profile__id">
            <div className="profile__avatar" aria-hidden="true">
              {initials(user.name).slice(0, 1)}
            </div>
            <p className="profile__name">{user.name}</p>
          </div>
          <nav
            className="profile__nav"
            role="tablist"
            aria-label={t("account.nav")}
            aria-orientation={isSheet ? "horizontal" : "vertical"}
            ref={navRef}
            onKeyDown={handleTabKeys}
          >
            {TABS.map(({ id, labelKey, icon: Icon }) => (
              <button
                key={id}
                id={tabId(id)}
                type="button"
                role="tab"
                className="profile__tab"
                aria-selected={tab === id}
                aria-controls={`${baseId}-panel`}
                tabIndex={tab === id ? 0 : -1}
                onClick={() => setTab(id)}
              >
                <Icon aria-hidden />
                {t(labelKey)}
              </button>
            ))}
          </nav>
        </aside>

        <section className="profile__content">
          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={tabId(tab)}
            className="profile__inner"
            data-tab={tab}
            ref={scrollRef}
            onFocus={keepFieldVisible}
          >
            <h2 id={PROFILE_TITLE_ID} className="profile__title">
              {t(TITLE_KEYS[tab])}
            </h2>
            {/* Every panel stays mounted so unsaved edits survive switching tabs. */}
            <div className="profile__panel profile__scroll scroll-y" hidden={tab !== "progress"}>
              <ProgressStatsSection />
            </div>
            <div className="profile__panel" hidden={tab !== "profile"}>
              <ProfileSection user={user} />
            </div>
            <div className="profile__panel" hidden={tab !== "password"}>
              <PasswordSection />
            </div>
            <div className="profile__panel" hidden={tab !== "account"}>
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
              <hr className="profile__rule" />
              <ExportSection />
              <DeleteAccountSection />
            </div>
          </div>
        </section>

        <button
          type="button"
          className="dialog__close profile__close"
          aria-label={t("common.close")}
          onClick={tryClose}
        >
          <X aria-hidden />
        </button>

        {isAskingDiscard && (
          <div
            className="profile__unsaved"
            role="alert"
            data-leaving={isBannerLeaving || undefined}
          >
            <p>{t("account.dialog.unsaved")}</p>
            <div className="profile__unsaved-actions">
              <button type="button" className="profile__keep" onClick={keepEditing}>
                {t("account.dialog.keep")}
              </button>
              <button type="button" className="profile__discard" onClick={onClose}>
                {t("account.dialog.discard")}
              </button>
            </div>
          </div>
        )}
      </div>
    </UnsavedChangesContext>
  );
}
