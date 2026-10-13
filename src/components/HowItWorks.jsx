import { t } from "../i18n";

function HowItWorks() {
  const steps = [
    {
      number: t("hiw_n1"),
      title: t("hiw_s1_title"),
      text: t("hiw_s1_text"),
    },
    {
      number: t("hiw_n2"),
      title: t("hiw_s2_title"),
      text: t("hiw_s2_text"),
    },
    {
      number: t("hiw_n3"),
      title: t("hiw_s3_title"),
      text: t("hiw_s3_text"),
    },
  ];

  return (
    <section className="how-it-works">
      <div className="container">

        <span className="section-tag">{t("hiw_tag")}</span>

        <h2 className="section-title">
          {t("hiw_title")}
        </h2>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div className="step-card" key={index}>

              <div className="step-number">
                {step.number}
              </div>

              <h3>{step.title}</h3>

              <p>{step.text}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;