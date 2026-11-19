import { createContext, type ReactNode } from "react";

export type AuthDialogView =
  | "login"
  | "register"
  | "account"
  | "forgot"
  | "forgotSent"
  | "resetPassword"
  | "resetDone"
  | "resetInvalid";

// What a view needs from the one before it. The reset token lives here only while its view is open.
export interface AuthDialogPayload {
  email?: string;
  token?: string;
}

export interface AuthDialogContextValue {
  view: AuthDialogView | null;
  payload: AuthDialogPayload;
  // Why the sign-in was asked ("Sign in to share your planner"): a line above the form, kept while
  // the dialog moves between sign-in and sign-up, gone when it closes.
  note: ReactNode | null;
  open(view: AuthDialogView, payload?: AuthDialogPayload, note?: ReactNode): void;
  close(): void;
}

export const AuthDialogContext = createContext<AuthDialogContextValue | null>(null);
