import { useId } from "react";
import type { AdminOverview } from "../../../../../shared/admin";
import { useI18n } from "../../../../i18n/useI18n";

export function UsersSection({ users }: { users: AdminOverview["users"] }) {
  const { t, formatDate } = useI18n();
  const headingId = useId();

  return (
    <section className="users-section" aria-labelledby={headingId}>
      <h2 id={headingId}>{t("admin.users.heading")}</h2>
      <dl className="users-section__grid">
        <div className="admin-row">
          <dt>{t("admin.users.total")}</dt>
          <dd>{users.total}</dd>
        </div>
        <div className="admin-row">
          <dt>{t("admin.users.newWeek")}</dt>
          <dd>{users.newLastWeek}</dd>
        </div>
        <div className="admin-row">
          <dt>{t("admin.users.deleted")}</dt>
          <dd>{users.deleted}</dd>
          {users.deletedSince && (
            <dd className="admin-note users-section__since">
              {t("admin.users.since", { date: formatDate(users.deletedSince) })}
            </dd>
          )}
        </div>
      </dl>
    </section>
  );
}
