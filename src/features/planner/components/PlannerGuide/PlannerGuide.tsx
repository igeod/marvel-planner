import { useI18n } from "../../../../i18n/useI18n";

export function PlannerGuide() {
  const { t } = useI18n();

  return (
    <section className="planner-guide card" aria-labelledby="guide-title">
      <h2 id="guide-title" className="planner-guide__title">
        {t("planner.guide.title")}
      </h2>
      <div className="planner-guide__items">
        <div>
          <h3>{t("planner.guide.orderTerm")}</h3>
          <p>{t("planner.guide.orderText")}</p>
        </div>
        <div>
          <h3>{t("planner.guide.alternateTerm")}</h3>
          <p>{t("planner.guide.alternateText")}</p>
        </div>
      </div>
    </section>
  );
}
