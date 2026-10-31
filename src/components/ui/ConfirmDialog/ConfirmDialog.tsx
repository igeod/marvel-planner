import { useId, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button";
import { TextField } from "../Field";
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
        finish(onCancel)();
      }}
    >
      <div className="dialog__body">
        <h2 id={titleId}>{title}</h2>
        <p id={messageId}>{message}</p>
        {requiredText !== undefined && (
          <TextField
            label={requiredLabel ?? ""}
            name="confirmation"
            value={typed}
            onChange={setTyped}
          />
        )}
        <div className="dialog__actions">
          <Button variant="soft" autoFocus onClick={finish(onCancel)}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            aria-disabled={!isReady}
            onClick={() => isReady && finish(onConfirm)()}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
