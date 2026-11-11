import { useEffect, type ReactNode } from "react";
import { Status } from "../../../../components/ui/Status/Status";

export const AUTH_TITLE_ID = "auth-dialog-title";

interface AuthResultProps {
  // One sentence; the dialog's own heading is the title.
  children: string;
  tick?: boolean;
  actions: ReactNode;
  links?: ReactNode;
  status?: string;
}

// The views with no fields (link sent, password updated, link expired): the heading takes the focus.
export function AuthResult({ children, tick, actions, links, status }: AuthResultProps) {
  useEffect(() => {
    document.getElementById(AUTH_TITLE_ID)?.focus();
  }, []);

  return (
    <div className="auth-result">
      {tick ? <Status tone="success">{children}</Status> : <p>{children}</p>}
      <div className="auth-result__actions">{actions}</div>
      {status !== undefined && <Status>{status}</Status>}
      {links}
    </div>
  );
}
