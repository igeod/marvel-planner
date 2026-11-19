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
  const [state, setState] = useState<{
    view: AuthDialogView | null;
    payload: AuthDialogPayload;
    note: ReactNode | null;
  }>({ view: null, payload: NO_PAYLOAD, note: null });

  const open = useCallback(
    (view: AuthDialogView, payload: AuthDialogPayload = NO_PAYLOAD, note?: ReactNode) =>
      setState((current) => ({ view, payload, note: note ?? current.note })),
    [],
  );
  const close = useCallback(() => setState({ view: null, payload: NO_PAYLOAD, note: null }), []);

  const value = useMemo<AuthDialogContextValue>(
    () => ({ view: state.view, payload: state.payload, note: state.note, open, close }),
    [state, open, close],
  );

  return <AuthDialogContext value={value}>{children}</AuthDialogContext>;
}
