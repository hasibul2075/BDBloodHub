import { t } from "../i18n";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <img
            src="/logo.png"
            alt="BDBloodHub"
            className="footer-logo"
          />

          <p>
            {t("footer_tagline_1")}
            <br />
            {t("footer_tagline_2")}
          </p>
        </div>


        {/* QUICK LINKS */}
        <div className="footer-column">
          <h3>{t("footer_quick_links")}</h3>

          <a href="/">{t("nav_home")}</a>

          <a href="/find-donors">
            {t("nav_find_donors")}
          </a>

          <a href="/become-donor">
            {t("nav_become_donor")}
          </a>

          <a href="/blood-guide">
            {t("nav_blood_guide")}
          </a>

          <a href="/about">
            {t("nav_about")}
          </a>
        </div>


        {/* GET INVOLVED */}
        <div className="footer-column">
          <h3>{t("footer_get_involved")}</h3>

          <a href="/become-donor">
            {t("footer_register_donor")}
          </a>

          <a href="/find-donors">
            {t("footer_find_blood")}
          </a>

          <a href="/find-donors">
            {t("footer_emergency")}
          </a>

          <a href="mailto:support@bdbloodhub.com">
            {t("footer_contact_us")}
          </a>
        </div>


        {/* CONTACT */}
        <div className="footer-column">
          <h3>{t("footer_contact")}</h3>

          <p>📍 {t("footer_country")}</p>

          <p>
            📧 support@bdbloodhub.com
          </p>

          <p>
            📞 +880 1XXX-XXXXXX
          </p>
        </div>

      </div>


      <div className="footer-bottom">
        {t("footer_rights")}
      </div>
    </footer>
  );
}

export default Footer;