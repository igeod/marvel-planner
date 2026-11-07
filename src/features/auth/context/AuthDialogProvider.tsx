import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  AuthDialogContext,
  type AuthDialogContextValue,
  type AuthDialogPayload,
  type AuthDialogView,
} from "./AuthDialogContext";

interface AuthDialogProviderProps {
  children: ReactNode;
}

const NO_PAYLOAD: AuthDialogPayload = {};

export function AuthDialogProvider({ children }: AuthDialogProviderProps) {
  const [state, setState] = useState<{ view: AuthDialogView | null; payload: AuthDialogPayload }>({
    view: null,
    payload: NO_PAYLOAD,
  });

  const open = useCallback(
    (view: AuthDialogView, payload: AuthDialogPayload = NO_PAYLOAD) => setState({ view, payload }),
    [],
  );
  const close = useCallback(() => setState({ view: null, payload: NO_PAYLOAD }), []);

  const value = useMemo<AuthDialogContextValue>(
    () => ({ view: state.view, payload: state.payload, open, close }),
    [state, open, close],
  );

  return <AuthDialogContext value={value}>{children}</AuthDialogContext>;
}
