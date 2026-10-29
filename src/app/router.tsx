import { createBrowserRouter } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { AdminPage } from "../pages/AdminPage";
import { ErrorPage } from "../pages/ErrorPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PlannerPage } from "../pages/PlannerPage";
import { TitlePage } from "../pages/TitlePage";
import { PrivacyPage } from "../pages/PrivacyPage";
import { PATHS } from "./paths";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: PATHS.home, element: <PlannerPage /> },
      { path: PATHS.shared, element: <PlannerPage /> },
      { path: PATHS.title, element: <TitlePage /> },
      { path: PATHS.admin, element: <AdminPage /> },
      { path: PATHS.privacy, element: <PrivacyPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
