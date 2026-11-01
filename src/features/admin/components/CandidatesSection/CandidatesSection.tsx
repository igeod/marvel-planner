import { Check, Code, Copy, ExternalLink } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useLocation } from "react-router";
import type { AdminCandidate } from "../../../../../shared/admin";
import { buildCatalogSnippet } from "../../../../../shared/catalogCandidate";
import { useI18n } from "../../../../i18n/useI18n";
import { todayIso } from "../../../planner/utils/releases";
import { tmdbUrl } from "../../services/adminService";

const COPIED_MS = 2000;

type CopyState = "idle" | "done" | "error";

function SnippetPanel({ candidate }: { candidate: AdminCandidate }) {
  const { t } = useI18n();
  const snippet = buildCatalogSnippet(candidate, todayIso());

  return (
    <div className="snippet-panel">
      <p>{t("admin.candidates.catalogLabel")}</p>
      <pre tabIndex={0} role="region" aria-label={t("admin.candidates.catalogLabel")}>
        <code>{snippet.catalogEntry}</code>
      </pre>
      <p>{t("admin.candidates.refLabel")}</p>
      <pre tabIndex={0} role="region" aria-label={t("admin.candidates.refLabel")}>
        <code>{snippet.tmdbRef}</code>
      </pre>
      <p>{t("admin.candidates.afterNote")}</p>
    </div>
  );
}

interface CandidateItemProps {
  candidate: AdminCandidate;
  onDismiss: () => void;
  onCopied: (key: string) => void;
}

function CandidateItem({ candidate, onDismiss, onCopied }: CandidateItemProps) {
  const { t, formatDate } = useI18n();
  const [isCodeShown, setIsCodeShown] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const timer = useRef<number>(undefined);
  const panelId = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    const snippet = buildCatalogSnippet(candidate, todayIso());
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(`${snippet.catalogEntry}\n${snippet.tmdbRef}`);
      setCopyState("done");
      onCopied(candidate.key);
      timer.current = window.setTimeout(() => setCopyState("idle"), COPIED_MS);
    } catch {
      setIsCodeShown(true);
      setCopyState("error");
    }
  };

  const isCopiedBefore = candidate.copiedAt !== null;
  const copyLabel =
    copyState === "done"
      ? t("admin.candidates.copied")
      : t(isCopiedBefore ? "admin.candidates.copyAgain" : "admin.candidates.copySnippet");

  return (
    <li className="admin-row candidate">
      <div className="candidate__head">
        <strong className="candidate__title">{candidate.title}</strong>
        {candidate.copiedAt && (
          <span className="admin-pill admin-pill--ok">
            <Check aria-hidden />
            {t("admin.candidates.alreadyCopied", { date: formatDate(candidate.copiedAt) })}
          </span>
        )}
      </div>
      <p className="muted candidate__meta">
        {t(candidate.kind === "season" ? "admin.newSeason" : "admin.newTitle")}
        {candidate.releaseDate && ` · ${formatDate(candidate.releaseDate)}`}
        {` · ${t("admin.candidates.found", { date: formatDate(candidate.foundAt) })}`}
      </p>
      <div className="candidate__actions">
        <button
          type="button"
          className={`btn candidate__copy ${isCopiedBefore ? "btn--soft" : "btn--primary"}`}
          data-copy={candidate.key}
          onClick={copy}
        >
          {copyState === "done" ? <Check aria-hidden /> : <Copy aria-hidden />}
          {copyLabel}
        </button>
        <a
          className="btn btn--soft"
          href={tmdbUrl(candidate)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink aria-hidden />
          {t("admin.openOnTmdb")}
        </a>
        <button
          type="button"
          className="btn btn--text"
          aria-expanded={isCodeShown}
          aria-controls={panelId}
          onClick={() => setIsCodeShown(!isCodeShown)}
        >
          <Code aria-hidden />
          {isCodeShown ? t("admin.candidates.hideCode") : t("admin.candidates.generate")}
        </button>
        <button type="button" className="btn btn--text" onClick={onDismiss}>
          {t("admin.dismiss")}
        </button>
      </div>
      <p role="status" className={copyState === "error" ? "candidate__error" : "visually-hidden"}>
        {copyState === "done" && t("admin.candidates.copied")}
        {copyState === "error" && t("admin.candidates.copyError")}
      </p>
      <div id={panelId} hidden={!isCodeShown}>
        {isCodeShown && <SnippetPanel candidate={candidate} />}
      </div>
    </li>
  );
}

interface CandidatesSectionProps {
  candidates: AdminCandidate[];
  onDismiss: (key: string) => void;
  onCopied: (key: string) => void;
}

export function CandidatesSection({ candidates, onDismiss, onCopied }: CandidatesSectionProps) {
  const { t } = useI18n();
  const { hash } = useLocation();
  const headingId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const headingNode = useRef<HTMLHeadingElement | null>(null);
  const [announcement, setAnnouncement] = useState("");
  // Where the focus goes once the dismissed row has left the list: the next row's copy button, or the heading.
  const nextFocus = useRef<string | "heading" | null>(null);

  // Arriving from the pending-titles notice puts the focus on this heading (focus() also scrolls to it).
  useEffect(() => {
    if (hash === "#candidati") headingNode.current?.focus();
  }, [hash]);

  useEffect(() => {
    const target = nextFocus.current;
    if (target === null) return;
    nextFocus.current = null;
    if (target === "heading") headingNode.current?.focus();
    else sectionRef.current?.querySelector<HTMLElement>(`[data-copy="${target}"]`)?.focus();
  }, [candidates]);

  const dismiss = (index: number) => {
    const candidate = candidates[index];
    nextFocus.current = candidates[index + 1]?.key ?? "heading";
    setAnnouncement(t("admin.candidates.dismissed", { title: candidate.title }));
    onDismiss(candidate.key);
  };

  return (
    <section id="candidati" className="candidates" aria-labelledby={headingId} ref={sectionRef}>
      <h2 id={headingId} tabIndex={-1} ref={headingNode}>
        {t("admin.heading")}
      </h2>
      {candidates.length === 0 ? (
        <p>{t("admin.candidates.empty")}</p>
      ) : (
        <>
          <p>{t("admin.intro")}</p>
          <ul className="candidates__list">
            {candidates.map((candidate, index) => (
              <CandidateItem
                key={candidate.key}
                candidate={candidate}
                onDismiss={() => dismiss(index)}
                onCopied={onCopied}
              />
            ))}
          </ul>
        </>
      )}
      <p role="status" className="visually-hidden">
        {announcement}
      </p>
    </section>
  );
}
