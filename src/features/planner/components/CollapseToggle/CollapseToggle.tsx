import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useI18n } from "../../../../i18n/useI18n";

interface CollapseToggleProps {
  areAllCollapsed: boolean;
  onToggleAll: () => void;
  size: "sm" | "lg";
  // Round icon button; the label stays available to assistive tech.
  iconOnly?: boolean;
}

export function CollapseToggle({
  areAllCollapsed,
  onToggleAll,
  size,
  iconOnly,
}: CollapseToggleProps) {
  const { t } = useI18n();
  const Icon = areAllCollapsed ? ChevronsUpDown : ChevronsDownUp;

  const label = areAllCollapsed ? t("planner.toolbar.expandAll") : t("planner.toolbar.collapseAll");

  if (iconOnly) {
    return (
      <Button
        variant="surface"
        size={size}
        icon={<Icon aria-hidden />}
        aria-label={label}
        onClick={onToggleAll}
      />
    );
  }

  return (
    <Button variant="surface" size={size} icon={<Icon aria-hidden />} onClick={onToggleAll}>
      {label}
    </Button>
  );
}
