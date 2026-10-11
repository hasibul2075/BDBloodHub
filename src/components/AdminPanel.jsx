import { useEffect, useMemo, useState } from "react";

import {
  FaTint,
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaSignOutAlt,
  FaUsers,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";

import { supabase } from "../supabase";
import "../admin.css";

// Admin email comes from .env (VITE_ADMIN_EMAIL).
// The real protection is the database policy (see admin-setup.sql),
// this check only decides what the page shows.
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "")
  .trim()
  .toLowerCase();

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const PAGE_SIZE = 20;

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  blood_group: "",
  district: "",
  upazila: "",
  last_donation_date: "",
  available: true,
};

const PERMISSION_HINT =
  "Permission denied. Run admin-setup.sql in Supabase SQL Editor and make sure you are logged in with the admin email.";

function AdminPanel() {
  const [authState, setAuthState] = useState("checking"); // checking | login | denied | ok

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState("");
  const [availFilter, setAvailFilter] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [modal, setModal] = useState(null); // null | { mode: "add" } | { mode: "edit", donor }
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

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

  // ---------- load donors ----------
  const reload = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (authState !== "ok") return;

    let active = true;

    supabase
      .from("donors")
      .select("*")
      .order("created_at", { ascending: false })
      .range(0, 4999)
      .then(({ data, error: loadError }) => {
        if (!active) return;

        if (loadError) {
          setError(loadError.message || "Failed to load donors.");
        } else {
          setError("");
          setDonors(data || []);
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

  // ---------- stats ----------
  const stats = useMemo(() => {
    const byGroup = {};

    BLOOD_GROUPS.forEach((g) => {
      byGroup[g] = 0;
    });

    let available = 0;

    donors.forEach((d) => {
      if (d.available) available += 1;
      if (byGroup[d.blood_group] !== undefined) {
        byGroup[d.blood_group] += 1;
      }
    });

    return { total: donors.length, available, byGroup };
  }, [donors]);

  // ---------- filtering + paging ----------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return donors.filter((d) => {
      if (bloodFilter && d.blood_group !== bloodFilter) return false;

      if (availFilter === "yes" && !d.available) return false;
      if (availFilter === "no" && d.available) return false;

      if (!q) return true;

      return [d.name, d.email, d.phone, d.district, d.upazila]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [donors, search, bloodFilter, availFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ---------- modal helpers ----------
  const openAdd = () => {
    setForm(emptyForm);
    setFormError("");
    setModal({ mode: "add" });
  };

  const openEdit = (donor) => {
    setForm({
      name: donor.name || "",
      email: donor.email || "",
      phone: donor.phone || "",
      blood_group: donor.blood_group || "",
      district: donor.district || "",
      upazila: donor.upazila || "",
      last_donation_date: donor.last_donation_date || "",
      available: Boolean(donor.available),
    });
    setFormError("");
    setModal({ mode: "edit", donor });
  };

  const closeModal = () => {
    if (saving) return;
    setModal(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      blood_group: form.blood_group,
      district: form.district.trim(),
      upazila: form.upazila.trim(),
      last_donation_date: form.last_donation_date || null,
      available: Boolean(form.available),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.phone ||
      !payload.blood_group ||
      !payload.district ||
      !payload.upazila
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    setFormError("");

    let result;

    if (modal.mode === "add") {
      result = await supabase.from("donors").insert([payload]).select();
    } else {
      result = await supabase
        .from("donors")
        .update(payload)
        .eq("id", modal.donor.id)
        .select();
    }

    setSaving(false);

    if (result.error) {
      setFormError(result.error.message || "Failed to save donor.");
      return;
    }

    if (!result.data || result.data.length === 0) {
      setFormError(PERMISSION_HINT);
      return;
    }

    setModal(null);
    showNotice(
      modal.mode === "add" ? "Donor added." : "Donor updated."
    );
    reload();
  };

  // ---------- quick availability toggle ----------
  const toggleAvailable = async (donor) => {
    const { data, error: updateError } = await supabase
      .from("donors")
      .update({ available: !donor.available })
      .eq("id", donor.id)
      .select();

    if (updateError) {
      setError(updateError.message);
      return;
    }

    if (!data || data.length === 0) {
      setError(PERMISSION_HINT);
      return;
    }

    setError("");
    reload();
  };

  // ---------- delete ----------
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    const { data, error: deleteError } = await supabase
      .from("donors")
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
    showNotice("Donor deleted.");
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
          <p>Please login with the admin account, then open /admin again.</p>
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

  // ---------- main panel ----------
  return (
    <div className="adm-page">
      <header className="adm-header">
        <div className="adm-header-inner">
          <a href="/" className="adm-brand">
            <FaTint /> BDBloodHub <span>Admin</span>
          </a>

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
        {/* Stats */}
        <section className="adm-stats">
          <div className="adm-stat-card">
            <FaUsers className="adm-stat-icon" />
            <div>
              <strong>{stats.total}</strong>
              <span>Total Donors</span>
            </div>
          </div>

          <div className="adm-stat-card">
            <FaCheckCircle className="adm-stat-icon adm-green" />
            <div>
              <strong>{stats.available}</strong>
              <span>Available</span>
            </div>
          </div>

          <div className="adm-stat-groups">
            {BLOOD_GROUPS.map((g) => (
              <div key={g} className="adm-group-chip">
                <b>{g}</b>
                <span>{stats.byGroup[g]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Toolbar */}
        <section className="adm-toolbar">
          <div className="adm-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search name, phone, email, district..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            value={bloodFilter}
            onChange={(e) => {
              setBloodFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All blood groups</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            value={availFilter}
            onChange={(e) => {
              setAvailFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All status</option>
            <option value="yes">Available</option>
            <option value="no">Unavailable</option>
          </select>

          <button
            type="button"
            className="adm-btn adm-btn-primary"
            onClick={openAdd}
          >
            <FaPlus /> Add Donor
          </button>
        </section>

        {notice && <div className="adm-alert adm-alert-ok">{notice}</div>}
        {error && <div className="adm-alert adm-alert-err">{error}</div>}

        {/* Table */}
        <section className="adm-table-wrap">
          {loading ? (
            <p className="adm-empty">Loading donors...</p>
          ) : filtered.length === 0 ? (
            <p className="adm-empty">No donors found.</p>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Blood</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>District</th>
                  <th>Upazila</th>
                  <th>Last Donation</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((d) => (
                  <tr key={d.id}>
                    <td data-label="Name">{d.name}</td>
                    <td data-label="Blood">
                      <span className="adm-blood">{d.blood_group}</span>
                    </td>
                    <td data-label="Phone">{d.phone}</td>
                    <td data-label="Email">{d.email}</td>
                    <td data-label="District">{d.district}</td>
                    <td data-label="Upazila">{d.upazila}</td>
                    <td data-label="Last Donation">
                      {d.last_donation_date || "—"}
                    </td>
                    <td data-label="Status">
                      <button
                        type="button"
                        title="Click to change"
                        className={`adm-badge ${
                          d.available ? "adm-badge-yes" : "adm-badge-no"
                        }`}
                        onClick={() => toggleAvailable(d)}
                      >
                        {d.available ? "Available" : "Unavailable"}
                      </button>
                    </td>
                    <td data-label="Actions">
                      <div className="adm-actions">
                        <button
                          type="button"
                          className="adm-icon-btn"
                          title="Edit"
                          onClick={() => openEdit(d)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="adm-icon-btn adm-danger"
                          title="Delete"
                          onClick={() => setDeleteTarget(d)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Pagination */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="adm-pager">
            <button
              type="button"
              className="adm-btn"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages} ({filtered.length} donors)
            </span>
            <button
              type="button"
              className="adm-btn"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Add / Edit modal */}
      {modal && (
        <div className="adm-overlay" onClick={closeModal}>
          <div
            className="adm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-head">
              <h3>
                {modal.mode === "add" ? "Add Donor" : "Edit Donor"}
              </h3>
              <button
                type="button"
                className="adm-icon-btn"
                onClick={closeModal}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSave} className="adm-form">
              <label>
                Full name *
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                />
              </label>

              <label>
                Email *
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                />
              </label>

              <label>
                Phone *
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                />
              </label>

              <label>
                Blood group *
                <select
                  name="blood_group"
                  value={form.blood_group}
                  onChange={handleFormChange}
                >
                  <option value="">Select</option>
                  {BLOOD_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                District *
                <input
                  name="district"
                  value={form.district}
                  onChange={handleFormChange}
                />
              </label>

              <label>
                Upazila *
                <input
                  name="upazila"
                  value={form.upazila}
                  onChange={handleFormChange}
                />
              </label>

              <label>
                Last donation date
                <input
                  name="last_donation_date"
                  type="date"
                  value={form.last_donation_date}
                  onChange={handleFormChange}
                />
              </label>

              <label>
                Availability
                <select
                  name="available"
                  value={form.available ? "yes" : "no"}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      available: e.target.value === "yes",
                    }))
                  }
                >
                  <option value="yes">Available</option>
                  <option value="no">Unavailable</option>
                </select>
              </label>

              {formError && (
                <div className="adm-alert adm-alert-err adm-full">
                  {formError}
                </div>
              )}

              <div className="adm-modal-foot adm-full">
                <button
                  type="button"
                  className="adm-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-btn adm-btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : modal.mode === "add"
                    ? "Add Donor"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div
          className="adm-overlay"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="adm-modal adm-modal-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete donor?</h3>
            <p className="adm-confirm-text">
              <b>{deleteTarget.name}</b> ({deleteTarget.blood_group}) will
              be permanently removed. This cannot be undone.
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

export default AdminPanel;