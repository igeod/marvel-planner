import { Modal } from "../../../../components/ui/Modal";
import { TitleDetailsPanel } from "../TitleDetailsPanel";

interface TitleDetailsDialogProps {
  isOpen: boolean;
  titleId: string;
  titleName: string;
  onClose: () => void;
}

export function TitleDetailsDialog({
  isOpen,
  titleId,
  titleName,
  onClose,
}: TitleDetailsDialogProps) {
  return (
    <Modal isOpen={isOpen} title={titleName} size="page" onClose={onClose}>
      <TitleDetailsPanel titleId={titleId} onClose={onClose} />
    </Modal>
  );
}
