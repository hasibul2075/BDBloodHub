import { useEffect, useMemo, useState } from "react";

import { FaTint, FaSignOutAlt, FaLock } from "react-icons/fa";

import { supabase } from "../supabase";
import "../admin.css";

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "")
  .trim()
  .toLowerCase();

const PERMISSION_HINT =
  "Permission denied. Run blood-requests-setup.sql in Supabase SQL Editor and make sure you are logged in with the admin email.";

const FILTERS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "fulfilled", label: "Fulfilled" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

function formatDate(iso) {
  if (!iso) return "—";

  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AdminRequests() {
  const [authState, setAuthState] = useState("checking"); // checking | login | denied | ok

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [filter, setFilter] = useState("pending");
  const [busyId, setBusyId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ---------- auth check ----------
  useEffect(() => {
    let active = true;

    const check = (session) => {
      if (!active) return;

      if (!session) {
        setAuthState("login");
        return;
      }

      const email = (session.user?.email || "").toLowerCase();

      setAuthState(
        ADMIN_EMAIL && email === ADMIN_EMAIL ? "ok" : "denied"
      );
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      check(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      check(session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // ---------- load requests ----------
  const reload = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (authState !== "ok") return;

    let active = true;

    supabase
      .from("blood_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .range(0, 2999)
      .then(({ data, error: loadError }) => {
        if (!active) return;

        if (loadError) {
          setError(loadError.message || "Failed to load requests.");
        } else {
          setError("");
          setRequests(data || []);
        }

        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authState, refreshKey]);

  const showNotice = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(""), 3000);
  };

  const counts = useMemo(() => {
    const c = {
      pending: 0,
      approved: 0,
      fulfilled: 0,
      rejected: 0,
      all: requests.length,
    };

    requests.forEach((r) => {
      if (c[r.status] !== undefined) c[r.status] += 1;
    });

    return c;
  }, [requests]);

  const rows = useMemo(
    () =>
      filter === "all"
        ? requests
        : requests.filter((r) => r.status === filter),
    [requests, filter]
  );

  // ---------- actions ----------
  const changeStatus = async (request, status, message) => {
    setBusyId(request.id);

    const { data, error: updateError } = await supabase
      .from("blood_requests")
      .update({ status })
      .eq("id", request.id)
      .select();

    setBusyId(null);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    if (!data || data.length === 0) {
      setError(PERMISSION_HINT);
      return;
    }

    setError("");
    showNotice(message);
    reload();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    const { data, error: deleteError } = await supabase
      .from("blood_requests")
      .delete()
      .eq("id", deleteTarget.id)
      .select();

    setDeleting(false);

    if (deleteError) {
      setError(deleteError.message);
      setDeleteTarget(null);
      return;
    }

    if (!data || data.length === 0) {
      setError(PERMISSION_HINT);
      setDeleteTarget(null);
      return;
    }

    setError("");
    setDeleteTarget(null);
    showNotice("Request deleted.");
    reload();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // ---------- gate screens ----------
  if (authState === "checking") {
    return (
      <div className="adm-gate">
        <p>Checking access...</p>
      </div>
    );
  }

  if (authState === "login") {
    return (
      <div className="adm-gate">
        <div className="adm-gate-card">
          <FaLock className="adm-gate-icon" />
          <h2>Admin Login Required</h2>
          <p>Please login with the admin account, then open this page again.</p>
          <a href="/login" className="adm-btn adm-btn-primary">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (authState === "denied") {
    return (
      <div className="adm-gate">
        <div className="adm-gate-card">
          <FaLock className="adm-gate-icon" />
          <h2>Access Denied</h2>
          <p>This account does not have admin access.</p>
          <div className="adm-gate-actions">
            <a href="/" className="adm-btn">
              Back to Home
            </a>
            <button
              type="button"
              className="adm-btn adm-btn-primary"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- main page ----------
  return (
    <div className="adm-page">
      <header className="adm-header">
        <div className="adm-header-inner">
          <a href="/" className="adm-brand">
            <FaTint /> BDBloodHub <span>Admin</span>
          </a>

          <nav className="adm-nav">
            <a href="/admin">Donors</a>
            <a href="/admin/requests" className="active">
              Requests
              {counts.pending > 0 && (
                <em className="adm-count">{counts.pending}</em>
              )}
            </a>
          </nav>

          <button
            type="button"
            className="adm-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <main className="adm-main">
        <div className="adm-filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={filter === f.key ? "active" : ""}
              onClick={() => setFilter(f.key)}
            >
              {f.label} <span>{counts[f.key]}</span>
            </button>
          ))}
        </div>

        {notice && <div className="adm-alert adm-alert-ok">{notice}</div>}
        {error && <div className="adm-alert adm-alert-err">{error}</div>}

        <section className="adm-table-wrap">
          {loading ? (
            <p className="adm-empty">Loading requests...</p>
          ) : rows.length === 0 ? (
            <p className="adm-empty">No requests in this list.</p>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Blood</th>
                  <th>Hospital / District</th>
                  <th>Needed</th>
                  <th>Contact</th>
                  <th>Posted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Patient">
                      <strong>{r.patient_name}</strong>
                      {r.details && (
                        <div className="adm-sub">{r.details}</div>
                      )}
                    </td>
                    <td data-label="Blood">
                      <span className="adm-blood">{r.blood_group}</span>
                      <div className="adm-sub">
                        {r.units} bag{r.units > 1 ? "s" : ""}
                      </div>
                    </td>
                    <td data-label="Hospital / District">
                      {r.hospital}
                      <div className="adm-sub">{r.district}</div>
                    </td>
                    <td data-label="Needed">
                      {formatDate(r.needed_date)}
                      {r.urgent && (
                        <span className="adm-urgent">Urgent</span>
                      )}
                    </td>
                    <td data-label="Contact">
                      {r.contact_name}
                      <div className="adm-sub">{r.contact_phone}</div>
                    </td>
                    <td data-label="Posted">
                      {formatDate(r.created_at)}
                    </td>
                    <td data-label="Status">
                      <span
                        className={`adm-status adm-status-${r.status}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div className="adm-actions adm-actions-wrap">
                        {r.status !== "approved" && (
                          <button
                            type="button"
                            className="adm-sm-btn adm-sm-green"
                            disabled={busyId === r.id}
                            onClick={() =>
                              changeStatus(r, "approved", "Request approved.")
                            }
                          >
                            Approve
                          </button>
                        )}

                        {r.status === "approved" && (
                          <button
                            type="button"
                            className="adm-sm-btn"
                            disabled={busyId === r.id}
                            onClick={() =>
                              changeStatus(
                                r,
                                "fulfilled",
                                "Marked as fulfilled."
                              )
                            }
                          >
                            Fulfilled
                          </button>
                        )}

                        {r.status !== "rejected" && (
                          <button
                            type="button"
                            className="adm-sm-btn adm-sm-red"
                            disabled={busyId === r.id}
                            onClick={() =>
                              changeStatus(r, "rejected", "Request rejected.")
                            }
                          >
                            Reject
                          </button>
                        )}

                        <button
                          type="button"
                          className="adm-sm-btn"
                          disabled={busyId === r.id}
                          onClick={() => setDeleteTarget(r)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      {deleteTarget && (
        <div
          className="adm-overlay"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="adm-modal adm-modal-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete request?</h3>
            <p className="adm-confirm-text">
              The request for <b>{deleteTarget.patient_name}</b> (
              {deleteTarget.blood_group}) will be permanently removed.
              This cannot be undone.
            </p>
            <div className="adm-modal-foot">
              <button
                type="button"
                className="adm-btn"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="adm-btn adm-btn-danger"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRequests;