import { createContext } from "react";
import type { AlertTitle } from "../utils/titleAlertsState";

export interface TitleAlertsContextValue {
  isOn(titleId: string): boolean;
  // A guest is sent to sign in first; the alert turns on by itself afterwards.
  toggle(title: AlertTitle): void;
  // Called after a successful sign-in or sign-up. True if it took over the toast.
  resumeAfterAuth(email: string): boolean;
}

export const TitleAlertsContext = createContext<TitleAlertsContextValue | null>(null);
