import { useState } from "react";
import type { SharedPlanner } from "../../../../../shared/share";
import artShared from "../../../../assets/err-shared.webp";
import { Button } from "../../../../components/ui/Button/Button";
import { StateBox } from "../../../../components/ui/StateBox/StateBox";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { useI18n } from "../../../../i18n/useI18n";
import { ProgressMeter } from "../../../../components/ui/ProgressMeter/ProgressMeter";
import type { ProgressStorage } from "../../../planner/types";
import { planImport } from "../../../planner/utils/importPlan";
import { useSharedPlanner } from "../../hooks/useSharedPlanner";

export type ImportMode = "merge" | "replace";

interface ImportPreviewProps {
  planner: SharedPlanner;
  watched: ReadonlySet<string>;
  knownIds: ReadonlySet<string>;
  storage: ProgressStorage;
  isLoading: boolean;
  onImport: (ids: ReadonlySet<string>, mode: ImportMode) => void;
  onClose: () => void;
}

function ImportPreview({
  planner,
  watched,
  knownIds,
  storage,
  isLoading,
  onImport,
  onClose,
}: ImportPreviewProps) {
  const { t } = useI18n();
  const [isConfirmingReplace, setIsConfirmingReplace] = useState(false);
  const plan = planImport(watched, planner.titleIds, knownIds);
  const done = plan.incoming.size;
  const total = knownIds.size;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const name = planner.name;
  const lost = plan.lostByReplacing;
  const exit = (
    <Button variant="soft" size="lg" onClick={onClose}>
      {t("import.close")}
    </Button>
  );

  if (done === 0) {
    return (
      <div className="import-preview">
        <p>{t("import.empty", { name })}</p>
        {exit}
      </div>
    );
  }

  return (
    <div className="import-preview">
      <p>{t("import.summary", { name, done, total, percent })}</p>
      <ProgressMeter label={t("planner.completed")} value={done} max={total} />

      {lost === 0 ? (
        // Nothing to lose: merging and replacing give the same planner, so there is one choice.
        <section className="import-preview__choice">
          <p>{t("import.replaceNoLoss", { name })}</p>
          <Button
            variant="primary"
            size="lg"
            disabled={isLoading}
            onClick={() => onImport(plan.incoming, "replace")}
          >
            {t("import.replaceTitle")}
          </Button>
        </section>
      ) : isConfirmingReplace ? (
        <section className="import-preview__choice" aria-labelledby="import-replace-title">
          <h3 id="import-replace-title">{t("import.replaceTitle")}</h3>
          <p>
            <strong>{t("import.replaceAsk", { lost })}</strong>
          </p>
          <p>{t("import.replaceBody", { name, lost })}</p>
          <Button
            variant="danger"
            size="lg"
            disabled={isLoading}
            onClick={() => onImport(plan.incoming, "replace")}
          >
            {t("import.replaceConfirm")}
          </Button>
          <Button variant="soft" size="lg" onClick={() => setIsConfirmingReplace(false)}>
            {t("import.back")}
          </Button>
        </section>
      ) : (
        <>
          <h3>{t("import.heading")}</h3>
          <section className="import-preview__choice">
            <p className="import-preview__recommended">
              <span className="import-preview__badge">{t("import.recommended")}</span>
            </p>
            <p>
              {t("import.mergeBody", {
                name,
                current: watched.size,
                added: plan.gainedByMerging,
                result: plan.merged.size,
              })}
            </p>
            <Button
              variant="primary"
              size="lg"
              disabled={isLoading}
              onClick={() => onImport(plan.merged, "merge")}
            >
              {t("import.mergeTitle")}
            </Button>
          </section>
          <section className="import-preview__choice">
            <p>{t("import.replaceBody", { name, lost })}</p>
            <Button variant="soft" size="lg" onClick={() => setIsConfirmingReplace(true)}>
              {t("import.replaceTitle")}
            </Button>
          </section>
        </>
      )}

      {storage !== "account" && <p>{t("import.anonymousNote")}</p>}
      {exit}
    </div>
  );
}

interface ImportSharedDialogProps {
  code: string;
  watched: ReadonlySet<string>;
  knownIds: ReadonlySet<string>;
  storage: ProgressStorage;
  isLoading: boolean;
  onImport: (ids: ReadonlySet<string>, mode: ImportMode) => void;
  onClose: () => void;
}

function ImportContent({ code, onClose, ...preview }: ImportSharedDialogProps) {
  const { t } = useI18n();
  const state = useSharedPlanner(code);

  if (state.status === "loading") return <p role="status">{t("import.loading")}</p>;

  // Nothing to import: the only way on is to close.
  if (state.status === "notFound") {
    return (
      <StateBox
        layout="dialog"
        role="alert"
        art={<img src={artShared} alt="" aria-hidden width={112} height={112} />}
        title={t("share.invalid.title")}
        actions={
          <Button variant="primary" size="lg" onClick={onClose}>
            {t("common.close")}
          </Button>
        }
      >
        {t("share.invalid.body")}
      </StateBox>
    );
  }

  if (state.status === "error") {
    return (
      <StateBox
        key={state.attempt}
        layout="dialog"
        role="alert"
        art={<img src={artShared} alt="" aria-hidden width={112} height={112} />}
        title={t("share.loadError.title")}
        actions={
          <>
            <Button
              variant="primary"
              size="lg"
              isLoading={state.isRetrying}
              loadingLabel={t("common.loading")}
              onClick={state.retry}
            >
              {t("common.retry")}
            </Button>
            <Button variant="soft" size="lg" onClick={onClose}>
              {t("common.close")}
            </Button>
          </>
        }
      >
        {t("share.loadError.body")}
      </StateBox>
    );
  }

  return <ImportPreview planner={state.planner} onClose={onClose} {...preview} />;
}

export function ImportSharedDialog(props: ImportSharedDialogProps) {
  const { t } = useI18n();

  return (
    <Modal isOpen title={t("import.title")} showClose={false} onClose={props.onClose}>
      <ImportContent {...props} />
    </Modal>
  );
}
