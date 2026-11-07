import { RouterProvider } from "react-router";
import { AuthDialogProvider } from "../features/auth/context/AuthDialogProvider";
import { AuthProvider } from "../features/auth/context/AuthProvider";
import { ToastProvider } from "../components/ui/Toast";
import { ThemeProvider } from "../features/theme/ThemeProvider";
import { SiteStatusProvider } from "../features/site/context/SiteStatusProvider";
import { PrivacySettingsProvider } from "../features/privacy/context/PrivacySettingsProvider";
import { I18nProvider } from "../i18n/I18nProvider";
import { router } from "./router";

export function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <SiteStatusProvider>
            <AuthDialogProvider>
              <PrivacySettingsProvider>
                <ToastProvider>
                  <RouterProvider router={router} />
                </ToastProvider>
              </PrivacySettingsProvider>
            </AuthDialogProvider>
          </SiteStatusProvider>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
