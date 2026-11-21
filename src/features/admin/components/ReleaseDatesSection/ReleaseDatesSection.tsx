import { CalendarClock, CircleDashed, Pencil, RefreshCw, TriangleAlert, Undo2 } from "lucide-react";
import { useState } from "react";
import { isRealIsoDate } from "../../../../../shared/isoDate";
import { ConfirmDialog } from "../../../../components/ui/ConfirmDialog/ConfirmDialog";
import { TextField } from "../../../../components/ui/Field/Field";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { SelectField } from "../../../../components/ui/SelectField/SelectField";
import { useToast } from "../../../../components/ui/Toast/useToast";
import { useI18n } from "../../../../i18n/useI18n";
import { todayIso } from "../../../planner/utils/releases";
import { titlesWithDates, type AdminTitle } from "../../utils/adminTitles";
import { AdminQueue } from "../AdminQueue/AdminQueue";

const PAGE_SIZE = 10;

interface DateActions {
  setDate: (titleId: string, date: string) => Promise<boolean>;
  // Resolves to the hand-written date it took away, or null if it did not work.
  clearDate: (titleId: string) => Promise<string | null>;
  keepDate: (titleId: string) => Promise<boolean>;
}

function Pill({ title }: { title: AdminTitle }) {
  const { t } = useI18n();
  if (title.dateIssue === "tmdbChanged") {
    return (
      <span className="admin-pill admin-pill--late">
        <RefreshCw aria-hidden />
        {t("admin.dates.pillChanged")}
      </span>
    );
  }
  if (title.dateIssue === "yearOnly") {
    return (
      <span className="admin-pill admin-pill--late">
        <CircleDashed aria-hidden />
        {t("admin.dates.pillYearOnly")}
      </span>
    );
  }
  return (
    <span className="admin-pill admin-pill--ok">
      <Pencil aria-hidden />
      {t("admin.dates.pillManual")}
    </span>
  );
}

interface DateDialogProps extends DateActions {
  // The title being edited; with several to choose from, the select shows above the field.
  title: AdminTitle | null;
  choices: AdminTitle[] | null;
  onClose: () => void;
}

function DateDialog({ title, choices, onClose, setDate, clearDate }: DateDialogProps) {
  const { t, formatDate } = useI18n();
  const toast = useToast();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<{ title: AdminTitle; date: string } | null>(null);
  const [selectedId, setSelectedId] = useState("");
  // The fields start from the title the dialog was opened for (adjusted while rendering).
  const [openedFor, setOpenedFor] = useState<AdminTitle | null>(null);
  if (title !== openedFor) {
    setOpenedFor(title);
    setValue(title?.manualDate ?? "");
    setError(null);
    setSelectedId(title?.id ?? choices?.[0]?.id ?? "");
  }
  const target = choices ? (choices.find((item) => item.id === selectedId) ?? null) : title;
  const isValid = isRealIsoDate(value.trim());
  const dateName = (date: string | null) => (date ? formatDate(date) : t("admin.dates.none"));

  const save = async (item: AdminTitle, date: string) => {
    if (await setDate(item.id, date)) {
      setPending(null);
      onClose();
    }
  };

  const submit = () => {
    if (!target) return;
    const date = value.trim();
    if (!date) return setError(t("admin.dates.errorEmpty"));
    if (!isRealIsoDate(date)) return setError(t("admin.dates.errorInvalid"));
    // A date that turns a title upcoming ↔ released changes what every user sees: ask first.
    const willBeReleased = date <= todayIso();
    if (willBeReleased !== target.isReleased) return setPending({ title: target, date });
    void save(target, date);
  };

  const revert = async () => {
    if (!target) return;
    const previous = await clearDate(target.id);
    if (previous === null) return;
    onClose();
    toast.show({
      tone: "info",
      title: t("admin.dates.restored"),
      action: { label: t("common.undo"), onClick: () => void setDate(target.id, previous) },
    });
  };

  const inUse = target?.manualDate
    ? t("admin.dates.inUseManual", { date: formatDate(target.manualDate) })
    : dateName(target?.tmdbDate ?? null);

  return (
    <>
      <Modal
        isOpen={title !== null || choices !== null}
        title={
          target ? t("admin.dates.dialogTitle", { title: target.name }) : t("admin.dates.edit")
        }
        titleLang="en"
        onClose={onClose}
      >
        {choices && (
          <SelectField
            label={t("admin.dates.titleField")}
            showLabel
            layout="inline"
            value={selectedId}
            options={choices.map((item) => ({ value: item.id, label: item.name, lang: "en" }))}
            onChange={(id) => {
              setSelectedId(id);
              setValue(choices.find((item) => item.id === id)?.manualDate ?? "");
              setError(null);
            }}
          />
        )}
        {target && (
          <>
            <dl className="adm-sources">
              <dt>{t("admin.dates.rowTmdb")}</dt>
              <dd>{dateName(target.tmdbDate)}</dd>
              <dt>{t("admin.dates.rowManual")}</dt>
              <dd>{dateName(target.manualDate)}</dd>
              <dt>{t("admin.dates.rowInUse")}</dt>
              <dd className="adm-sources__use">{inUse}</dd>
            </dl>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
              noValidate
            >
              <TextField
                label={t("admin.dates.field")}
                name="release-date"
                value={value}
                onChange={(next) => {
                  setValue(next);
                  setError(null);
                }}
                error={error}
                note={
                  isValid
                    ? t("admin.dates.fieldNote", { date: formatDate(value.trim()) })
                    : t("admin.dates.format")
                }
              />
              <div className="dialog__actions">
                {target.manualDate && (
                  <button type="button" className="btn btn--text adm-revert" onClick={revert}>
                    <Undo2 aria-hidden />
                    {t("admin.dates.revert")}
                  </button>
                )}
                <button type="button" className="btn btn--soft" onClick={onClose}>
                  {t("common.cancel")}
                </button>
                <button type="submit" className="btn btn--primary">
                  {t("admin.todo.save")}
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>
      <ConfirmDialog
        isOpen={pending !== null}
        tone="warning"
        icon={<TriangleAlert />}
        title={
          pending
            ? t(
                pending.date <= todayIso()
                  ? "admin.dates.confirmReleasedTitle"
                  : "admin.dates.confirmUpcomingTitle",
                { title: pending.title.name },
              )
            : ""
        }
        message={
          pending
            ? t(
                pending.date <= todayIso()
                  ? "admin.dates.confirmReleasedBody"
                  : "admin.dates.confirmUpcomingBody",
                { date: pending.date },
              )
            : ""
        }
        confirmLabel={t("admin.dates.confirm")}
        cancelLabel={t("common.cancel")}
        onCancel={() => setPending(null)}
        onConfirm={() => pending && void save(pending.title, pending.date)}
      />
    </>
  );
}

interface ReleaseDatesSectionProps extends DateActions {
  titles: AdminTitle[];
}

export function ReleaseDatesSection({ titles, ...actions }: ReleaseDatesSectionProps) {
  const { t, formatDate } = useI18n();
  const [editing, setEditing] = useState<AdminTitle | null>(null);
  const [isChoosing, setIsChoosing] = useState(false);
  const [shown, setShown] = useState(PAGE_SIZE);
  const rows = titlesWithDates(titles);
  const dateName = (date: string | null) => (date ? formatDate(date) : t("admin.dates.none"));

  return (
    <AdminQueue id="date" title={t("admin.dates.heading")} count={rows.length}>
      <p>{t("admin.dates.intro")}</p>
      {rows.length === 0 ? (
        <div className="candidates__empty">
          <span className="candidates__empty-icon" aria-hidden="true">
            <CalendarClock />
          </span>
          <div className="candidates__empty-text">
            <p>{t("admin.dates.empty")}</p>
          </div>
        </div>
      ) : (
        <ul className="candidates__list">
          {rows.slice(0, shown).map((title) => (
            <li key={title.id} className="admin-row candidate">
              <div className="candidate__head">
                <strong className="candidate__title" lang="en">
                  {title.name}
                </strong>
                <Pill title={title} />
              </div>
              <p className="admin-note candidate__meta">
                {t("admin.dates.sources", {
                  tmdb: dateName(title.tmdbDate),
                  manual: dateName(title.manualDate),
                  inUse: title.releaseDate ? formatDate(title.releaseDate) : title.release,
                })}
              </p>
              {title.dateIssue === "tmdbChanged" && (
                <p className="admin-note">
                  {t("admin.dates.changedNote", {
                    tmdb: dateName(title.tmdbDate),
                    manual: dateName(title.manualDate),
                  })}
                </p>
              )}
              <div className="candidate__actions">
                {title.dateIssue === "tmdbChanged" && (
                  <>
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => void actions.keepDate(title.id)}
                    >
                      {t("admin.dates.keepMine")}
                    </button>
                    <button
                      type="button"
                      className="btn btn--soft"
                      onClick={() => void actions.clearDate(title.id)}
                    >
                      {t("admin.dates.useTmdb")}
                    </button>
                  </>
                )}
                <button type="button" className="btn btn--soft" onClick={() => setEditing(title)}>
                  <CalendarClock aria-hidden />
                  {t("admin.dates.edit")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {rows.length > shown && (
        <button type="button" className="btn btn--soft" onClick={() => setShown(shown + PAGE_SIZE)}>
          {t("admin.todo.more")}
        </button>
      )}
      <button type="button" className="btn btn--text" onClick={() => setIsChoosing(true)}>
        {t("admin.dates.other")}
      </button>
      <DateDialog
        {...actions}
        title={editing}
        choices={isChoosing ? titles : null}
        onClose={() => {
          setEditing(null);
          setIsChoosing(false);
        }}
      />
    </AdminQueue>
  );
}
