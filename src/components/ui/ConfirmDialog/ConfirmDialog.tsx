import { CircleAlert } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button/Button";
import { TextField } from "../Field/Field";
import { useDialog } from "../useDialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  // When set, the confirm button stays inactive until this exact text is typed.
  requiredText?: string;
  requiredLabel?: string;
  // Optional extras for confirmations that can fail or take a moment; without them the dialog is unchanged.
  tone?: "warning" | "danger";
  icon?: ReactNode;
  confirmVariant?: "primary" | "danger";
  isPending?: boolean;
  pendingLabel?: string;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  requiredText,
  requiredLabel,
  tone,
  icon,
  confirmVariant = "primary",
  isPending,
  pendingLabel,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useDialog(isOpen);
  const titleId = useId();
  const messageId = useId();
  const [typed, setTyped] = useState("");
  const isReady = requiredText === undefined || typed === requiredText;

  const finish = (action: () => void) => () => {
    setTyped("");
    action();
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      className="dialog dialog--confirm"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={(event) => {
        event.preventDefault();
        if (!isPending) finish(onCancel)();
      }}
    >
      <div className="dialog__body">
        {tone ? (
          <div className="dialog__head">
            <span className={`dialog__icon dialog__icon--${tone}`} aria-hidden="true">
              {icon}
            </span>
            <h2 id={titleId}>{title}</h2>
          </div>
        ) : (
          <h2 id={titleId}>{title}</h2>
        )}
        <p id={messageId}>{message}</p>
        {requiredText !== undefined && (
          <TextField
            label={requiredLabel ?? ""}
            name="confirmation"
            value={typed}
            onChange={setTyped}
          />
        )}
        {error && (
          <p role="alert" className="dialog__error">
            <CircleAlert aria-hidden />
            {error}
          </p>
        )}
        <div className="dialog__actions">
          <Button
            variant="soft"
            autoFocus
            aria-disabled={isPending || undefined}
            onClick={() => !isPending && finish(onCancel)()}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            isLoading={isPending}
            loadingLabel={pendingLabel}
            aria-disabled={!isReady || Boolean(isPending)}
            onClick={() => isReady && !isPending && finish(onConfirm)()}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
