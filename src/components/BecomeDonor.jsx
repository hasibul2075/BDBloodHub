import { useState } from "react";
import { supabase } from "../supabase";

import {
  FaUser,
  FaTint,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChevronDown,
  FaCheck,
} from "react-icons/fa";

function BecomeDonor() {
  const [formData, setFormData] = useState({
    name: "",
    blood: "",
    phone: "",
    email: "",
    location: "",
    lastDonation: "",
    available: "Yes",
  });

  const [bloodOpen, setBloodOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bloodGroups = [
    "A+",
    "A-",
    "B+",
    "B-",
    "O+",
    "O-",
    "AB+",
    "AB-",
  ];

  const districts = [
    "Bagerhat",
    "Bandarban",
    "Barguna",
    "Barishal",
    "Bhola",
    "Bogura",
    "Brahmanbaria",
    "Chandpur",
    "Chattogram",
    "Chuadanga",
    "Cox's Bazar",
    "Cumilla",
    "Dhaka",
    "Dinajpur",
    "Faridpur",
    "Feni",
    "Gaibandha",
    "Gazipur",
    "Gopalganj",
    "Habiganj",
    "Jamalpur",
    "Jashore",
    "Jhalokathi",
    "Jhenaidah",
    "Joypurhat",
    "Khagrachhari",
    "Khulna",
    "Kishoreganj",
    "Kurigram",
    "Kushtia",
    "Lakshmipur",
    "Lalmonirhat",
    "Madaripur",
    "Magura",
    "Manikganj",
    "Meherpur",
    "Moulvibazar",
    "Munshiganj",
    "Mymensingh",
    "Naogaon",
    "Narail",
    "Narayanganj",
    "Narsingdi",
    "Natore",
    "Nawabganj",
    "Netrokona",
    "Nilphamari",
    "Noakhali",
    "Pabna",
    "Panchagarh",
    "Patuakhali",
    "Pirojpur",
    "Rajbari",
    "Rajshahi",
    "Rangamati",
    "Rangpur",
    "Satkhira",
    "Shariatpur",
    "Sherpur",
    "Sirajganj",
    "Sunamganj",
    "Sylhet",
    "Tangail",
    "Thakurgaon",
  ];

  const filteredDistricts =
    formData.location.trim().length >= 2
      ? districts.filter((district) =>
          district
            .toLowerCase()
            .includes(formData.location.trim().toLowerCase())
        )
      : [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleBloodSelect = (group) => {
    setFormData((prev) => ({
      ...prev,
      blood: group,
    }));

    setBloodOpen(false);
    setError("");
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      location: value,
    }));

    setLocationOpen(value.trim().length >= 2);
    setError("");
  };

  const handleLocationSelect = (district) => {
    setFormData((prev) => ({
      ...prev,
      location: district,
    }));

    setLocationOpen(false);
  };

  // ===============================
  // SUBMIT DONOR TO BACKEND
  // ===============================
const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSubmitted(false);
  setLoading(true);

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error(
        "Please login before registering as a donor."
      );
    }

    const response = await fetch(
      "http://localhost:5000/api/donors",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          blood_group: formData.blood,
          district: formData.location,
          upazila: formData.location,
          last_donation_date:
            formData.lastDonation || null,
          available: formData.available === "Yes",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Failed to register as donor."
      );
    }

    setSubmitted(true);

    setFormData({
      name: "",
      blood: "",
      phone: "",
      email: "",
      location: "",
      lastDonation: "",
      available: "Yes",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  } catch (error) {
    console.error(
      "Donor registration error:",
      error
    );

    setError(
      error.message ||
        "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="become-donor-page">
      {/* PAGE HEADER */}
      <section className="become-donor-header">
        <div className="container">
          <span className="section-tag">
            BECOME A DONOR
          </span>

          <h1>Become a Blood Donor</h1>

          <p>
            Your one donation can make a difference in someone's
            life. Register yourself as a donor and help people in need.
          </p>
        </div>
      </section>

      {/* REGISTRATION SECTION */}
      <section className="donor-registration">
        <div className="container">
          <div className="donor-form-wrapper">

            {/* FORM INTRO */}
            <div className="donor-form-intro">
              <span className="section-tag">
                DONOR REGISTRATION
              </span>

              <h2>Register as a Donor</h2>

              <p>
                Fill in your information below so people can find
                you when they need blood.
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="donor-form"
            >

              {/* FULL NAME */}
              <div className="form-group">
                <label htmlFor="name">
                  Full Name
                </label>

                <div className="input-wrapper">
                  <FaUser />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* BLOOD GROUP */}
              <div className="form-group">
                <label>
                  Blood Group
                </label>

                <div className="donor-blood-wrapper">

                  <button
                    type="button"
                    className={`donor-blood-select ${
                      bloodOpen ? "active" : ""
                    }`}
                    onClick={() => {
                      setBloodOpen((prev) => !prev);
                      setLocationOpen(false);
                    }}
                  >
                    <span className="donor-blood-left">
                      <span className="donor-blood-icon">
                        <FaTint />
                      </span>

                      <span>
                        {formData.blood
                          ? formData.blood
                          : "Select blood group"}
                      </span>
                    </span>

                    <FaChevronDown
                      className={`donor-blood-chevron ${
                        bloodOpen ? "rotate" : ""
                      }`}
                    />
                  </button>

                  {bloodOpen && (
                    <div className="donor-blood-dropdown">

                      {/* DEFAULT OPTION */}
                      <button
                        type="button"
                        className={`donor-blood-option ${
                          formData.blood === ""
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            blood: "",
                          }));

                          setBloodOpen(false);
                        }}
                      >
                        <span className="donor-option-placeholder">
                          Select blood group
                        </span>

                        {formData.blood === "" && (
                          <FaCheck className="donor-blood-check" />
                        )}
                      </button>

                      {/* BLOOD GROUP OPTIONS */}
                      {bloodGroups.map((group) => (
                        <button
                          type="button"
                          key={group}
                          className={`donor-blood-option ${
                            formData.blood === group
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleBloodSelect(group)
                          }
                        >
                          <span className="donor-group-badge">
                            {group}
                          </span>

                          <span className="donor-group-name">
                            {group}
                          </span>

                          {formData.blood === group && (
                            <FaCheck className="donor-blood-check" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* PHONE */}
              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number
                </label>

                <div className="input-wrapper">
                  <FaPhoneAlt />

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <div className="input-wrapper">
                  <FaEnvelope />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* LOCATION */}
              <div className="form-group">
                <label htmlFor="location">
                  District / Location
                </label>

                <div className="donor-location-wrapper">

                  <div className="input-wrapper">
                    <FaMapMarkerAlt />

                    <input
                      id="location"
                      type="text"
                      name="location"
                      placeholder="Enter your district"
                      value={formData.location}
                      onChange={handleLocationChange}
                      onFocus={() => {
                        if (
                          formData.location.trim().length >= 2
                        ) {
                          setLocationOpen(true);
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setLocationOpen(false);
                        }, 150);
                      }}
                      required
                    />
                  </div>

                  {/* LOCATION SUGGESTIONS */}
                  {locationOpen &&
                    filteredDistricts.length > 0 && (
                      <div className="donor-location-dropdown">

                        {filteredDistricts.map((district) => (
                          <button
                            type="button"
                            key={district}
                            className="donor-location-option"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleLocationSelect(district);
                            }}
                          >
                            <FaMapMarkerAlt />

                            <span>
                              {district}
                            </span>
                          </button>
                        ))}

                      </div>
                    )}
                </div>
              </div>

              {/* LAST DONATION */}
              <div className="form-group">
                <label htmlFor="lastDonation">
                  Last Donation Date
                </label>

                <div className="input-wrapper">
                  <FaCalendarAlt />

                  <input
                    id="lastDonation"
                    type="date"
                    name="lastDonation"
                    value={formData.lastDonation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* AVAILABILITY */}
              <div className="form-group availability-group">
                <label>
                  Are you currently available to donate?
                </label>

                <div className="availability-options">

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="available"
                      value="Yes"
                      checked={
                        formData.available === "Yes"
                      }
                      onChange={handleChange}
                    />

                    <span>
                      Yes, I'm available
                    </span>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="available"
                      value="No"
                      checked={
                        formData.available === "No"
                      }
                      onChange={handleChange}
                    />

                    <span>
                      Not right now
                    </span>
                  </label>

                </div>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="donor-error-message">
                  {error}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="donor-submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Registering..."
                  : "Register as Donor"}
              </button>

              {/* SUCCESS MESSAGE */}
              {submitted && (
                <div className="donor-success-message">
                  ✓ Registration submitted successfully!
                </div>
              )}

            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BecomeDonor;