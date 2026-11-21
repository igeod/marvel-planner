import { Check, CircleDashed, Copy, ListChecks, Maximize2, Minus, RefreshCw } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { ReviewTopic } from "../../../../../shared/admin";
import { titlePath } from "../../../../app/paths";
import { Choice, ChoiceGroup } from "../../../../components/ui/ChoiceGroup/ChoiceGroup";
import { Modal } from "../../../../components/ui/Modal/Modal";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import { typeLabelKey } from "../../../planner/data/labels";
import {
  CONTENT_KINDS,
  buildContentTemplate,
  filterTodoTitles,
  type AdminTitle,
  type ContentKind,
  type ContentState,
  type TodoFilter,
} from "../../utils/adminTitles";
import { AdminQueue } from "../AdminQueue/AdminQueue";

const PAGE_SIZE = 10;
const COPIED_MS = 2000;
const FILTERS: TodoFilter[] = ["todo", "review", "all"];
// What can be marked "checked, nothing to add" (the guide is there or it is not).
const VERIFIABLE: Exclude<ContentKind, "guide">[] = ["postCredits", "keyScenes", "easterEggs"];

const KIND_LABEL: Record<ContentKind, TranslationKey> = {
  guide: "admin.todo.kindGuide",
  postCredits: "admin.todo.kindPostCredits",
  keyScenes: "admin.todo.kindKeyScenes",
  easterEggs: "admin.todo.kindEasterEggs",
};
const FILTER_LABEL: Record<TodoFilter, TranslationKey> = {
  todo: "admin.todo.filterTodo",
  review: "admin.todo.filterReview",
  all: "admin.todo.filterAll",
};

function KindPill({ state, isToReview }: { state: ContentState; isToReview: boolean }) {
  const { t } = useI18n();
  if (isToReview) {
    return (
      <span className="admin-pill admin-pill--late">
        <RefreshCw aria-hidden />
        {t("admin.todo.stateToReview")}
      </span>
    );
  }
  if (state === "present") {
    return (
      <span className="admin-pill admin-pill--ok">
        <Check aria-hidden />
        {t("admin.todo.statePresent")}
      </span>
    );
  }
  if (state === "verifiedNone") {
    return (
      <span className="admin-pill admin-pill--never">
        <Minus aria-hidden />
        {t("admin.todo.stateVerified")}
      </span>
    );
  }
  return (
    <span className="admin-pill admin-pill--late">
      <CircleDashed aria-hidden />
      {t("admin.todo.stateMissing")}
    </span>
  );
}

interface VerifyDialogProps {
  title: AdminTitle | null;
  onClose: () => void;
  onSave: (titleId: string, topics: ReviewTopic[]) => Promise<boolean>;
}

function VerifyDialog({ title, onClose, onSave }: VerifyDialogProps) {
  const { t } = useI18n();
  const [checked, setChecked] = useState<ReviewTopic[]>([]);
  // The options and the starting ticks belong to the title the dialog was opened for.
  const [openedFor, setOpenedFor] = useState<AdminTitle | null>(null);
  if (title !== openedFor) {
    setOpenedFor(title);
    setChecked(title ? VERIFIABLE.filter((kind) => title.content[kind] === "verifiedNone") : []);
  }
  const options = title ? VERIFIABLE.filter((kind) => title.content[kind] !== "present") : [];

  const toggle = (kind: ReviewTopic) =>
    setChecked((current) =>
      current.includes(kind) ? current.filter((item) => item !== kind) : [...current, kind],
    );

  return (
    <Modal
      isOpen={title !== null}
      title={t("admin.todo.verifyTitle")}
      showClose={false}
      onClose={onClose}
    >
      {title && (
        <>
          <p lang="en">{title.name}</p>
          <p className="admin-note">{t("admin.todo.verifyNote")}</p>
          <ChoiceGroup legend={t("admin.todo.verifyLegend")} columns={2}>
            {options.map((kind) => (
              <Choice
                key={kind}
                type="checkbox"
                checked={checked.includes(kind)}
                onChange={() => toggle(kind)}
              >
                {t(KIND_LABEL[kind])}
              </Choice>
            ))}
          </ChoiceGroup>
          <div className="dialog__actions">
            <button type="button" className="btn btn--soft" onClick={onClose}>
              {t("common.cancel")}
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={async () => {
                if (await onSave(title.id, checked)) onClose();
              }}
            >
              {t("admin.todo.save")}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

interface TodoRowProps {
  title: AdminTitle;
  onReviewGuide: (titleId: string) => void;
  onVerify: (title: AdminTitle) => void;
}

function TodoRow({ title, onReviewGuide, onVerify }: TodoRowProps) {
  const i18n = useI18n();
  const { t, formatDate } = i18n;
  const [copyState, setCopyState] = useState<"idle" | "done" | "error">("idle");
  const [template, setTemplate] = useState("");
  const timer = useRef<number>(undefined);
  const templateId = useId();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const text = buildContentTemplate(title);
  const canVerify = VERIFIABLE.some((kind) => title.content[kind] !== "present");
  const date = title.releaseDate ? formatDate(title.releaseDate) : title.release;

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("done");
      timer.current = window.setTimeout(() => setCopyState("idle"), COPIED_MS);
    } catch {
      setTemplate(text);
      setCopyState("error");
    }
  };

  return (
    <li className="admin-row candidate">
      <div className="candidate__head">
        <strong className="candidate__title" lang="en">
          {title.name}
        </strong>
        {title.guideToReview && (
          <span className="admin-pill admin-pill--late">
            <RefreshCw aria-hidden />
            {t("admin.todo.guideToReview")}
          </span>
        )}
      </div>
      <p className="admin-note candidate__meta">
        {[
          t(typeLabelKey(title.type, title.note)),
          t("admin.todo.releasedOn", { date }),
          t(`catalog.phases.${title.phase}`),
        ].join(" · ")}
      </p>
      {title.guideToReview && <p className="admin-note">{t("admin.todo.guideNote")}</p>}
      <div className="adm-kinds">
        {CONTENT_KINDS.map((kind) => (
          <div key={kind} className="adm-kind">
            <span className="adm-kind__label">{t(KIND_LABEL[kind])}</span>
            <KindPill
              state={title.content[kind]}
              isToReview={kind === "guide" && title.guideToReview}
            />
          </div>
        ))}
      </div>
      <div className="candidate__actions">
        {title.guideToReview && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => onReviewGuide(title.id)}
          >
            <Check aria-hidden />
            {t("admin.todo.reviewed")}
          </button>
        )}
        <a className="btn btn--soft" href={titlePath(title.id)}>
          {t("admin.todo.open")}
          <Maximize2 aria-hidden />
        </a>
        {text && (
          <button
            type="button"
            className={`btn ${title.guideToReview ? "btn--soft" : "btn--primary"}`}
            aria-describedby={copyState === "error" ? templateId : undefined}
            onClick={copy}
          >
            {copyState === "done" ? <Check aria-hidden /> : <Copy aria-hidden />}
            {t(copyState === "done" ? "admin.todo.templateCopied" : "admin.todo.copyTemplate")}
          </button>
        )}
        {canVerify && (
          <button type="button" className="btn btn--text" onClick={() => onVerify(title)}>
            <ListChecks aria-hidden />
            {t("admin.todo.verify")}
          </button>
        )}
      </div>
      <p role="status" className={copyState === "error" ? "candidate__error" : "visually-hidden"}>
        {copyState === "done" && t("admin.todo.templateCopied")}
        {copyState === "error" && t("admin.todo.copyError")}
      </p>
      {copyState === "error" && (
        <div className="snippet-panel">
          <pre id={templateId} tabIndex={0}>
            <code>{template}</code>
          </pre>
        </div>
      )}
    </li>
  );
}

interface ContentTodoSectionProps {
  titles: AdminTitle[];
  onVerify: (titleId: string, topics: ReviewTopic[]) => Promise<boolean>;
  onReviewGuide: (titleId: string) => Promise<boolean>;
}

export function ContentTodoSection({ titles, onVerify, onReviewGuide }: ContentTodoSectionProps) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<TodoFilter>("todo");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [verifying, setVerifying] = useState<AdminTitle | null>(null);

  const counts: Record<TodoFilter, number> = {
    todo: filterTodoTitles(titles, "todo").length,
    review: filterTodoTitles(titles, "review").length,
    all: filterTodoTitles(titles, "all").length,
  };
  const rows = filterTodoTitles(titles, filter);

  return (
    <AdminQueue
      id="da-completare"
      title={t("admin.todo.heading")}
      context={t("admin.todo.summary", { count: counts.todo, total: counts.all })}
      count={counts.todo}
    >
      <p>{t("admin.todo.intro")}</p>
      <ChoiceGroup legend={t("admin.todo.filterLegend")} columns={3}>
        {FILTERS.map((item) => (
          <Choice
            key={item}
            type="radio"
            name="todo-filter"
            checked={filter === item}
            onChange={() => {
              setFilter(item);
              setShown(PAGE_SIZE);
            }}
          >
            {t(FILTER_LABEL[item], { count: counts[item] })}
          </Choice>
        ))}
      </ChoiceGroup>
      {rows.length === 0 ? (
        <div className="candidates__empty">
          <span className="candidates__empty-icon" aria-hidden="true">
            <Check />
          </span>
          <div className="candidates__empty-text">
            <p>
              {t(filter === "review" ? "admin.todo.emptyReview" : "admin.todo.emptyTodo", {
                count: counts.all,
              })}
            </p>
          </div>
        </div>
      ) : (
        <>
          <ul className="candidates__list">
            {rows.slice(0, shown).map((title) => (
              <TodoRow
                key={title.id}
                title={title}
                onReviewGuide={(id) => void onReviewGuide(id)}
                onVerify={setVerifying}
              />
            ))}
          </ul>
          {rows.length > shown && (
            <button
              type="button"
              className="btn btn--soft"
              onClick={() => setShown(shown + PAGE_SIZE)}
            >
              {t("admin.todo.more")}
            </button>
          )}
        </>
      )}
      <VerifyDialog title={verifying} onClose={() => setVerifying(null)} onSave={onVerify} />
    </AdminQueue>
  );
}
