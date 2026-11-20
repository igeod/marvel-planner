import { ArrowUpRight, Coffee } from "lucide-react";
import { SITE } from "../../../app/site";
import { useI18n } from "../../../i18n/useI18n";

export function CoffeeLink() {
  const { t } = useI18n();

  if (!SITE.coffeeUrl) return null;

  return (
    <p className="coffee-card">
      <a href={SITE.coffeeUrl} target="_blank" rel="noreferrer">
        {/* The place for the picture, when it arrives. */}
        <span className="coffee-card__art" aria-hidden>
          <Coffee />
        </span>
        <span className="coffee-card__text">{t("footer.coffee")}</span>
        <span className="coffee-card__go" aria-hidden>
          <ArrowUpRight />
        </span>
      </a>
    </p>
  );
}
