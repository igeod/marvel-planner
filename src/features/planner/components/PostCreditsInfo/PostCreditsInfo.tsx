import { MissingNote } from "../MissingNote";
import { SpoilerBox } from "../../../../components/ui/SpoilerBox";
import { useI18n } from "../../../../i18n/useI18n";
import { getPostCredits } from "../../data/postCredits";

interface PostCreditsInfoProps {
  titleId: string;
}

export function PostCreditsInfo({ titleId }: PostCreditsInfoProps) {
  const { t, language } = useI18n();

  const info = getPostCredits(titleId);
  if (!info) {
    return (
      <SpoilerBox
        className="spoiler-box--credits"
        title={t("postCredits.heading")}
        intro={<MissingNote tone="dark">{t("details.missing.credits")}</MissingNote>}
      />
    );
  }

  const { scenes } = info;

  return (
    <SpoilerBox
      className="spoiler-box--credits"
      title={t("postCredits.heading")}
      spoiler={
        scenes.length > 0
          ? {
              showLabel: t("postCredits.show"),
              hideLabel: t("postCredits.hide"),
              warning: t("postCredits.warning"),
            }
          : undefined
      }
      intro={
        scenes.length === 0 ? <p className="spoiler-note">{t("postCredits.none")}</p> : undefined
      }
    >
      {scenes.length > 0 && (
        <ol className="spoiler-list">
          {scenes.map((scene, index) => (
            <li key={index} className="spoiler-item">
              <p>{scene.description[language]}</p>
            </li>
          ))}
        </ol>
      )}
    </SpoilerBox>
  );
}
