import { useEffect, useState } from "react";

import {
  FaHospital,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPhoneAlt,
  FaPlus,
  FaClock,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import { supabase } from "../supabase";
import ShareRequest from "./ShareRequest";
import "../requests.css";

const STATUS = {
  pending: {
    label: "Pending review",
    Icon: FaClock,
    hint: "Our team is verifying your request. It will appear on the Blood Requests page after approval.",
  },
  approved: {
    label: "Live",
    Icon: FaEye,
    hint: "Your request is visible on the Blood Requests page. Mark it as fulfilled once you get the blood.",
  },
  fulfilled: {
    label: "Fulfilled",
    Icon: FaCheckCircle,
    hint: "Marked as fulfilled. It is no longer shown publicly.",
  },
  rejected: {
    label: "Rejected",
    Icon: FaTimesCircle,
    hint: "This request was not approved. You can submit a new request with correct details.",
  },
};

function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${d.getFullYear()}-${m}-${day}`;
}

function formatDay(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPosted(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function MyRequests() {
  const [authState, setAuthState] = useState("checking"); // checking | login | ok
  const [userId, setUserId] = useState(null);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [busyId, setBusyId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  // ---------- who is logged in ----------
  useEffect(() => {
    let active = true;

    const apply = (session) => {
      if (!active) return;

      if (session?.user) {
        setUserId(session.user.id);
        setAuthState("ok");
      } else {
        setUserId(null);
        setAuthState("login");
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      apply(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      apply(session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // ---------- load my requests ----------
  const reload = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (!userId) return;

    let active = true;

    supabase
      .from("blood_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data, error: loadError }) => {
        if (!active) return;

        if (loadError) {
          setError("Could not load your requests. Please try again later.");
        } else {
          setError("");
          setRequests(data || []);
        }

        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId, refreshKey]);

  const showNotice = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(""), 3000);
  };

  // ---------- actions ----------
  const markFulfilled = async (request) => {
    setBusyId(request.id);

    const { data, error: updateError } = await supabase
      .from("blood_requests")
      .update({ status: "fulfilled" })
      .eq("id", request.id)
      .select();

    setBusyId(null);

    if (updateError || !data || data.length === 0) {
      setError("Could not update this request. Please try again.");
      return;
    }

    setError("");
    showNotice("Marked as fulfilled. Thank you for updating!");
    reload();
  };

  const cancelRequest = async (request) => {
    setBusyId(request.id);

    const { data, error: deleteError } = await supabase
      .from("blood_requests")
      .delete()
      .eq("id", request.id)
      .select();

    setBusyId(null);
    setConfirmId(null);

    if (deleteError || !data || data.length === 0) {
      setError("Could not cancel this request. Please try again.");
      return;
    }

    setError("");
    showNotice("Request cancelled.");
    reload();
  };

  // ---------- gate screens ----------
  if (authState === "checking") {
    return (
      <main className="req-page">
        <div className="req-wrap">
          <div className="req-empty">Please wait...</div>
        </div>
      </main>
    );
  }

  if (authState === "login") {
    return (
      <main className="req-page">
        <div className="req-wrap">
          <div className="req-form-card">
            <h1>
              Login to see <span>My Requests</span>
            </h1>
            <p className="req-form-sub">
              Please login to view the blood requests you have submitted
              and check their status.
            </p>

            <div className="req-success-actions">
              <a href="/login" className="req-btn">
                Login
              </a>
              <a href="/register" className="req-btn req-btn-light">
                Create account
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ---------- main page ----------
  const today = todayISO();

  return (
    <main className="req-page">
      <div className="req-wrap">
        <div className="req-head">
          <div>
            <span className="req-tag">MY REQUESTS</span>
            <h1>
              Your <span>Blood</span> Requests
            </h1>
            <p>
              Track the requests you have submitted and see whether they
              are approved.
            </p>
          </div>

          <div className="req-head-actions">
            <a href="/blood-requests" className="req-btn req-btn-light">
              All Requests
            </a>
            <a href="/request-blood" className="req-btn">
              <FaPlus /> Request Blood
            </a>
          </div>
        </div>

        {notice && <div className="req-alert req-alert-ok">{notice}</div>}
        {error && <div className="req-alert req-alert-err">{error}</div>}

        {loading ? (
          <div className="req-empty">Loading your requests...</div>
        ) : requests.length === 0 ? (
          <div className="req-empty">
            <p>You have not submitted any blood requests yet.</p>
            <a href="/request-blood" className="req-btn">
              <FaPlus /> Request Blood
            </a>
          </div>
        ) : (
          <div className="req-grid">
            {requests.map((r) => {
              const cfg = STATUS[r.status] || STATUS.pending;
              const StatusIcon = cfg.Icon;
              const expired =
                r.status === "approved" && r.needed_date < today;

              return (
                <article key={r.id} className="req-card">
                  <div className="req-card-top">
                    <div className="req-blood">{r.blood_group}</div>

                    <div className="req-card-title">
                      <strong>{r.patient_name}</strong>
                      <span>
                        {r.units} bag{r.units > 1 ? "s" : ""} needed
                      </span>
                    </div>

                    <span className={`req-status req-status-${r.status}`}>
                      <StatusIcon /> {cfg.label}
                    </span>
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
                      <span>Needed: {formatDay(r.needed_date)}</span>
                    </div>
                    <div>
                      <FaPhoneAlt />
                      <span>
                        {r.contact_name} · {r.contact_phone}
                      </span>
                    </div>
                  </div>

                  <p className="req-mine-hint">
                    {expired
                      ? "The required date has passed, so this request is no longer shown publicly."
                      : cfg.hint}
                  </p>

                  <span className="req-mine-meta">
                    Submitted on {formatPosted(r.created_at)}
                  </span>
                                    {r.status === "approved" && !expired && (
                    <ShareRequest request={r} />
                  )}
                  {confirmId === r.id ? (
                    <div className="req-confirm">
                      <p>Cancel this request? This cannot be undone.</p>

                      <div className="req-mine-actions">
                        <button
                          type="button"
                          className="req-btn req-btn-light"
                          disabled={busyId === r.id}
                          onClick={() => setConfirmId(null)}
                        >
                          Keep it
                        </button>
                        <button
                          type="button"
                          className="req-btn req-btn-danger"
                          disabled={busyId === r.id}
                          onClick={() => cancelRequest(r)}
                        >
                          {busyId === r.id ? "Cancelling..." : "Yes, cancel"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="req-mine-actions">
                      {r.status === "approved" && (
                        <button
                          type="button"
                          className="req-btn"
                          disabled={busyId === r.id}
                          onClick={() => markFulfilled(r)}
                        >
                          {busyId === r.id
                            ? "Updating..."
                            : "Mark as fulfilled"}
                        </button>
                      )}

                      {r.status === "pending" && (
                        <button
                          type="button"
                          className="req-btn req-btn-light"
                          onClick={() => setConfirmId(r.id)}
                        >
                          Cancel request
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyRequests;