import { useEffect, useState } from "react";

import {
  FaTint,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import { supabase } from "../supabase";

function MyDonorProfile() {
  const [donor, setDonor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    district: "",
    upazila: "",
    last_donation_date: "",
    available: true,
  });

  useEffect(() => {
    fetchMyDonorProfile();
  }, []);

  const fetchMyDonorProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "Please login to view your donor profile."
        );
      }

      const { data, error: donorError } =
        await supabase
          .from("donors")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

      if (donorError) {
        throw donorError;
      }

      if (!data) {
        setDonor(null);
        return;
      }

      setDonor(data);

      setFormData({
        phone: data.phone || "",
        district: data.district || "",
        upazila: data.upazila || "",
        last_donation_date:
          data.last_donation_date || "",
        available: data.available ?? true,
      });
    } catch (error) {
      console.error(
        "My donor profile error:",
        error
      );

      setError(
        error.message ||
          "Failed to load your donor profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleAvailabilityChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      available: e.target.value === "true",
    }));

    setError("");
    setSuccess("");
  };

  const handleEdit = () => {
    setError("");
    setSuccess("");
    setEditing(true);
  };

  const handleCancel = () => {
    if (!donor) return;

    setFormData({
      phone: donor.phone || "",
      district: donor.district || "",
      upazila: donor.upazila || "",
      last_donation_date:
        donor.last_donation_date || "",
      available: donor.available ?? true,
    });

    setError("");
    setSuccess("");
    setEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.phone.trim() ||
      !formData.district.trim() ||
      !formData.upazila.trim()
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "Your session has expired. Please login again."
        );
      }

      const { data, error: updateError } =
        await supabase
          .from("donors")
          .update({
            phone: formData.phone.trim(),
            district: formData.district.trim(),
            upazila: formData.upazila.trim(),
            last_donation_date:
              formData.last_donation_date || null,
            available: formData.available,
          })
          .eq("user_id", user.id)
          .select()
          .single();

      if (updateError) {
        throw updateError;
      }

      setDonor(data);

      setFormData({
        phone: data.phone || "",
        district: data.district || "",
        upazila: data.upazila || "",
        last_donation_date:
          data.last_donation_date || "",
        available: data.available ?? true,
      });

      setEditing(false);
      setSuccess(
        "Your donor profile has been updated successfully."
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setError(
        error.message ||
          "Failed to update your donor profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="auth-page">
        <section className="auth-section">
          <div className="auth-container">
            <div className="auth-card">
              <div className="auth-card-header">
                <h2>Loading Profile...</h2>

                <p>
                  Please wait while we load your
                  donor information.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error && !donor) {
    return (
      <main className="auth-page">
        <section className="auth-section">
          <div className="auth-container">
            <div className="auth-card">
              <div className="auth-card-header">
                <FaExclamationCircle
                  style={{
                    fontSize: "40px",
                    color: "#dc2626",
                    marginBottom: "15px",
                  }}
                />

                <h2>Unable to Load Profile</h2>

                <p>{error}</p>

                <a
                  href="/login"
                  className="auth-submit-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "20px",
                    textDecoration: "none",
                  }}
                >
                  Go to Login
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!donor) {
    return (
      <main className="auth-page">
        <section className="auth-section">
          <div className="auth-container">
            <div className="auth-info">
              <div className="auth-logo-icon">
                <FaTint />
              </div>

              <span className="section-tag">
                MY DONOR PROFILE
              </span>

              <h1>
                Become a
                <span> Donor</span>
              </h1>

              <p>
                You have not registered as a donor
                yet. Join BDBloodHub and help save
                lives.
              </p>
            </div>

            <div className="auth-card">
              <div className="auth-card-header">
                <h2>No Donor Profile</h2>

                <p>
                  Register yourself as a blood donor
                  to create your donor profile.
                </p>

                <a
                  href="/become-donor"
                  className="auth-submit-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "20px",
                    textDecoration: "none",
                  }}
                >
                  Become a Donor
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const formattedDate = donor.last_donation_date
    ? new Date(
        donor.last_donation_date
      ).toLocaleDateString("en-GB")
    : "Not provided";

  return (
    <main className="auth-page">
      <section className="auth-section">
        <div className="auth-container">

          <div className="auth-info">
            <div className="auth-logo-icon">
              <FaTint />
            </div>

            <span className="section-tag">
              MY DONOR PROFILE
            </span>

            <h1>
              Your
              <span> Donor Profile</span>
            </h1>

            <p>
              Manage and view the donor information
              connected to your BDBloodHub account.
            </p>

            <div
              style={{
                marginTop: "25px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: "600",
              }}
            >
              {donor.available ? (
                <>
                  <FaCheckCircle
                    style={{
                      color: "#16a34a",
                    }}
                  />
                  Available for donation
                </>
              ) : (
                <>
                  <FaExclamationCircle
                    style={{
                      color: "#dc2626",
                    }}
                  />
                  Currently unavailable
                </>
              )}
            </div>
          </div>

          <div className="auth-card">

            <div className="auth-card-header">
              <h2>{donor.name}</h2>

              <p>
                {editing
                  ? "Edit your donor information"
                  : "Donor information"}
              </p>
            </div>

            {success && (
              <div
                className="auth-success-message"
                style={{
                  marginBottom: "15px",
                  color: "#15803d",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                {success}
              </div>
            )}

            {error && (
              <div className="auth-error-message">
                {error}
              </div>
            )}

            {!editing ? (
              <div className="auth-form">

                <div className="auth-form-group">
                  <label>
                    <FaUser /> Full Name
                  </label>

                  <div className="auth-input-wrapper">
                    <FaUser />

                    <input
                      type="text"
                      value={donor.name || ""}
                      readOnly
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>
                    <FaEnvelope /> Email Address
                  </label>

                  <div className="auth-input-wrapper">
                    <FaEnvelope />

                    <input
                      type="email"
                      value={donor.email || ""}
                      readOnly
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>
                    <FaPhone /> Phone Number
                  </label>

                  <div className="auth-input-wrapper">
                    <FaPhone />

                    <input
                      type="text"
                      value={donor.phone || ""}
                      readOnly
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>
                    <FaTint /> Blood Group
                  </label>

                  <div className="auth-input-wrapper">
                    <FaTint />

                    <input
                      type="text"
                      value={
                        donor.blood_group || ""
                      }
                      readOnly
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>
                    <FaMapMarkerAlt /> District
                  </label>

                  <div className="auth-input-wrapper">
                    <FaMapMarkerAlt />

                    <input
                      type="text"
                      value={donor.district || ""}
                      readOnly
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>
                    <FaMapMarkerAlt /> Upazila
                  </label>

                  <div className="auth-input-wrapper">
                    <FaMapMarkerAlt />

                    <input
                      type="text"
                      value={donor.upazila || ""}
                      readOnly
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>
                    <FaCalendarAlt /> Last Donation
                  </label>

                  <div className="auth-input-wrapper">
                    <FaCalendarAlt />

                    <input
                      type="text"
                      value={formattedDate}
                      readOnly
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>
                    Donation Status
                  </label>

                  <div
                    style={{
                      padding: "12px 15px",
                      borderRadius: "8px",
                      background: donor.available
                        ? "#f0fdf4"
                        : "#fef2f2",
                      color: donor.available
                        ? "#15803d"
                        : "#b91c1c",
                      fontWeight: "600",
                    }}
                  >
                    {donor.available
                      ? "Available"
                      : "Not Available"}
                  </div>
                </div>

                <button
                  type="button"
                  className="auth-submit-btn"
                  onClick={handleEdit}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "10px",
                  }}
                >
                  <FaEdit />
                  Edit Profile
                </button>

                <a
                  href="/"
                  className="auth-submit-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    marginTop: "10px",
                  }}
                >
                  Back to Home
                </a>
              </div>
            ) : (
              <form
                className="auth-form"
                onSubmit={handleSave}
              >

                <div className="auth-form-group">
                  <label>
                    <FaUser /> Full Name
                  </label>

                  <div className="auth-input-wrapper">
                    <FaUser />

                    <input
                      type="text"
                      value={donor.name || ""}
                      readOnly
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>
                    <FaEnvelope /> Email Address
                  </label>

                  <div className="auth-input-wrapper">
                    <FaEnvelope />

                    <input
                      type="email"
                      value={donor.email || ""}
                      readOnly
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label htmlFor="profile-phone">
                    <FaPhone /> Phone Number
                  </label>

                  <div className="auth-input-wrapper">
                    <FaPhone />

                    <input
                      id="profile-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>
                    <FaTint /> Blood Group
                  </label>

                  <div className="auth-input-wrapper">
                    <FaTint />

                    <input
                      type="text"
                      value={
                        donor.blood_group || ""
                      }
                      readOnly
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label htmlFor="profile-district">
                    <FaMapMarkerAlt /> District
                  </label>

                  <div className="auth-input-wrapper">
                    <FaMapMarkerAlt />

                    <input
                      id="profile-district"
                      name="district"
                      type="text"
                      value={formData.district}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label htmlFor="profile-upazila">
                    <FaMapMarkerAlt /> Upazila
                  </label>

                  <div className="auth-input-wrapper">
                    <FaMapMarkerAlt />

                    <input
                      id="profile-upazila"
                      name="upazila"
                      type="text"
                      value={formData.upazila}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label htmlFor="profile-last-donation">
                    <FaCalendarAlt /> Last Donation
                  </label>

                  <div className="auth-input-wrapper">
                    <FaCalendarAlt />

                    <input
                      id="profile-last-donation"
                      name="last_donation_date"
                      type="date"
                      value={
                        formData.last_donation_date
                      }
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label htmlFor="profile-availability">
                    Donation Availability
                  </label>

                  <select
                    id="profile-availability"
                    value={
                      formData.available
                        ? "true"
                        : "false"
                    }
                    onChange={
                      handleAvailabilityChange
                    }
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "15px",
                      background: "#fff",
                    }}
                  >
                    <option value="true">
                      Available
                    </option>

                    <option value="false">
                      Not Available
                    </option>
                  </select>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={saving}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      flex: 1,
                    }}
                  >
                    <FaSave />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="auth-submit-btn"
                    onClick={handleCancel}
                    disabled={saving}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      flex: 1,
                      background: "#6b7280",
                    }}
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default MyDonorProfile;