import { Info, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface MissingNoteProps {
  children: ReactNode;
  icon?: LucideIcon;
  // Ink on light surfaces, light on dark ones (cover, spoiler zone).
  tone?: "light" | "dark";
}

// Standard line for a piece of data we do not have: icon and text, never a bare gap.
export function MissingNote({ children, icon: Icon = Info, tone = "light" }: MissingNoteProps) {
  return (
    <p className={`missing-note missing-note--${tone}`}>
      <Icon aria-hidden />
      {children}
    </p>
  );
}
