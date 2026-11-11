import { Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Tooltip } from "../Tooltip/Tooltip";
import type { Placement } from "../Tooltip/placement";

interface InfoTipProps {
  label: string;
  children: ReactNode;
  placement?: Placement;
  tone?: "info" | "warning";
}

export function InfoTip({ label, children, placement = "top", tone = "info" }: InfoTipProps) {
  const Icon = tone === "warning" ? TriangleAlert : Info;

  return (
    <Tooltip
      content={children}
      placement={placement}
      tone={tone === "warning" ? "warning" : "neutral"}
      opensOnTap
    >
      {(describedBy) => (
        <button
          type="button"
          className={`info-tip__trigger info-tip__trigger--${tone}`}
          aria-label={label}
          aria-describedby={describedBy}
        >
          <Icon data-tooltip-anchor aria-hidden />
        </button>
      )}
    </Tooltip>
  );
}
