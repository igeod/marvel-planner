import { Send } from "lucide-react";
import { useState } from "react";
import { SUGGESTION_MAX_LENGTH } from "../../../../../shared/suggestions";
import { Button } from "../../../../components/ui/Button/Button";
import { TextArea } from "../../../../components/ui/Field/Field";
import { FormError } from "../../../../components/ui/FormError/FormError";
import { useToast } from "../../../../components/ui/Toast/useToast";
import { useI18n } from "../../../../i18n/useI18n";
import { ApiError } from "../../../../lib/apiClient";
import type { SuggestTarget } from "../../context/SuggestContext";
import { draftKey } from "../../draftKey";
import { SECTION_KEYS } from "../../sectionKeys";
import { sendSuggestion } from "../../services/suggestService";

// What was written and not sent, kept until the page is reloaded (no storage, no confirmation).
const drafts = new Map<string, string>();

type Failure = "send" | "rate" | null;

export function SuggestForm({ target, onDone }: { target: SuggestTarget; onDone: () => void }) {
  const { t } = useI18n();
  const toast = useToast();
  const key = draftKey(target);
  const [text, setText] = useState(drafts.get(key) ?? "");
  const [isPending, setIsPending] = useState(false);
  const [failure, setFailure] = useState<Failure>(null);
  const canSend = text.trim().length > 0 && !isPending;

  const submit = async () => {
    if (!canSend) return;
    setIsPending(true);
    setFailure(null);
    try {
      await sendSuggestion({ ...target, text: text.trim() });
      drafts.delete(key);
      onDone();
      toast.show({ id: "suggest", tone: "info", title: t("suggest.thanks") });
    } catch (error) {
      setFailure(error instanceof ApiError && error.status === 429 ? "rate" : "send");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <p className="suggest__context">
        {t(SECTION_KEYS[target.section])}
        {target.item && (
          <>
            {" · «"}
            <span lang="en">{target.item}</span>
            {"»"}
          </>
        )}
      </p>
      <TextArea
        label={t("suggest.field")}
        name="suggestion"
        value={text}
        maxLength={SUGGESTION_MAX_LENGTH}
        onChange={(next) => {
          setText(next);
          if (next.trim()) drafts.set(key, next);
          else drafts.delete(key);
        }}
        hint={t("suggest.placeholder")}
        disabled={isPending}
      />
      {failure === "rate" && (
        <FormError tone="rate" title={t("suggest.rateTitle")}>
          {t("suggest.rate")}
        </FormError>
      )}
      {failure === "send" && <FormError>{t("suggest.error")}</FormError>}
      <div className="dialog__actions">
        <Button
          type="submit"
          variant="primary"
          icon={<Send aria-hidden />}
          isLoading={isPending}
          aria-disabled={!canSend || undefined}
        >
          {t("suggest.send")}
        </Button>
      </div>
    </form>
  );
}
