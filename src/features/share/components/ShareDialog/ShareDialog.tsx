import { Copy, Download, Link2Off, RefreshCw, Share2 } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useId, useState } from "react";
import type { ShareDuration, ShareLinkInfo } from "../../../../../shared/share";
import { Button } from "../../../../components/ui/Button/Button";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Status } from "../../../../components/ui/Status/Status";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import type { Progress } from "../../../planner/types";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAuthDialog } from "../../../auth/hooks/useAuthDialog";
import { useShareLink } from "../../hooks/useShareLink";
import { renderShareImage } from "../../utils/shareImage";
import { shareUrl } from "../../utils/shareUrl";

const IMAGE_FILE_NAME = "marvel-planner.png";

const DURATION_OPTIONS: { value: string; days: ShareDuration; labelKey: TranslationKey }[] = [
  { value: "7", days: 7, labelKey: "share.days7" },
  { value: "30", days: 30, labelKey: "share.days30" },
  { value: "never", days: null, labelKey: "share.never" },
];

const daysOf = (value: string): ShareDuration =>
  DURATION_OPTIONS.find((option) => option.value === value)?.days ?? 30;

function canShareFiles(): boolean {
  if (typeof navigator.canShare !== "function") return false;
  return navigator.canShare({ files: [new File([], IMAGE_FILE_NAME, { type: "image/png" })] });
}

function DurationSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { t } = useI18n();
  const id = useId();

  return (
    <div className="field">
      <label htmlFor={id}>{t("share.duration")}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {DURATION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {t(option.labelKey)}
          </option>
        ))}
      </select>
    </div>
  );
}

interface LinkDetailsProps {
  link: ShareLinkInfo;
  name: string;
  progress: Progress;
}

function LinkDetails({ link, name, progress }: LinkDetailsProps) {
  const { t, formatDate } = useI18n();
  const inputId = useId();
  const url = shareUrl(link.code);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  // Reports the real outcome of the last copy or share, never an expected one.
  const [outcome, setOutcome] = useState("");
  const [hasImageFailed, setHasImageFailed] = useState(false);

  useEffect(() => {
    let isActive = true;
    QRCode.toDataURL(shareUrl(link.code), { margin: 1, width: 512, errorCorrectionLevel: "M" })
      .then((dataUrl) => isActive && setQrDataUrl(dataUrl))
      .catch(() => isActive && setQrDataUrl(null));
    return () => {
      isActive = false;
    };
  }, [link.code]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setOutcome(t("share.copied"));
    } catch {
      setOutcome(t("share.copyFailed", { url }));
    }
  };

  const createImage = async (): Promise<Blob | null> => {
    if (!qrDataUrl) return null;
    setHasImageFailed(false);
    try {
      return await renderShareImage({
        heading: t("share.image.heading", { name }),
        progressLabel: t("planner.completed"),
        scan: t("share.image.scan"),
        done: progress.done,
        total: progress.total,
        qrDataUrl,
      });
    } catch {
      setHasImageFailed(true);
      return null;
    }
  };

  const downloadImage = async () => {
    const blob = await createImage();
    if (!blob) return;
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = IMAGE_FILE_NAME;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  };

  const shareImage = async () => {
    const blob = await createImage();
    if (!blob) return;
    try {
      await navigator.share({
        files: [new File([blob], IMAGE_FILE_NAME, { type: "image/png" })],
        title: t("share.shareTitle"),
        url,
      });
      setOutcome(t("share.shared"));
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setHasImageFailed(true);
    }
  };

  return (
    <>
      <div className="share-link">
        <label htmlFor={inputId}>{t("share.linkLabel")}</label>
        <input id={inputId} type="text" readOnly value={url} onFocus={(e) => e.target.select()} />
        <button type="button" className="btn btn--soft" onClick={copy}>
          <Copy aria-hidden />
          {t("share.copy")}
        </button>
        <Status>{outcome}</Status>
      </div>

      <p>
        {link.expiresAt
          ? t("share.expires", { date: formatDate(link.expiresAt.slice(0, 10)) })
          : t("share.noExpiry")}
      </p>

      {qrDataUrl && (
        <img className="share-qr" src={qrDataUrl} alt={t("share.qrAlt")} width={256} height={256} />
      )}

      <section className="share-image" aria-label={t("share.imageHeading")}>
        <h3>{t("share.imageHeading")}</h3>
        {hasImageFailed && <p role="alert">{t("share.imageError")}</p>}
        <button
          type="button"
          className="btn btn--soft"
          disabled={!qrDataUrl}
          onClick={downloadImage}
        >
          <Download aria-hidden />
          {t("share.downloadImage")}
        </button>
        {canShareFiles() && (
          <button
            type="button"
            className="btn btn--soft"
            disabled={!qrDataUrl}
            onClick={shareImage}
          >
            <Share2 aria-hidden />
            {t("share.shareImage")}
          </button>
        )}
      </section>
    </>
  );
}

function ShareManager({ name, progress }: { name: string; progress: Progress }) {
  const { t } = useI18n();
  const { status, link, isBusy, hasFailed, save, disable } = useShareLink();
  const [duration, setDuration] = useState("30");

  if (status === "loading") return <p role="status">{t("share.loading")}</p>;
  if (status === "error") return <p role="alert">{t("share.error")}</p>;

  return (
    <div>
      {hasFailed && <p role="alert">{t("share.error")}</p>}

      {link && <LinkDetails link={link} name={name} progress={progress} />}

      <DurationSelect value={duration} onChange={setDuration} />

      {link ? (
        <div>
          <Button
            variant="soft"
            icon={<RefreshCw aria-hidden />}
            isLoading={isBusy}
            loadingLabel={t("share.regenerating")}
            onClick={() => save(daysOf(duration), true)}
          >
            {t("share.regenerate")}
          </Button>
          <p>{t("share.regenerateHint")}</p>
          <Button
            variant="text"
            icon={<Link2Off aria-hidden />}
            isLoading={isBusy}
            loadingLabel={t("share.disabling")}
            onClick={disable}
          >
            {t("share.disable")}
          </Button>
        </div>
      ) : (
        <Button
          variant="primary"
          size="lg"
          isLoading={isBusy}
          loadingLabel={t("share.creating")}
          onClick={() => save(daysOf(duration), false)}
        >
          {t("share.create")}
        </Button>
      )}
    </div>
  );
}

function ShareContent({ progress, onClose }: { progress: Progress; onClose: () => void }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const { open } = useAuthDialog();

  if (!user) {
    return (
      <div>
        <p>{t("share.loginRequired")}</p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            onClose();
            open("login");
          }}
        >
          {t("share.loginButton")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <p>{t("share.intro")}</p>
      <ShareManager name={user.name} progress={progress} />
    </>
  );
}

interface ShareDialogProps {
  isOpen: boolean;
  progress: Progress;
  onClose: () => void;
}

export function ShareDialog({ isOpen, progress, onClose }: ShareDialogProps) {
  const { t } = useI18n();

  return (
    <Modal isOpen={isOpen} title={t("share.title")} onClose={onClose}>
      <ShareContent progress={progress} onClose={onClose} />
    </Modal>
  );
}
