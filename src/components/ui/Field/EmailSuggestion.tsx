import { Info } from "lucide-react";
import { useI18n } from "../../../i18n/useI18n";
import { Button } from "../Button/Button";

interface EmailSuggestionProps {
  suggestion: string | null;
  onUse: (email: string) => void;
}

// "Did you mean gmail.com?" under the email field: a neutral note with the way to accept it.
export function EmailSuggestion({ suggestion, onUse }: EmailSuggestionProps) {
  const { t } = useI18n();
  if (!suggestion) return null;

  return (
    <div className="field__suggestion" role="status">
      <Info aria-hidden />
      <span>{t("auth.emailSuggestion", { email: suggestion })}</span>
      <Button variant="text" size="sm" onClick={() => onUse(suggestion)}>
        {t("auth.useSuggestion")}
      </Button>
    </div>
  );
}
