import { createBrowserRouter } from "react-router";
import { AppLayout } from "../components/layout/AppLayout/AppLayout";
import { AdminPage } from "../pages/AdminPage/AdminPage";
import { ErrorPage } from "../pages/ErrorPage/ErrorPage";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
import { PlannerPage } from "../pages/PlannerPage/PlannerPage";
import { TitlePage } from "../pages/TitlePage/TitlePage";
import { PrivacyPage } from "../pages/PrivacyPage/PrivacyPage";
import { ResetPasswordEntry } from "../features/auth/components/ResetPasswordEntry/ResetPasswordEntry";
import { PASSWORD_RESET_ENABLED } from "../features/auth/passwordReset";
import { PATHS } from "./paths";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    // A crash in the layout itself: no header or footer left to keep.
    errorElement: <ErrorPage standalone />,
    children: [
      {
        // A crash in a page keeps the layout, so header and footer stay.
        errorElement: <ErrorPage />,
        children: [
          { path: PATHS.home, element: <PlannerPage /> },
          { path: PATHS.shared, element: <PlannerPage /> },
          { path: PATHS.title, element: <TitlePage /> },
          { path: PATHS.admin, element: <AdminPage /> },
          { path: PATHS.privacy, element: <PrivacyPage /> },
          ...(PASSWORD_RESET_ENABLED
            ? [{ path: PATHS.resetPassword, element: <ResetPasswordEntry /> }]
            : []),
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
