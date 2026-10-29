import { Play, Clapperboard } from "lucide-react";
import { useState } from "react";
import type { Trailer } from "../../../../../shared/titleDetails";
import { Modal } from "../../../../components/ui/Modal";
import { useI18n } from "../../../../i18n/useI18n";

const EMBED_URL = "https://www.youtube-nocookie.com/embed";

function TrailerPlayer({ trailer, titleName }: { trailer: Trailer; titleName: string }) {
  const { t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isPlaying) {
    return (
      <div className="trailer-notice">
        <p>{t("details.trailer.notice")}</p>
        <button
          type="button"
          className="btn btn--primary btn--lg"
          onClick={() => setIsPlaying(true)}
        >
          <Play aria-hidden />
          {t("details.trailer.play")}
        </button>
      </div>
    );
  }

  return (
    <iframe
      className="trailer-frame"
      src={`${EMBED_URL}/${encodeURIComponent(trailer.key)}?autoplay=1&rel=0`}
      title={t("details.trailer.frameTitle", { name: titleName })}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}

interface TrailerButtonProps {
  trailer: Trailer;
  titleName: string;
}

export function TrailerButton({ trailer, titleName }: TrailerButtonProps) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn--primary"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        <Clapperboard aria-hidden />
        {t("details.trailer.open")}
      </button>
      <Modal
        isOpen={isOpen}
        title={t("details.trailer.title", { name: titleName })}
        size="lg"
        onClose={() => setIsOpen(false)}
      >
        <TrailerPlayer trailer={trailer} titleName={titleName} />
      </Modal>
    </>
  );
}
