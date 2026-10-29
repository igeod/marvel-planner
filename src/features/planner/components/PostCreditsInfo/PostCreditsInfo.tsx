import { SpoilerBox } from "../../../../components/ui/SpoilerBox";
import type { TranslationKey } from "../../../../i18n/types";
import { useI18n } from "../../../../i18n/useI18n";
import { getPostCredits, type ScenePosition } from "../../data/postCredits";

const POSITION_KEYS: Record<ScenePosition, TranslationKey> = {
  before: "postCredits.positions.before",
  mid: "postCredits.positions.mid",
  credits: "postCredits.positions.credits",
  end: "postCredits.positions.end",
};

interface PostCreditsInfoProps {
  titleId: string;
}

export function PostCreditsInfo({ titleId }: PostCreditsInfoProps) {
  const { t, language } = useI18n();

  const info = getPostCredits(titleId);
  if (!info) return null;

  const { scenes, note } = info;
  const creditScenes = scenes.filter((scene) => scene.position !== "before");
  const hasLateScene = creditScenes.some((scene) => scene.position !== "mid");

  const summaryKey: TranslationKey =
    creditScenes.length === 0
      ? scenes.length === 0
        ? "postCredits.none"
        : "postCredits.noneBefore"
      : hasLateScene
        ? "postCredits.tipEnd"
        : "postCredits.tipMid";

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
        <p className="spoiler-note">
          {t(summaryKey)}
          {note && ` ${note[language]}`}
        </p>
      }
    >
      {scenes.length > 0 && (
        <ol className="spoiler-list">
          {scenes.map((scene, index) => (
            <li key={index} className="spoiler-item">
              <p>
                <strong>{t(POSITION_KEYS[scene.position])}</strong>
                <small>{scene.description[language]}</small>
              </p>
            </li>
          ))}
        </ol>
      )}
    </SpoilerBox>
  );
}
