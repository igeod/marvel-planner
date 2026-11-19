import { BellPlus, BellRing } from "lucide-react";
import { Button } from "../../../../components/ui/Button/Button";
import { Tooltip } from "../../../../components/ui/Tooltip/Tooltip";
import { useI18n } from "../../../../i18n/useI18n";
import { useTitleAlerts } from "../../hooks/useTitleAlerts";
import type { Title } from "../../types";

interface TitleAlertButtonProps {
  title: Pick<Title, "id" | "name">;
  // icon: in the closed row, in place of the checkbox. pill: in the open row. panel: on the film page.
  variant: "icon" | "pill" | "panel";
}

// "Tell me by e-mail when it is out". The name says the channel and the title; the state is aria-pressed.
export function TitleAlertButton({ title, variant }: TitleAlertButtonProps) {
  const { t } = useI18n();
  const { isOn, toggle } = useTitleAlerts();
  const isActive = isOn(title.id);
  const label = t("titleAlerts.label", { title: title.name });
  const Icon = isActive ? BellRing : BellPlus;
  const onClick = () => toggle({ id: title.id, name: title.name });

  if (variant === "icon") {
    // No aria-describedby and no tap tooltip: the name already says it, and the toast confirms.
    return (
      <Tooltip content={t("titleAlerts.hint")}>
        {() => (
          <button
            type="button"
            className="title-row__check title-row__alert"
            aria-pressed={isActive}
            aria-label={label}
            onClick={onClick}
          >
            <Icon aria-hidden />
          </button>
        )}
      </Tooltip>
    );
  }

  if (variant === "pill") {
    return (
      <div className="mark-watched">
        <button
          type="button"
          className="mark-watched__button mark-watched__button--alert"
          aria-pressed={isActive}
          aria-label={label}
          onClick={onClick}
        >
          <span className="mark-watched__pill">
            <Icon aria-hidden />
            {t("titleAlerts.button")}
          </span>
        </button>
      </div>
    );
  }

  return (
    <Button
      variant="panel"
      className="title-alert-panel"
      aria-pressed={isActive}
      aria-label={label}
      icon={<Icon aria-hidden />}
      onClick={onClick}
    >
      {t("titleAlerts.button")}
    </Button>
  );
}
