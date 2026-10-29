import { InfoTip } from "../../../../components/ui/InfoTip";
import { MissingNote } from "../MissingNote";
import { SpoilerBox } from "../../../../components/ui/SpoilerBox";
import { useI18n } from "../../../../i18n/useI18n";
import { getKeyScenes } from "../../data/keyScenes";

interface KeyScenesProps {
  titleId: string;
}

export function KeyScenes({ titleId }: KeyScenesProps) {
  const { t, language } = useI18n();

  const scenes = getKeyScenes(titleId);
  if (scenes.length === 0) {
    return (
      <SpoilerBox
        className="spoiler-box--scenes"
        title={t("details.keyScenes.heading")}
        intro={<MissingNote tone="dark">{t("details.missing.scenes")}</MissingNote>}
      />
    );
  }

  return (
    <SpoilerBox
      className="spoiler-box--scenes"
      title={t("details.keyScenes.heading")}
      headerExtra={
        <InfoTip label={t("details.keyScenes.source")}>{t("details.keyScenes.editorial")}</InfoTip>
      }
      spoiler={{
        showLabel: t("details.keyScenes.show"),
        hideLabel: t("details.keyScenes.hide"),
        warning: t("details.keyScenes.warning"),
      }}
    >
      <ul className="spoiler-list spoiler-list--grid">
        {scenes.map((scene) => (
          <li key={scene.en} className="spoiler-item">
            <span>{scene[language]}</span>
          </li>
        ))}
      </ul>
    </SpoilerBox>
  );
}
