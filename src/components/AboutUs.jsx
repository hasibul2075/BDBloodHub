import {
  FaTint,
  FaSearch,
  FaUserPlus,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";
import { t } from "../i18n";

function AboutUs() {
  return (
    <main className="about-page">

      {/* PAGE HEADER */}
      <section className="about-header">
        <div className="container">
          <span className="section-tag">{t("ab_tag")}</span>

          <h1>{t("ab_title")}</h1>

          <p>{t("ab_intro")}</p>
        </div>
      </section>


      {/* ABOUT SECTION */}
      <section className="about-main">
        <div className="container">

          <div className="about-grid">

            <div className="about-content">
              <span className="section-tag">
                {t("ab_who_tag")}
              </span>

              <h2>
                {t("ab_who_title_1")}
                <span> {t("ab_who_title_2")}</span>
              </h2>

              <p>{t("ab_who_p1")}</p>

              <p>{t("ab_who_p2")}</p>

              <p>{t("ab_who_p3")}</p>
            </div>


            <div className="about-highlight">
              <div className="about-highlight-icon">
                <FaHeart />
              </div>

              <h3>{t("ab_highlight_title")}</h3>

              <p>{t("ab_highlight_text")}</p>
            </div>

          </div>

        </div>
      </section>


      {/* MISSION SECTION */}
      <section className="mission-section">
        <div className="container">

          <div className="about-section-heading">
            <span className="section-tag">
              {t("ab_mission_tag")}
            </span>

            <h2>{t("ab_mission_title")}</h2>

            <p>{t("ab_mission_text")}</p>
          </div>


          <div className="mission-grid">

            <div className="mission-card">
              <div className="mission-icon">
                <FaSearch />
              </div>

              <h3>{t("ab_m1_title")}</h3>

              <p>{t("ab_m1_text")}</p>
            </div>


            <div className="mission-card">
              <div className="mission-icon">
                <FaUserPlus />
              </div>

              <h3>{t("nav_become_donor")}</h3>

              <p>{t("ab_m2_text")}</p>
            </div>


            <div className="mission-card">
              <div className="mission-icon">
                <FaMapMarkerAlt />
              </div>

              <h3>{t("ab_m3_title")}</h3>

              <p>{t("ab_m3_text")}</p>
            </div>

          </div>

        </div>
      </section>


      {/* WHY BDBLOODHUB */}
      <section className="why-about-section">
        <div className="container">

          <div className="about-section-heading">
            <span className="section-tag">
              {t("ab_why_tag")}
            </span>

            <h2>{t("ab_why_title")}</h2>

            <p>{t("ab_why_text")}</p>
          </div>


          <div className="why-about-grid">

            <div className="why-about-card">
              <FaTint />

              <div>
                <h3>{t("ab_w1_title")}</h3>

                <p>{t("ab_w1_text")}</p>
              </div>
            </div>


            <div className="why-about-card">
              <FaMapMarkerAlt />

              <div>
                <h3>{t("ab_w2_title")}</h3>

                <p>{t("ab_w2_text")}</p>
              </div>
            </div>


            <div className="why-about-card">
              <FaHeart />

              <div>
                <h3>{t("ab_w3_title")}</h3>

                <p>{t("ab_w3_text")}</p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="about-cta">
        <div className="container">

          <div className="about-cta-content">

            <span className="section-tag">
              {t("cta_tag")}
            </span>

            <h2>{t("ab_cta_title")}</h2>

            <p>{t("ab_cta_text")}</p>

            <div className="about-cta-buttons">

              <a
                href="/become-donor"
                className="about-cta-primary"
              >
                {t("nav_become_donor")}
              </a>

              <a
                href="/find-donors"
                className="about-cta-secondary"
              >
                {t("cta_find")}
              </a>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default AboutUs;
