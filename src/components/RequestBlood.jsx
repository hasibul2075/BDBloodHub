import { useEffect, useRef, useState } from "react";

import {
  FaCheckCircle,
  FaTint,
  FaChevronDown,
  FaCheck,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { supabase } from "../supabase";
import "../requests.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura",
  "Brahmanbaria", "Chandpur", "Chattogram", "Chuadanga", "Cox's Bazar",
  "Cumilla", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha",
  "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokathi",
  "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna", "Kishoreganj",
  "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur",
  "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj",
  "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore",
  "Nawabganj", "Netrokona", "Nilphamari", "Noakhali", "Pabna",
  "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi",
  "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj",
  "Sunamganj", "Sylhet", "Tangail", "Thakurgaon",
];

// Bangladesh mobile number, e.g. 017XXXXXXXX or +88017XXXXXXXX
const PHONE_REGEX = /^(\+?88)?01[3-9]\d{8}$/;

function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${d.getFullYear()}-${m}-${day}`;
}

const emptyForm = {
  patient_name: "",
  blood_group: "",
  units: "1",
  hospital: "",
  district: "",
  needed_date: "",
  urgent: false,
  contact_name: "",
  contact_phone: "",
  details: "",
};

function RequestBlood() {
  const [authState, setAuthState] = useState("checking"); // checking | login | ok

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const [isBloodOpen, setIsBloodOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const bloodRef = useRef(null);
  const districtRef = useRef(null);

  // Close the dropdowns when clicking / tapping outside of them
  useEffect(() => {
    const handleOutside = (e) => {
      if (bloodRef.current && !bloodRef.current.contains(e.target)) {
        setIsBloodOpen(false);
      }

      if (districtRef.current && !districtRef.current.contains(e.target)) {
        setIsDistrictOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutside);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
    };
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      setAuthState(session ? "ok" : "login");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setAuthState(session ? "ok" : "login");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const districtQuery = form.district.trim().toLowerCase();

  const filteredDistricts = DISTRICTS.filter((d) =>
    d.toLowerCase().includes(districtQuery)
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phone = form.contact_phone.replace(/[\s-]/g, "");
    const units = Number(form.units);

    const payload = {
      patient_name: form.patient_name.trim(),
      blood_group: form.blood_group,
      units,
      hospital: form.hospital.trim(),
      district: form.district.trim(),
      needed_date: form.needed_date,
      urgent: form.urgent,
      contact_name: form.contact_name.trim(),
      contact_phone: phone,
      details: form.details.trim() || null,
    };

    if (
      payload.patient_name.length < 2 ||
      !payload.blood_group ||
      !payload.hospital ||
      !payload.district ||
      !payload.needed_date ||
      payload.contact_name.length < 2
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!Number.isInteger(units) || units < 1 || units > 10) {
      setError("Bags of blood must be between 1 and 10.");
      return;
    }

    if (payload.needed_date < todayISO()) {
      setError("The required date cannot be in the past.");
      return;
    }

    if (!PHONE_REGEX.test(phone)) {
      setError(
        "Please enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX)."
      );
      return;
    }

    setSubmitting(true);
    setError("");

    const { error: insertError } = await supabase
      .from("blood_requests")
      .insert([payload]);

    setSubmitting(false);

    if (insertError) {
      setError(
        insertError.message ||
          "Could not submit your request. Please try again."
      );
      return;
    }

    setForm(emptyForm);
    setDone(true);
  };

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
              Login to <span>Request Blood</span>
            </h1>
            <p className="req-form-sub">
              To keep requests genuine and stop spam, you need to be
              logged in before posting a blood request.
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

  if (done) {
    return (
      <main className="req-page">
        <div className="req-wrap">
          <div className="req-form-card">
            <div className="req-success">
              <FaCheckCircle />
              <h2>Request submitted</h2>
              <p>
                Your request will appear on the Blood Requests page after
                our team verifies it. This usually takes a short time.
              </p>

              <div className="req-success-actions">
                <a href="/blood-requests" className="req-btn">
                  View Blood Requests
                </a>
                <button
                  type="button"
                  className="req-btn req-btn-light"
                  onClick={() => setDone(false)}
                >
                  Submit another
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="req-page">
      <div className="req-wrap">
        <div className="req-form-card">
          <h1>
            Request <span>Blood</span>
          </h1>
          <p className="req-form-sub">
            Fill in the details below. Your request is shown publicly,
            including the contact number, only after it is verified.
          </p>

          <form className="req-form" onSubmit={handleSubmit}>
            <label className="req-field">
              Patient name *
              <input
                name="patient_name"
                value={form.patient_name}
                onChange={handleChange}
                maxLength={80}
              />
            </label>

            <div className="req-field req-rel" ref={bloodRef}>
              <span>Blood group *</span>

              <div className="req-drop req-drop-full">
                <button
                  type="button"
                  className={`req-drop-btn ${isBloodOpen ? "active" : ""}`}
                  onClick={() => {
                    setIsBloodOpen(!isBloodOpen);
                    setIsDistrictOpen(false);
                  }}
                >
                  <span className="req-drop-left">
                    <span className="req-drop-icon">
                      <FaTint />
                    </span>

                    {form.blood_group ? (
                      <strong>{form.blood_group}</strong>
                    ) : (
                      <span className="req-drop-placeholder">
                        Select blood group
                      </span>
                    )}
                  </span>

                  <FaChevronDown
                    className={`req-drop-chevron ${
                      isBloodOpen ? "rotate" : ""
                    }`}
                  />
                </button>

                {isBloodOpen && (
                  <div className="req-drop-menu">
                    {BLOOD_GROUPS.map((g) => (
                      <button
                        type="button"
                        key={g}
                        className={`req-drop-option ${
                          form.blood_group === g ? "selected" : ""
                        }`}
                        onClick={() => {
                          setForm((prev) => ({ ...prev, blood_group: g }));
                          setError("");
                          setIsBloodOpen(false);
                        }}
                      >
                        <span className="req-drop-badge">{g}</span>

                        <span className="req-drop-name">{g}</span>

                        {form.blood_group === g && (
                          <FaCheck className="req-drop-check" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <label className="req-field">
              Bags of blood *
              <input
                name="units"
                type="number"
                min="1"
                max="10"
                value={form.units}
                onChange={handleChange}
              />
            </label>

            <label className="req-field">
              Required date *
              <input
                name="needed_date"
                type="date"
                min={todayISO()}
                value={form.needed_date}
                onChange={handleChange}
              />
            </label>

            <label className="req-field">
              Hospital *
              <input
                name="hospital"
                value={form.hospital}
                onChange={handleChange}
                maxLength={120}
              />
            </label>

            <div className="req-field req-rel" ref={districtRef}>
              <span>District *</span>

              <div className="req-loc">
                <FaMapMarkerAlt className="req-loc-icon" />

                <input
                  name="district"
                  autoComplete="off"
                  placeholder="Enter district..."
                  value={form.district}
                  onChange={(e) => {
                    handleChange(e);
                    setIsDistrictOpen(true);
                    setIsBloodOpen(false);
                  }}
                  onFocus={() => {
                    setIsDistrictOpen(true);
                    setIsBloodOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" || e.key === "Tab") {
                      setIsDistrictOpen(false);
                    }
                  }}
                  maxLength={60}
                />

                {form.district && (
                  <button
                    type="button"
                    className="req-loc-clear"
                    aria-label="Clear district"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, district: "" }));
                      setIsDistrictOpen(true);
                    }}
                  >
                    ×
                  </button>
                )}
              </div>

              {isDistrictOpen && filteredDistricts.length > 0 && (
                <div className="req-drop-menu req-loc-menu">
                  {filteredDistricts.map((d) => (
                    <button
                      type="button"
                      key={d}
                      className="req-loc-option"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, district: d }));
                        setError("");
                        setIsDistrictOpen(false);
                      }}
                    >
                      <FaMapMarkerAlt />

                      <span>{d}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <label className="req-field">
              Contact person *
              <input
                name="contact_name"
                value={form.contact_name}
                onChange={handleChange}
                maxLength={80}
              />
            </label>

            <label className="req-field">
              Contact phone *
              <input
                name="contact_phone"
                type="tel"
                placeholder="017XXXXXXXX"
                value={form.contact_phone}
                onChange={handleChange}
              />
            </label>

            <label className="req-field req-full">
              Extra details (optional)
              <textarea
                name="details"
                value={form.details}
                onChange={handleChange}
                maxLength={300}
                placeholder="Ward / bed number, reason, best time to call..."
              />
            </label>

            <label className="req-check req-full">
              <input
                name="urgent"
                type="checkbox"
                checked={form.urgent}
                onChange={handleChange}
              />
              This is urgent (needed within 24 hours)
            </label>

            {error && (
              <div className="req-alert req-alert-err req-full">
                {error}
              </div>
            )}

            <p className="req-note req-full">
              You can have up to 3 requests waiting for approval at a
              time. Fake or misleading requests will be removed.
            </p>

            <div className="req-full">
              <button
                type="submit"
                className="req-btn"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default RequestBlood;