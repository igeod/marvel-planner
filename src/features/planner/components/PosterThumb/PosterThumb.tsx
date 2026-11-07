import { PosterImage } from "../../../../components/ui/PosterImage";
import { useI18n } from "../../../../i18n/useI18n";
import { useTitleDetails } from "../../hooks/useTitleDetails";
import { posterUrl } from "../../utils/format";

interface PosterThumbProps {
  titleId: string;
  isLarge: boolean;
}

export function PosterThumb({ titleId, isLarge }: PosterThumbProps) {
  const { t } = useI18n();
  const state = useTitleDetails(titleId);
  const posterPath = state.status === "ready" ? state.details.posterPath : null;
  const name = state.status === "ready" ? state.details.name : "";

  return (
    <div className="poster-thumb">
      <PosterImage
        src={posterPath ? posterUrl(posterPath, isLarge ? "w342" : "w154") : null}
        alt={t("details.posterAlt", { name })}
        isFetching={state.status === "loading"}
        showText={isLarge}
      />
    </div>
  );
}
