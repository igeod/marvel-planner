import { ShieldCheck } from "lucide-react";

// Sits in the corner of an avatar; its size comes from the --badge-* variables of the container.
export function AdminBadge() {
  return (
    <span className="admin-badge" aria-hidden="true">
      <ShieldCheck />
    </span>
  );
}
