import { useState } from "react";
import { Button } from "../../../../components/ui/Button/Button";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { useI18n } from "../../../../i18n/useI18n";
import type { ConflictChoice, DeviceConflict } from "../../services/progressSync";

interface MergeChoiceDialogProps {
  conflict: DeviceConflict | null;
  onResolve: (choice: ConflictChoice) => Promise<void>;
}

// Asked once after signing in, when the device and the account each have titles the other lacks.
export function MergeChoiceDialog({ conflict, onResolve }: MergeChoiceDialogProps) {
  const { t } = useI18n();
  const [choice, setChoice] = useState<ConflictChoice>("merge");
  const [isPending, setIsPending] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  if (!conflict) return null;

  const options: { value: ConflictChoice; title: string; hint: string }[] = [
    {
      value: "merge",
      title: t("merge.optMerge"),
      hint: t("merge.optMergeHint", { result: conflict.cloud.length + conflict.onlyLocal.length }),
    },
    {
      value: "cloud",
      title: t("merge.optCloud"),
      hint: t("merge.optCloudHint", { onlyLocal: conflict.onlyLocal.length }),
    },
    {
      value: "device",
      title: t("merge.optDevice"),
      hint: t("merge.optDeviceHint", { onlyCloud: conflict.onlyCloud.length }),
    },
  ];
  const picked = options.find((option) => option.value === choice) ?? options[0];

  const confirm = async () => {
    setIsPending(true);
    setHasFailed(false);
    try {
      await onResolve(choice);
    } catch {
      setHasFailed(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal
      isOpen={!isClosed}
      title={t("merge.title")}
      showClose={false}
      onClose={() => !isPending && setIsClosed(true)}
    >
      <p>{t("merge.body", { local: conflict.local.length, cloud: conflict.cloud.length })}</p>
      <div className="merge-choice" role="radiogroup" aria-label={t("merge.title")}>
        {options.map((option) => (
          <label key={option.value} className="merge-choice__option">
            <input
              type="radio"
              name="merge-choice"
              value={option.value}
              checked={choice === option.value}
              disabled={isPending}
              onChange={() => setChoice(option.value)}
            />
            <span className="merge-choice__text">
              <strong>
                {option.title}
                {option.value === "merge" && (
                  <span className="merge-choice__badge">{t("merge.recommended")}</span>
                )}
              </strong>
              <span>{option.hint}</span>
            </span>
          </label>
        ))}
      </div>
      {hasFailed && <p role="alert">{t("merge.error")}</p>}
      <Button
        variant={choice === "merge" ? "primary" : "danger"}
        size="lg"
        isLoading={isPending}
        loadingLabel={t("merge.pending")}
        onClick={() => void confirm()}
      >
        {choice === "merge" ? t("merge.continue") : picked.title}
      </Button>
    </Modal>
  );
}
