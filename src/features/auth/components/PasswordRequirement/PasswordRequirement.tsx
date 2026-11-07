import { Check, Minus, X } from "lucide-react";
import { useI18n } from "../../../../i18n/useI18n";

interface PasswordRequirementProps {
  id: string;
  met: boolean;
  failed: boolean;
  minLength: number;
}

// The line under a new password: dash while pending, tick once met, cross after a failed attempt.
export function PasswordRequirement({ id, met, failed, minLength }: PasswordRequirementProps) {
  const { t } = useI18n();
  return (
    <p
      id={id}
      role="status"
      className="password-requirement"
      data-met={met || undefined}
      data-failed={failed || undefined}
    >
      {met ? <Check aria-hidden /> : failed ? <X aria-hidden /> : <Minus aria-hidden />}
      {t("account.password.requirements.length", { min: minLength })}
      <span className="visually-hidden">
        {met ? t("account.password.requirements.met") : t("account.password.requirements.notMet")}
      </span>
    </p>
  );
}
