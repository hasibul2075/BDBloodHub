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
import { t, DATE_LOCALE } from "../i18n";
import ShareRequest from "./ShareRequest";
import "../requests.css";

const STATUS = {
  pending: {
    label: t("mr_status_pending"),
    Icon: FaClock,
    hint: t("mr_hint_pending"),
  },
  approved: {
    label: t("mr_status_approved"),
    Icon: FaEye,
    hint: t("mr_hint_approved"),
  },
  fulfilled: {
    label: t("mr_status_fulfilled"),
    Icon: FaCheckCircle,
    hint: t("mr_hint_fulfilled"),
  },
  rejected: {
    label: t("mr_status_rejected"),
    Icon: FaTimesCircle,
    hint: t("mr_hint_rejected"),
  },
};

function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${d.getFullYear()}-${m}-${day}`;
}

function formatDay(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(DATE_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPosted(iso) {
  return new Date(iso).toLocaleDateString(DATE_LOCALE, {
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
          setError(t("mr_err_load"));
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
      setError(t("mr_err_update"));
      return;
    }

    setError("");
    showNotice(t("mr_ok_fulfilled"));
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
      setError(t("mr_err_cancel"));
      return;
    }

    setError("");
    showNotice(t("mr_ok_cancelled"));
    reload();
  };

  // ---------- gate screens ----------
  if (authState === "checking") {
    return (
      <main className="req-page">
        <div className="req-wrap">
          <div className="req-empty">{t("req_wait")}</div>
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
              {t("mr_login_pre")} <span>{t("mr_login_span")}</span>{" "}
              {t("mr_login_post")}
            </h1>
            <p className="req-form-sub">{t("mr_login_sub")}</p>

            <div className="req-success-actions">
              <a href="/login" className="req-btn">
                {t("nav_login")}
              </a>
              <a href="/register" className="req-btn req-btn-light">
                {t("req_create_account")}
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
            <span className="req-tag">{t("req_my_requests")}</span>
            <h1>
              {t("mr_title_1")} <span>{t("mr_title_2")}</span>{" "}
              {t("mr_title_3")}
            </h1>
            <p>{t("mr_subtitle")}</p>
          </div>

          <div className="req-head-actions">
            <a href="/blood-requests" className="req-btn req-btn-light">
              {t("req_all_requests")}
            </a>
            <a href="/request-blood" className="req-btn">
              <FaPlus /> {t("req_request_blood")}
            </a>
          </div>
        </div>

        {notice && <div className="req-alert req-alert-ok">{notice}</div>}
        {error && <div className="req-alert req-alert-err">{error}</div>}

        {loading ? (
          <div className="req-empty">{t("mr_loading")}</div>
        ) : requests.length === 0 ? (
          <div className="req-empty">
            <p>{t("mr_empty")}</p>
            <a href="/request-blood" className="req-btn">
              <FaPlus /> {t("req_request_blood")}
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
                        {t(
                          r.units > 1
                            ? "req_bag_needed_many"
                            : "req_bag_needed_one",
                          { n: r.units }
                        )}
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
                      <span>
                        {t("req_needed_on", {
                          date: formatDay(r.needed_date),
                        })}
                      </span>
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
                      ? t("mr_expired")
                      : cfg.hint}
                  </p>

                  <span className="req-mine-meta">
                    {t("mr_submitted_on", { date: formatPosted(r.created_at) })}
                  </span>
                                    {r.status === "approved" && !expired && (
                    <ShareRequest request={r} />
                  )}
                  {confirmId === r.id ? (
                    <div className="req-confirm">
                      <p>{t("mr_cancel_confirm")}</p>

                      <div className="req-mine-actions">
                        <button
                          type="button"
                          className="req-btn req-btn-light"
                          disabled={busyId === r.id}
                          onClick={() => setConfirmId(null)}
                        >
                          {t("mr_keep")}
                        </button>
                        <button
                          type="button"
                          className="req-btn req-btn-danger"
                          disabled={busyId === r.id}
                          onClick={() => cancelRequest(r)}
                        >
                          {busyId === r.id
                            ? t("mr_cancelling")
                            : t("mr_yes_cancel")}
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
                            ? t("mr_updating")
                            : t("mr_mark_fulfilled")}
                        </button>
                      )}

                      {r.status === "pending" && (
                        <button
                          type="button"
                          className="req-btn req-btn-light"
                          onClick={() => setConfirmId(r.id)}
                        >
                          {t("mr_cancel_request")}
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