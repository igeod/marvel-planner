import type { ReactNode } from "react";

interface StateBoxProps {
  // 96px illustration (112px in a dialog); decorative.
  art: ReactNode;
  title: string;
  // One sentence.
  children: string;
  actions?: ReactNode;
  // "status" for an empty list, "alert" for a failure.
  role?: "status" | "alert";
  // "dialog" has no card of its own: it sits in a popup, in a column.
  layout?: "card" | "dialog";
}

// The shared box of the empty, expired and failed-to-load states.
export function StateBox({
  art,
  title,
  children,
  actions,
  role = "status",
  layout = "card",
}: StateBoxProps) {
  return (
    <div className={`state-box state-box--${layout}`} role={role}>
      <div className="state-box__art" aria-hidden>
        {art}
      </div>
      <div className="state-box__body">
        <h3>{title}</h3>
        <p>{children}</p>
        {actions && <div className="state-box__actions">{actions}</div>}
      </div>
    </div>
  );
}
