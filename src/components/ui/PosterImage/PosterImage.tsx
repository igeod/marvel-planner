import { ImageOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../../../i18n/useI18n";

interface PosterImageProps {
  src: string | null;
  alt: string;
  isFetching: boolean;
  showText?: boolean;
  // Replaces the default "no poster" line when the missing state needs its own words.
  text?: string;
}

export function PosterImage({ src, alt, isFetching, showText = false, text }: PosterImageProps) {
  const { t } = useI18n();
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const hasFailed = src !== null && failedSrc === src;
  const isMissing = !isFetching && (src === null || hasFailed);
  const isLoading = isFetching || (src !== null && loadedSrc !== src && !hasFailed);
  const canShowImage = !isFetching && src !== null && !hasFailed;

  return (
    <div className="poster-image">
      {canShowImage && (
        <img
          className={`poster-image__img${loadedSrc === src ? "" : " poster-image__img--pending"}`}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
        />
      )}
      {isLoading && (
        <span
          className="poster-image__state poster-image__state--loading"
          role="img"
          aria-label={t("poster.loading")}
        >
          <LoaderCircle aria-hidden />
        </span>
      )}
      {isMissing && (
        <span className="poster-image__state" role="img" aria-label={t("poster.missing")}>
          <ImageOff aria-hidden />
          {showText && <span className="poster-image__text">{text ?? t("poster.none")}</span>}
        </span>
      )}
    </div>
  );
}
