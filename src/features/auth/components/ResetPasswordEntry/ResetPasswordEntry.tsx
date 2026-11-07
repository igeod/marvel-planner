import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { PATHS } from "../../../../app/paths";
import { useAuthDialog } from "../../hooks/useAuthDialog";

// The link in the email lands here: the token is read once and taken off the address bar.
export function ResetPasswordEntry() {
  const navigate = useNavigate();
  const { open } = useAuthDialog();
  const [params] = useSearchParams();
  const [arrival] = useState(() => ({ token: params.get("token"), error: params.get("error") }));

  useEffect(() => {
    navigate(PATHS.home, { replace: true });
    if (arrival.token && !arrival.error) open("resetPassword", { token: arrival.token });
    else open("resetInvalid");
  }, [arrival, navigate, open]);

  return null;
}
