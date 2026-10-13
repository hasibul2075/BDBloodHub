import { t } from "../i18n";

function CTA() {
  return (
    <section className="cta-section">
      <div className="container cta-container">
        <div className="cta-content">
          <span className="section-tag">{t("cta_tag")}</span>

          <h2>{t("cta_title")}</h2>

          <p>
            {t("cta_text")}
          </p>

          <div className="cta-buttons">
            <a href="/become-donor" className="cta-primary">
              {t("nav_become_donor")}
            </a>

            <a href="/find-donors" className="cta-secondary">
              {t("cta_find")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;