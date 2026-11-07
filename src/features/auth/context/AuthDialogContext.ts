import { createContext } from "react";

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
  open(view: AuthDialogView, payload?: AuthDialogPayload): void;
  close(): void;
}

export const AuthDialogContext = createContext<AuthDialogContextValue | null>(null);
