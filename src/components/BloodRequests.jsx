import { useEffect, useMemo, useRef, useState } from "react";

import {
  FaTint,
  FaChevronDown,
  FaCheck,
  FaHospital,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPhoneAlt,
  FaPlus,
  FaExclamationCircle,
  FaUser,
} from "react-icons/fa";

import { supabase } from "../supabase";
import { t, DATE_LOCALE } from "../i18n";
import ShareRequest from "./ShareRequest";
import "../requests.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

// Today's date as YYYY-MM-DD in the visitor's local time
function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${d.getFullYear()}-${m}-${day}`;
}

function formatDate(iso) {
  if (iso === todayISO()) return t("req_today");

  return new Date(`${iso}T00:00:00`).toLocaleDateString(DATE_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function BloodRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bloodFilter, setBloodFilter] = useState("");
  const [search, setSearch] = useState("");

  // A shared link looks like /blood-requests?request=<id>
  const [focusId] = useState(() =>
    new URLSearchParams(window.location.search).get("request")
  );

  const [isBloodOpen, setIsBloodOpen] = useState(false);
  const dropRef = useRef(null);

  // Contact popup (same style as "Contact Donor" on Find Donors)
  const [contactRequest, setContactRequest] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(contactRequest.contact_phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t("br_copy_prompt"), contactRequest.contact_phone);
    }
  };

  // Close the blood group dropdown when clicking outside of it
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setIsBloodOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutside);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
    };
  }, []);

  useEffect(() => {
    let active = true;

    supabase
      .from("blood_requests")
      .select("*")
      .eq("status", "approved")
      .gte("needed_date", todayISO())
      .order("needed_date", { ascending: true })
      .then(({ data, error: loadError }) => {
        if (!active) return;

        if (loadError) {
          setError(t("br_err_load"));
        } else {
          setRequests(data || []);
        }

        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    if (focusId) {
      return requests.filter((r) => r.id === focusId);
    }

    const q = search.trim().toLowerCase();

    return requests
      .filter((r) => {
        if (bloodFilter && r.blood_group !== bloodFilter) return false;

        if (!q) return true;

        return [r.district, r.hospital, r.patient_name]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q));
      })
      .sort((a, b) => Number(b.urgent) - Number(a.urgent));
  }, [requests, bloodFilter, search, focusId]);

  return (
    <main className="req-page">
      <div className="req-wrap">
        <div className="req-head">
          <div>
            <span className="req-tag">{t("br_tag")}</span>
            <h1>
              {t("br_title_1")} <span>{t("br_title_2")}</span>{" "}
              {t("br_title_3")}
            </h1>
            <p>{t("br_subtitle")}</p>
          </div>

          <div className="req-head-actions">
            <a href="/my-requests" className="req-btn req-btn-light">
              {t("req_my_requests")}
            </a>
            <a href="/request-blood" className="req-btn">
              <FaPlus /> {t("req_request_blood")}
            </a>
          </div>
        </div>

        {focusId ? (
          <div className="req-focus-bar">
            <span>{t("br_showing_one")}</span>
            <a href="/blood-requests">{t("br_view_all")}</a>
          </div>
        ) : (
          <div className="req-filters">
            <input
              type="text"
              placeholder={t("br_search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="req-drop" ref={dropRef}>
              <button
                type="button"
                className={`req-drop-btn ${isBloodOpen ? "active" : ""}`}
                onClick={() => setIsBloodOpen(!isBloodOpen)}
              >
                <span className="req-drop-left">
                  <span className="req-drop-icon">
                    <FaTint />
                  </span>

                  <span>
                    {t("blood_group")}:{" "}
                    <strong>
                      {bloodFilter === "" ? t("all") : bloodFilter}
                    </strong>
                  </span>
                </span>

                <FaChevronDown
                  className={`req-drop-chevron ${
                    isBloodOpen ? "rotate" : ""
                  }`}
                />
              </button>

              {isBloodOpen && (
                <div className="req-drop-menu">
                  <button
                    type="button"
                    className={`req-drop-option ${
                      bloodFilter === "" ? "selected" : ""
                    }`}
                    onClick={() => {
                      setBloodFilter("");
                      setIsBloodOpen(false);
                    }}
                  >
                    <span className="req-drop-small-icon">
                      <FaTint />
                    </span>

                    <span className="req-drop-name">
                      {t("fd_blood_group_all")}
                    </span>

                    {bloodFilter === "" && (
                      <FaCheck className="req-drop-check" />
                    )}
                  </button>

                  {BLOOD_GROUPS.map((g) => (
                    <button
                      type="button"
                      key={g}
                      className={`req-drop-option ${
                        bloodFilter === g ? "selected" : ""
                      }`}
                      onClick={() => {
                        setBloodFilter(g);
                        setIsBloodOpen(false);
                      }}
                    >
                      <span className="req-drop-badge">{g}</span>

                      <span className="req-drop-name">{g}</span>

                      {bloodFilter === g && (
                        <FaCheck className="req-drop-check" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {error && <div className="req-alert req-alert-err">{error}</div>}

        {loading ? (
          <div className="req-empty">{t("br_loading")}</div>
        ) : visible.length === 0 ? (
          <div className="req-empty">
            <p>
              {focusId
                ? t("br_inactive")
                : t("br_none")}
            </p>
            {focusId ? (
              <a href="/blood-requests" className="req-btn req-btn-light">
                {t("br_view_all")}
              </a>
            ) : (
              <a href="/request-blood" className="req-btn req-btn-light">
                {t("br_post_request")}
              </a>
            )}
          </div>
        ) : (
          <div className="req-grid">
            {visible.map((r) => (
              <article
                key={r.id}
                className={`req-card ${r.urgent ? "req-urgent" : ""}`}
              >
                <div className="req-card-top">
                  <div className="req-blood">{r.blood_group}</div>

                  <div className="req-card-title">
                    <strong>{r.patient_name}</strong>
                    <span>
                      {t(
                        r.units > 1
                          ? "req_bag_needed_many"
                          : "req_bag_needed_one",
                        { n: r.units }
                      )}
                    </span>
                  </div>

                  {r.urgent && (
                    <span className="req-flag">
                      <FaExclamationCircle /> {t("br_urgent")}
                    </span>
                  )}
                </div>

                <div className="req-lines">
                  <div>
                    <FaHospital />
                    <span>{r.hospital}</span>
                  </div>
                  <div>
                    <FaMapMarkerAlt />
                    <span>{r.district}</span>
                  </div>
                  <div>
                    <FaCalendarAlt />
                    <span>
                      {t("req_needed_on", {
                        date: formatDate(r.needed_date),
                      })}
                    </span>
                  </div>
                  <div>
                    <FaUser />
                    <span>{r.contact_name}</span>
                  </div>
                </div>

                {r.details && <p className="req-details">{r.details}</p>}

                <ShareRequest request={r} />

                <div className="req-call">
                  <button
                    type="button"
                    className="req-btn"
                    onClick={() => {
                      setCopied(false);
                      setContactRequest(r);
                    }}
                  >
                    <FaPhoneAlt /> {t("br_call", { phone: r.contact_phone })}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {contactRequest && (
        <div
          className="contact-modal-overlay"
          onClick={() => setContactRequest(null)}
        >
          <div
            className="contact-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{t("br_modal_title")}</h3>

            <p>
              <strong>{t("br_patient")}</strong> {contactRequest.patient_name}
            </p>

            <p>
              <strong>{t("blood_group")}:</strong> {contactRequest.blood_group}
            </p>

            <p>
              <strong>{t("br_hospital")}</strong> {contactRequest.hospital},{" "}
              {contactRequest.district}
            </p>

            <p>
              <strong>{t("br_contact_person")}</strong>{" "}
              {contactRequest.contact_name}
            </p>

            <div className="phone-box">{contactRequest.contact_phone}</div>

            {/* Shown on phones only (opens the dialer) */}
            <a
              href={`tel:${contactRequest.contact_phone}`}
              className="req-modal-call"
            >
              {t("br_call_now")}
            </a>

            <button type="button" onClick={copyPhone}>
              {t("copy_number")}
            </button>

            {copied && <p>{t("copied")}</p>}

            <button type="button" onClick={() => setContactRequest(null)}>
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default BloodRequests;