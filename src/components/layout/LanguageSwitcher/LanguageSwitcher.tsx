import { Languages } from "lucide-react";
import { LANGUAGES, LANGUAGE_NAMES, isLanguage } from "../../../../shared/languages";
import { useI18n } from "../../../i18n/useI18n";
import { SelectField, type SelectOption } from "../../ui/SelectField/SelectField";

const OPTIONS: SelectOption[] = LANGUAGES.map((code) => ({
  value: code,
  label: LANGUAGE_NAMES[code],
  lang: code,
}));

interface LanguageSwitcherProps {
  layout?: "popover" | "inline";
}

export function LanguageSwitcher({ layout = "popover" }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useI18n();

  return (
    <SelectField
      layout={layout}
      label={t("nav.language")}
      showLabel={layout === "inline"}
      value={language}
      options={OPTIONS}
      icon={layout === "popover" ? <Languages aria-hidden /> : undefined}
      onChange={(value) => isLanguage(value) && setLanguage(value)}
    />
  );
}
