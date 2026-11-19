import { use } from "react";
import { TitleAlertsContext } from "../context/TitleAlertsContext";

export function useTitleAlerts() {
  const context = use(TitleAlertsContext);
  if (!context) {
    throw new Error("useTitleAlerts deve essere usato all'interno di TitleAlertsProvider");
  }
  return context;
}
