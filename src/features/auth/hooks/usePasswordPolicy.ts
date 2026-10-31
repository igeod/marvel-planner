import { useEffect, useState } from "react";
import {
  DEFAULT_PASSWORD_POLICY,
  parsePasswordPolicy,
  type PasswordPolicy,
} from "../../../../shared/passwordPolicy";

let pending: Promise<PasswordPolicy> | null = null;

// One request per page load; the server stays the authority either way.
function loadPolicy(): Promise<PasswordPolicy> {
  pending ??= fetch("/api/password-policy", { credentials: "same-origin" })
    .then((response) => (response.ok ? response.text() : null))
    .then(parsePasswordPolicy)
    .catch(() => {
      pending = null;
      return DEFAULT_PASSWORD_POLICY;
    });
  return pending;
}

export function usePasswordPolicy(): PasswordPolicy {
  const [policy, setPolicy] = useState(DEFAULT_PASSWORD_POLICY);
  useEffect(() => {
    let isCurrent = true;
    void loadPolicy().then((loaded) => isCurrent && setPolicy(loaded));
    return () => {
      isCurrent = false;
    };
  }, []);
  return policy;
}
