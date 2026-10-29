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
    <Modal isOpen={isOpen} title={titleName} titleLang="en" size="lg" onClose={onClose}>
      <TitleDetailsPanel titleId={titleId} />
    </Modal>
  );
}
