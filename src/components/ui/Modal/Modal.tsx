import { X } from "lucide-react";
import { useEffect, useId, type ReactNode } from "react";
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
  // Content and task popups have the X; decision popups exit through their own text button.
  showClose?: boolean;
  // The heading leaves and enters with the view it names.
  viewMotion?: { leaving: boolean; direction?: "forward" | "back" };
  children: ReactNode;
}

export function Modal({
  isOpen,
  title,
  titleLang,
  onClose,
  titleId: ownTitleId,
  size = "md",
  showClose = true,
  viewMotion,
  children,
}: ModalProps) {
  const { t } = useI18n();
  const dialogRef = useDialog(isOpen);
  const generatedId = useId();
  const titleId = ownTitleId ?? generatedId;
  // The profile dialog draws its own header.
  const isBare = size === "profile";

  // Focus starts on the dialog itself, not on its first control.
  useEffect(() => {
    if (isOpen && isBare) dialogRef.current?.focus();
  }, [isOpen, isBare, dialogRef]);

  return createPortal(
    <dialog
      ref={dialogRef}
      tabIndex={isBare ? -1 : undefined}
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
          <div className="dialog__scroll scroll-y">
            <header className="dialog__header">
              <h2
                key={viewMotion ? title : undefined}
                id={titleId}
                lang={titleLang}
                tabIndex={-1}
                className={viewMotion ? "view-motion" : undefined}
                data-dir={viewMotion?.direction}
                data-phase={viewMotion ? (viewMotion.leaving ? "out" : "in") : undefined}
              >
                {title}
              </h2>
            </header>
            {isOpen && <div className="dialog__body">{children}</div>}
          </div>
          {/* Last in focus order, and fixed: the scroll area is a separate sibling. */}
          {showClose && (
            <button
              type="button"
              className="dialog__close"
              aria-label={t("common.close")}
              onClick={onClose}
            >
              <X aria-hidden />
            </button>
          )}
        </>
      )}
    </dialog>,
    document.body,
  );
}
