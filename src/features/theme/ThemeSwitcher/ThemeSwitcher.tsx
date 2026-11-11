import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "../../../components/ui/Button/Button";
import { useI18n } from "../../../i18n/useI18n";
import { THEME_LABEL_KEYS } from "../labels";
import { nextTheme } from "../theme";
import { useTheme } from "../useTheme";

const THEME_ICONS = { system: Monitor, light: Sun, dark: Moon } as const;

export function ThemeSwitcher() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const Icon = THEME_ICONS[theme];

  return (
    <Button
      variant="panel"
      icon={<Icon aria-hidden />}
      aria-label={t("theme.current", { name: t(THEME_LABEL_KEYS[theme]) })}
      title={t(THEME_LABEL_KEYS[theme])}
      onClick={() => setTheme(nextTheme(theme))}
    />
  );
}
