import { X } from "lucide-react";
import { useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../../../i18n/useI18n";
import { useDialog } from "../useDialog";

interface ModalProps {
  isOpen: boolean;
  title: string;
  titleLang?: string;
  onClose: () => void;
  // Bare dialogs draw their own heading; this is that heading's id.
  titleId?: string;
  size?: "md" | "lg" | "profile";
  children: ReactNode;
}

export function Modal({
  isOpen,
  title,
  titleLang,
  onClose,
  titleId: ownTitleId,
  size = "md",
  children,
}: ModalProps) {
  const { t } = useI18n();
  const dialogRef = useDialog(isOpen);
  const generatedId = useId();
  const titleId = ownTitleId ?? generatedId;
  // The profile dialog draws its own header.
  const isBare = size === "profile";

  return createPortal(
    <dialog
      ref={dialogRef}
      className={`dialog dialog--${size}`}
      aria-modal="true"
      aria-labelledby={ownTitleId || !isBare ? titleId : undefined}
      aria-label={isBare && !ownTitleId ? title : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {isBare ? (
        isOpen && children
      ) : (
        <>
          <header className="dialog__header">
            <h2 id={titleId} lang={titleLang}>
              {title}
            </h2>
            <button
              type="button"
              className="dialog__close"
              aria-label={t("common.close")}
              onClick={onClose}
            >
              <X aria-hidden />
            </button>
          </header>
          {isOpen && <div className="dialog__body">{children}</div>}
        </>
      )}
    </dialog>,
    document.body,
  );
}
