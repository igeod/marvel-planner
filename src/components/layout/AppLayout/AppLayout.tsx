import { useEffect, useRef } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { useSiteStatus } from "../../../features/site/hooks/useSiteStatus";
import { MaintenancePage } from "../../../pages/MaintenancePage";
import { AuthDialogs } from "../../../features/auth/components/AuthDialogs";
import { PrivacySettingsDialog } from "../../../features/privacy/components/PrivacySettingsDialog";
import { useSplashReady } from "../../../app/splash";
import { AppFooter } from "../AppFooter";
import { AppHeader } from "../AppHeader";
import { MAIN_CONTENT_ID, SkipLink } from "../SkipLink";

export function AppLayout() {
  const { pathname } = useLocation();
  const { maintenance, isAdmin, isLoading } = useSiteStatus();
  // Auth and site status are settled once the layout stops loading (children register their own keys first).
  useSplashReady("site", !isLoading);
  const mainRef = useRef<HTMLElement>(null);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    mainRef.current?.focus();
  }, [pathname]);

  // Maintenance replaces the whole page, header and footer included; only the dialogs stay.
  if (!isLoading && maintenance && !isAdmin) {
    return (
      <>
        <MaintenancePage />
        <AuthDialogs />
        <PrivacySettingsDialog />
        <ScrollRestoration />
      </>
    );
  }

  return (
    <>
      <SkipLink />
      <AppHeader />
      <main className="site-main" id={MAIN_CONTENT_ID} ref={mainRef} tabIndex={-1}>
        {isLoading ? null : <Outlet />}
      </main>
      {!isLoading && <AppFooter />}
      <AuthDialogs />
      <PrivacySettingsDialog />
      <ScrollRestoration />
    </>
  );
}
