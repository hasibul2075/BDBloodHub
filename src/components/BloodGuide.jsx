import { useState } from "react";
import {
  FaTint,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";

import { t, DATE_LOCALE } from "../i18n";
import {
  REST_DAYS,
  getRestInfo,
  todayISO,
} from "../utils/donorEligibility";
import "../guide.css";

const GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Split "AB+" into its ABO letters and Rh sign
function parseGroup(group) {
  return {
    abo: group.slice(0, -1),
    rh: group.slice(-1),
  };
}

// Can a donor of `from` safely give red blood cells to a patient of `to`?
// Rule 1: the patient must have every ABO antigen the donor has.
// Rule 2: an Rh+ donor can only give to an Rh+ patient.
function canDonate(from, to) {
  const donor = parseGroup(from);
  const patient = parseGroup(to);

  const aboOk = donor.abo
    .split("")
    .every((letter) => patient.abo.includes(letter));

  const rhOk = donor.rh === "-" || patient.rh === "+";

  return aboOk && rhOk;
}

const donateTo = (group) =>
  GROUPS.filter((other) => canDonate(group, other));

const receiveFrom = (group) =>
  GROUPS.filter((other) => canDonate(other, group));

const RULE_KEYS = {
  yes: ["guide_do_1", "guide_do_2", "guide_do_3", "guide_do_4", "guide_do_5"],
  no: ["guide_dont_1", "guide_dont_2", "guide_dont_3", "guide_dont_4", "guide_dont_5"],
};

const ELIGIBILITY = [
  ["guide_el_age", "guide_el_age_val"],
  ["guide_el_weight", "guide_el_weight_val"],
  ["guide_el_hb", "guide_el_hb_val"],
  ["guide_el_gap", "guide_el_gap_val"],
  ["guide_el_pulse", "guide_el_pulse_val"],
  ["guide_el_health", "guide_el_health_val"],
];

const FAQ_COUNT = 8;

function BloodGuide() {
  const [selected, setSelected] = useState("O-");
  const [mode, setMode] = useState("give"); // give | get
  const [openFaq, setOpenFaq] = useState(0);
  const [lastDate, setLastDate] = useState("");

  const highlighted =
    mode === "give" ? donateTo(selected) : receiveFrom(selected);

  const rest = lastDate ? getRestInfo(lastDate) : null;

  return (
    <main className="guide-page">

      {/* HEADER */}
      <section className="guide-header">
        <div className="container">
          <span className="section-tag">{t("guide_tag")}</span>
          <h1>{t("guide_title")}</h1>
          <p>{t("guide_intro")}</p>

          <nav className="guide-jump">
            <a href="#compatibility">{t("guide_jump_compat")}</a>
            <a href="#eligibility">{t("guide_jump_elig")}</a>
            <a href="#rules">{t("guide_jump_rules")}</a>
            <a href="#faq">{t("guide_jump_faq")}</a>
          </nav>
        </div>
      </section>


      {/* COMPATIBILITY */}
      <section className="guide-section" id="compatibility">
        <div className="container">

          <div className="guide-heading">
            <h2>{t("guide_compat_title")}</h2>
            <p>{t("guide_compat_text")}</p>
          </div>

          {/* interactive picker */}
          <div className="guide-card">
            <div className="guide-picker-label">
              {t("guide_pick_label")}
            </div>

            <div className="guide-chips">
              {GROUPS.map((group) => (
                <button
                  key={group}
                  type="button"
                  className={`guide-chip ${
                    selected === group ? "active" : ""
                  }`}
                  onClick={() => setSelected(group)}
                >
                  {group}
                </button>
              ))}
            </div>

            <div className="guide-toggle">
              <button
                type="button"
                className={mode === "give" ? "active" : ""}
                onClick={() => setMode("give")}
              >
                {t("guide_mode_give")}
              </button>

              <button
                type="button"
                className={mode === "get" ? "active" : ""}
                onClick={() => setMode("get")}
              >
                {t("guide_mode_get")}
              </button>
            </div>

            <div className="guide-result">
              <p className="guide-result-text">
                {t(
                  mode === "give"
                    ? "guide_result_give"
                    : "guide_result_get",
                  { group: selected }
                )}
              </p>

              <div className="guide-result-groups">
                {highlighted.map((group) => (
                  <span key={group} className="guide-badge">
                    <FaTint /> {group}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* full matrix */}
          <div className="guide-card">
            <h3 className="guide-card-title">
              {t("guide_matrix_title")}
            </h3>

            <div className="guide-table-wrap">
              <table className="guide-table">
                <thead>
                  <tr>
                    <th className="corner">
                      {t("guide_matrix_corner")}
                    </th>
                    {GROUPS.map((to) => (
                      <th key={to}>{to}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {GROUPS.map((from) => (
                    <tr key={from}>
                      <th>{from}</th>

                      {GROUPS.map((to) => {
                        const ok = canDonate(from, to);

                        return (
                          <td
                            key={to}
                            className={ok ? "yes" : "no"}
                            title={`${from} → ${to}`}
                          >
                            {ok ? (
                              <FaCheckCircle
                                aria-label={t("guide_yes")}
                              />
                            ) : (
                              <FaTimesCircle
                                aria-label={t("guide_no")}
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="guide-note">
              <FaInfoCircle /> {t("guide_matrix_note")}
            </p>
          </div>

          {/* quick facts */}
          <div className="guide-facts">
            <div className="guide-fact">
              <strong>O-</strong>
              <span>{t("guide_fact_o_neg")}</span>
            </div>

            <div className="guide-fact">
              <strong>AB+</strong>
              <span>{t("guide_fact_ab_pos")}</span>
            </div>
          </div>

        </div>
      </section>


      {/* ELIGIBILITY */}
      <section className="guide-section alt" id="eligibility">
        <div className="container">

          <div className="guide-heading">
            <h2>{t("guide_elig_title")}</h2>
            <p>{t("guide_elig_text")}</p>
          </div>

          <div className="guide-elig-grid">
            {ELIGIBILITY.map(([label, value]) => (
              <div className="guide-elig-card" key={label}>
                <span>{t(label)}</span>
                <strong>{t(value, { days: REST_DAYS })}</strong>
              </div>
            ))}
          </div>

          {/* next donation date calculator */}
          <div className="guide-card guide-calc">
            <h3 className="guide-card-title">
              <FaCalendarAlt /> {t("guide_calc_title")}
            </h3>

            <p className="guide-calc-text">
              {t("guide_calc_text", { days: REST_DAYS })}
            </p>

            <input
              type="date"
              className="guide-date"
              value={lastDate}
              max={todayISO()}
              onChange={(e) => setLastDate(e.target.value)}
            />

            {rest && (
              <div
                className={`guide-calc-result ${
                  rest.resting ? "wait" : "ok"
                }`}
              >
                {rest.resting
                  ? t("guide_calc_wait", {
                      date: rest.until.toLocaleDateString(
                        DATE_LOCALE,
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      ),
                      days: rest.daysLeft,
                    })
                  : t("guide_calc_ok")}
              </div>
            )}
          </div>

        </div>
      </section>


      {/* RULES */}
      <section className="guide-section" id="rules">
        <div className="container">

          <div className="guide-heading">
            <h2>{t("guide_rules_title")}</h2>
            <p>{t("guide_rules_text")}</p>
          </div>

          <div className="guide-rules">
            <div className="guide-rule-col yes">
              <h3>
                <FaCheckCircle /> {t("guide_do_title")}
              </h3>

              <ul>
                {RULE_KEYS.yes.map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </ul>
            </div>

            <div className="guide-rule-col no">
              <h3>
                <FaTimesCircle /> {t("guide_dont_title")}
              </h3>

              <ul>
                {RULE_KEYS.no.map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>


      {/* FAQ */}
      <section className="guide-section alt" id="faq">
        <div className="container">

          <div className="guide-heading">
            <h2>{t("guide_faq_title")}</h2>
            <p>{t("guide_faq_text")}</p>
          </div>

          <div className="guide-faq">
            {Array.from({ length: FAQ_COUNT }, (_, i) => i + 1).map(
              (n) => {
                const isOpen = openFaq === n;

                return (
                  <div
                    key={n}
                    className={`guide-faq-item ${
                      isOpen ? "open" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="guide-faq-q"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? 0 : n)}
                    >
                      <span>{t(`guide_faq_q${n}`)}</span>
                      <FaChevronDown />
                    </button>

                    {isOpen && (
                      <div className="guide-faq-a">
                        {t(`guide_faq_a${n}`, { days: REST_DAYS })}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>

          <p className="guide-disclaimer">
            <FaInfoCircle /> {t("guide_disclaimer")}
          </p>

        </div>
      </section>


      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="about-cta-content">
            <h2>{t("guide_cta_title")}</h2>
            <p>{t("guide_cta_text")}</p>

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

export default BloodGuide;
