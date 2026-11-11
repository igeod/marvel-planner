import { Choice, ChoiceGroup } from "../../../components/ui/ChoiceGroup/ChoiceGroup";
import { useI18n } from "../../../i18n/useI18n";
import { THEME_LABEL_KEYS } from "../labels";
import { THEMES } from "../theme";
import { useTheme } from "../useTheme";

export function ThemeChoice() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <ChoiceGroup legend={t("theme.label")} columns={3}>
      {THEMES.map((option) => (
        <Choice
          key={option}
          type="radio"
          name="theme"
          checked={theme === option}
          onChange={() => setTheme(option)}
        >
          {t(THEME_LABEL_KEYS[option])}
        </Choice>
      ))}
    </ChoiceGroup>
  );
}
