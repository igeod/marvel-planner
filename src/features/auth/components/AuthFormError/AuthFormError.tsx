import { FormError } from "../../../../components/ui/FormError/FormError";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";

interface AuthFormErrorProps {
  error: string;
  code: TranslationKey | null;
}

// The error row at the top of a sign-in form; too many attempts gets its own block.
export function AuthFormError({ error, code }: AuthFormErrorProps) {
  const { t } = useI18n();
  const isRate = code === "auth.errors.tooManyRequests";
  // The quip exists in it and en only; the other languages leave it empty.
  const quip = isRate ? t("auth.errors.tooManyRequestsJoke") : "";
  return (
    <FormError tone={isRate ? "rate" : "error"} title={quip || undefined}>
      {error}
    </FormError>
  );
}
