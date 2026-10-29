import { Check, Code, Copy, ExternalLink } from "lucide-react";
import { useId, useState } from "react";
import { buildCatalogSnippet, type CatalogCandidate } from "../../../../../shared/catalogCandidate";
import { useI18n } from "../../../../i18n/useI18n";
import { todayIso } from "../../../planner/utils/releases";
import { tmdbUrl } from "../../services/adminService";

function SnippetPanel({ candidate }: { candidate: CatalogCandidate }) {
  const { t } = useI18n();
  const [isCopied, setIsCopied] = useState(false);
  const snippet = buildCatalogSnippet(candidate, todayIso());
  const text = `${snippet.catalogEntry}\n${snippet.tmdbRef}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <div className="snippet-panel">
      <p>{t("admin.candidates.codeIntro")}</p>
      <p>{t("admin.candidates.catalogLabel")}</p>
      <pre tabIndex={0} role="region" aria-label={t("admin.candidates.catalogLabel")}>
        <code>{snippet.catalogEntry}</code>
      </pre>
      <p>{t("admin.candidates.refLabel")}</p>
      <pre tabIndex={0} role="region" aria-label={t("admin.candidates.refLabel")}>
        <code>{snippet.tmdbRef}</code>
      </pre>
      <p>{t("admin.candidates.afterNote")}</p>
      <button type="button" className="btn btn--soft" onClick={copy}>
        {isCopied ? <Check aria-hidden /> : <Copy aria-hidden />}
        {t("admin.candidates.copy")}
      </button>
      <p role="status">{isCopied ? t("admin.candidates.copied") : ""}</p>
    </div>
  );
}

interface CandidateItemProps {
  candidate: CatalogCandidate;
  onDismiss: (key: string) => void;
}

function CandidateItem({ candidate, onDismiss }: CandidateItemProps) {
  const { t, formatDate } = useI18n();
  const [isCodeShown, setIsCodeShown] = useState(false);
  const panelId = useId();

  return (
    <li className="candidate">
      <strong>{candidate.title}</strong> ·{" "}
      {t(candidate.kind === "season" ? "admin.newSeason" : "admin.newTitle")}
      {candidate.releaseDate && ` · ${formatDate(candidate.releaseDate)}`}
      <div className="candidate__actions">
        <button
          type="button"
          className="btn btn--soft"
          aria-expanded={isCodeShown}
          aria-controls={panelId}
          onClick={() => setIsCodeShown(!isCodeShown)}
        >
          <Code aria-hidden />
          {isCodeShown ? t("admin.candidates.hideCode") : t("admin.candidates.generate")}
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
        <button type="button" className="btn btn--text" onClick={() => onDismiss(candidate.key)}>
          {t("admin.dismiss")}
        </button>
      </div>
      <div id={panelId} hidden={!isCodeShown}>
        {isCodeShown && <SnippetPanel candidate={candidate} />}
      </div>
    </li>
  );
}

interface CandidatesSectionProps {
  candidates: CatalogCandidate[];
  onDismiss: (key: string) => void;
}

export function CandidatesSection({ candidates, onDismiss }: CandidatesSectionProps) {
  const { t } = useI18n();
  const headingId = useId();

  return (
    <section className="candidates" aria-labelledby={headingId}>
      <h2 id={headingId}>{t("admin.heading")}</h2>
      <p>{t("admin.intro")}</p>
      {candidates.length === 0 ? (
        <p>{t("admin.candidates.empty")}</p>
      ) : (
        <ul className="candidates__list">
          {candidates.map((candidate) => (
            <CandidateItem key={candidate.key} candidate={candidate} onDismiss={onDismiss} />
          ))}
        </ul>
      )}
    </section>
  );
}
