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
  if (iso === todayISO()) return "Today";

  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
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
      window.prompt("Copy this number:", contactRequest.contact_phone);
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
          setError("Could not load blood requests. Please try again later.");
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
            <span className="req-tag">BLOOD REQUESTS</span>
            <h1>
              People Who Need <span>Blood</span> Now
            </h1>
            <p>
              Verified requests from patients and families. If you can
              help, call the contact number directly.
            </p>
          </div>

          <div className="req-head-actions">
            <a href="/my-requests" className="req-btn req-btn-light">
              My Requests
            </a>
            <a href="/request-blood" className="req-btn">
              <FaPlus /> Request Blood
            </a>
          </div>
        </div>

        {focusId ? (
          <div className="req-focus-bar">
            <span>Showing one shared request.</span>
            <a href="/blood-requests">View all requests</a>
          </div>
        ) : (
          <div className="req-filters">
            <input
              type="text"
              placeholder="Search by district, hospital or patient..."
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
                    Blood Group:{" "}
                    <strong>{bloodFilter === "" ? "All" : bloodFilter}</strong>
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

                    <span className="req-drop-name">Blood Group: All</span>

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
          <div className="req-empty">Loading requests...</div>
        ) : visible.length === 0 ? (
          <div className="req-empty">
            <p>
              {focusId
                ? "This request is no longer active."
                : "No active blood requests right now."}
            </p>
            {focusId ? (
              <a href="/blood-requests" className="req-btn req-btn-light">
                View all requests
              </a>
            ) : (
              <a href="/request-blood" className="req-btn req-btn-light">
                Need blood? Post a request
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
                      {r.units} bag{r.units > 1 ? "s" : ""} needed
                    </span>
                  </div>

                  {r.urgent && (
                    <span className="req-flag">
                      <FaExclamationCircle /> Urgent
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
                    <span>Needed: {formatDate(r.needed_date)}</span>
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
                    <FaPhoneAlt /> Call {r.contact_phone}
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
            <h3>Contact for this Request</h3>

            <p>
              <strong>Patient:</strong> {contactRequest.patient_name}
            </p>

            <p>
              <strong>Blood Group:</strong> {contactRequest.blood_group}
            </p>

            <p>
              <strong>Hospital:</strong> {contactRequest.hospital},{" "}
              {contactRequest.district}
            </p>

            <p>
              <strong>Contact Person:</strong>{" "}
              {contactRequest.contact_name}
            </p>

            <div className="phone-box">{contactRequest.contact_phone}</div>

            {/* Shown on phones only (opens the dialer) */}
            <a
              href={`tel:${contactRequest.contact_phone}`}
              className="req-modal-call"
            >
              Call Now
            </a>

            <button type="button" onClick={copyPhone}>
              Copy Number
            </button>

            {copied && <p>Copied!</p>}

            <button type="button" onClick={() => setContactRequest(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default BloodRequests;