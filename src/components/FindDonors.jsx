import { useEffect, useMemo, useState } from "react";

import {
  FaTint,
  FaMapMarkerAlt,
  FaSearch,
  FaPhoneAlt,
  FaChevronDown,
  FaCheck,
} from "react-icons/fa";
import { t } from "../i18n";
import { supabase } from "../supabase";

function FindDonors() {
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [copied, setCopied] = useState(false);
  const params = new URLSearchParams(window.location.search);

  const initialBlood = params.get("blood") || "All";
  const initialLocation = params.get("location") || "";

  const [bloodGroup, setBloodGroup] = useState(initialBlood);
  const [location, setLocation] = useState(initialLocation);

  const [isBloodOpen, setIsBloodOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const [donors, setDonors] = useState([]);
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

  // =========================
  // LOCATION AUTOCOMPLETE
  // =========================

  const filteredDistricts =
    location.trim().length >= 2
      ? districts.filter((district) =>
          district
            .toLowerCase()
            .includes(location.trim().toLowerCase())
        )
      : [];

  // =========================
  // FETCH DONORS
  // =========================

  const fetchDonors = async (
    selectedBlood = bloodGroup,
    selectedLocation = location
  ) => {
    setLoading(true);
    setError("");

    try {
      const queryParams = new URLSearchParams();

      if (
        selectedBlood &&
        selectedBlood !== "All"
      ) {
        queryParams.set(
          "blood_group",
          selectedBlood
        );
      }

      if (
        selectedLocation &&
        selectedLocation.trim() !== ""
      ) {
        queryParams.set(
          "district",
          selectedLocation.trim()
        );
      }

      const query = queryParams.toString();

      const url = `https://bdbloodhub-backend.onrender.com/api/donors/search${
  query ? `?${query}` : ""
}`;

      console.log("SEARCH URL:", url);

      // Logged-in visitors send their token so the server includes phone numbers
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(
        url,
        session
          ? {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            }
          : undefined
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(t("fd_err_fetch"));
      }

      setDonors(data.donors || []);
    } catch (error) {
      console.error(
        "Find donors error:",
        error
      );

            setError(
        error.message || t("fd_err_generic")
      );

      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD DONORS ON PAGE OPEN
  // =========================

  useEffect(() => {
    fetchDonors(
      initialBlood,
      initialLocation
    );
  }, []);

  // =========================
  // BLOOD SELECT
  // =========================

  const handleBloodSelect = async (group) => {
  setBloodGroup(group);
  setIsBloodOpen(false);

  await fetchDonors(group, location);

  const newParams = new URLSearchParams();

  if (group !== "All") {
    newParams.set("blood", group);
  }

  if (location.trim()) {
    newParams.set("location", location.trim());
  }

  const query = newParams.toString();

  window.history.pushState(
    {},
    "",
    query
      ? `/find-donors?${query}`
      : "/find-donors"
  );
};
  // =========================
  // LOCATION SELECT
  // =========================

  const handleLocationSelect = async (district) => {
  setLocation(district);
  setIsLocationOpen(false);

  await fetchDonors(bloodGroup, district);

  const newParams = new URLSearchParams();

  if (bloodGroup !== "All") {
    newParams.set("blood", bloodGroup);
  }

  if (district.trim()) {
    newParams.set("location", district.trim());
  }

  const query = newParams.toString();

  window.history.pushState(
    {},
    "",
    query
      ? `/find-donors?${query}`
      : "/find-donors"
  );
};

  // =========================
  // LOCATION INPUT
  // =========================

  const handleLocationChange = (e) => {
    const value = e.target.value;

    setLocation(value);

    if (value.trim().length >= 2) {
      setIsLocationOpen(true);
    } else {
      setIsLocationOpen(false);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const handleSearch = async () => {
    const selectedBlood = bloodGroup;
    const selectedLocation = location;

    const newParams = new URLSearchParams();

    if (selectedBlood !== "All") {
      newParams.set(
        "blood",
        selectedBlood
      );
    }

    if (selectedLocation.trim()) {
      newParams.set(
        "location",
        selectedLocation.trim()
      );
    }

    const query = newParams.toString();

    window.history.pushState(
      {},
      "",
      query
        ? `/find-donors?${query}`
        : "/find-donors"
    );

    setIsBloodOpen(false);
    setIsLocationOpen(false);

    await fetchDonors(
      selectedBlood,
      selectedLocation
    );
  };

  // =========================
  // RESET
  // =========================

  const handleReset = async () => {
    setBloodGroup("All");
    setLocation("");

    setIsBloodOpen(false);
    setIsLocationOpen(false);

    window.history.pushState(
      {},
      "",
      "/find-donors"
    );

    await fetchDonors(
      "All",
      ""
    );
  };
const copyPhone = async () => {
  await navigator.clipboard.writeText(
    selectedDonor.phone
  );

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
};
  // =========================
  // FORMAT DONOR DATA
  // =========================

  const formattedDonors = useMemo(() => {
    return donors.map((donor) => ({
      id: donor.id,
      name: donor.name,
      blood: donor.blood_group,
      location: donor.district,
      phone: donor.phone,
      available: donor.available,
    }));
  }, [donors]);

  return (
    <main className="find-donors-page">

      {/* ========================= */}
      {/* PAGE HEADER */}
      {/* ========================= */}

      <section className="find-donors-header">
        <div className="container">
          <span className="section-tag">
            {t("fd_tag")}
          </span>

          <h1>
            {t("fd_title")}
          </h1>

          <p>
            {t("fd_subtitle")}
          </p>
        </div>
      </section>

      {/* ========================= */}
      {/* SEARCH FILTER */}
      {/* ========================= */}

      <section className="find-donors-search">
        <div className="container">
          <div className="find-search-box">

            {/* BLOOD GROUP */}

            <div className="find-blood-wrapper">

              <button
                type="button"
                className={`find-blood-select ${
                  isBloodOpen
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setIsBloodOpen(
                    !isBloodOpen
                  );

                  setIsLocationOpen(false);
                }}
              >
                <span className="find-filter-left">

                  <span className="find-filter-icon">
                    <FaTint />
                  </span>

                  <span>
                    {t("blood_group")}:{" "}
                    <strong>
                      {bloodGroup === "All"
                        ? t("all")
                        : bloodGroup}
                    </strong>
                  </span>

                </span>

                <FaChevronDown
                  className={`find-chevron ${
                    isBloodOpen
                      ? "rotate"
                      : ""
                  }`}
                />
              </button>

              {isBloodOpen && (
                <div className="find-blood-dropdown">

                  {/* ALL */}

                  <button
                    type="button"
                    className={`find-blood-option ${
                      bloodGroup === "All"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleBloodSelect("All")
                    }
                  >
                    <span className="find-option-left">

                      <span className="find-small-tint">
                        <FaTint />
                      </span>

                      <span>
                        {t("fd_blood_group_all")}
                      </span>

                    </span>

                    {bloodGroup === "All" && (
                      <FaCheck className="find-check" />
                    )}
                  </button>

                  {/* BLOOD GROUPS */}

                  {bloodGroups.map(
                    (group) => (
                      <button
                        type="button"
                        className={`find-blood-option ${
                          bloodGroup === group
                            ? "selected"
                            : ""
                        }`}
                        key={group}
                        onClick={() =>
                          handleBloodSelect(
                            group
                          )
                        }
                      >
                        <span className="find-group-badge">
                          {group}
                        </span>

                        <span className="find-group-name">
                          {group}
                        </span>

                        {bloodGroup === group && (
                          <FaCheck className="find-check" />
                        )}
                      </button>
                    )
                  )}

                </div>
              )}

            </div>

            {/* LOCATION */}

            <div className="find-location-wrapper">

              <div className="find-location-input">

                <FaMapMarkerAlt
                  className="find-location-icon"
                />

                <input
                  type="text"
                  placeholder={t("fd_location_placeholder")}
                  value={location}
                  onChange={
                    handleLocationChange
                  }
                  onFocus={() => {
                    if (
                      location.trim()
                        .length >= 2
                    ) {
                      setIsLocationOpen(
                        true
                      );
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsLocationOpen(
                        false
                      );
                    }, 150);
                  }}
                />

                {location && (
                  <button
                    type="button"
                    className="find-clear-location"
                    onMouseDown={(e) => {
                      e.preventDefault();

                      setLocation("");
                      setIsLocationOpen(
                        false
                      );
                    }}
                  >
                    ×
                  </button>
                )}

              </div>

              {isLocationOpen &&
                filteredDistricts.length >
                  0 && (
                  <div className="find-location-dropdown">

                    {filteredDistricts.map(
                      (district) => (
                        <button
                          type="button"
                          className="find-location-option"
                          key={district}
                          onMouseDown={(e) => {
                            e.preventDefault();

                            handleLocationSelect(
                              district
                            );
                          }}
                        >
                          <FaMapMarkerAlt />

                          <span>
                            {district}
                          </span>
                        </button>
                      )
                    )}

                  </div>
                )}

            </div>

            {/* SEARCH BUTTON */}

            <button
              type="button"
              className="find-search-btn"
              onClick={handleSearch}
              disabled={loading}
            >
              <FaSearch />

              {loading
                ? t("fd_searching")
                : t("fd_search")}
            </button>

            {/* RESET BUTTON */}

            <button
              type="button"
              className="find-reset-btn"
              onClick={handleReset}
              disabled={loading}
            >
              {t("fd_reset")}
            </button>

          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* DONOR RESULTS */}
      {/* ========================= */}

      <section className="donor-results">
        <div className="container">

          <div className="results-heading">

            <div>

              <span className="section-tag">
                {t("fd_results_tag")}
              </span>

              <h2>
                {t("fd_results_title")}
              </h2>

            </div>

            {!loading &&
              !error && (
                <span className="result-count">
                                    {t(
                    formattedDonors.length === 1
                      ? "fd_found_one"
                      : "fd_found_many",
                    { n: formattedDonors.length }
                  )}
                </span>
              )}

          </div>

          {/* ========================= */}
          {/* LOADING */}
          {/* ========================= */}

          {loading ? (

            <div className="no-donors">

              <div className="no-donors-icon">
                <FaTint />
              </div>

              <h3>
                {t("fd_loading_title")}
              </h3>

              <p>
                {t("fd_loading_text")}
              </p>

            </div>

          ) : error ? (

            /* ========================= */
            /* ERROR */
            /* ========================= */

            <div className="no-donors">

              <div className="no-donors-icon">
                <FaTint />
              </div>

              <h3>
                {t("fd_error_title")}
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="no-donors-reset"
                onClick={() =>
                  fetchDonors(
                    bloodGroup,
                    location
                  )
                }
              >
                {t("fd_try_again")}
              </button>

            </div>

          ) : formattedDonors.length >
            0 ? (

            /* ========================= */
            /* DONOR CARDS */
            /* ========================= */

            <div className="find-donor-grid">

              {formattedDonors.map(
                (donor) => (

                  <div
                    className="find-donor-card"
                    key={donor.id}
                  >

                    <div className="find-donor-top">

                      <div className="find-donor-avatar">
                        {donor.name.charAt(
                          0
                        )}
                      </div>

                      <div>

                        <h3>
                          {donor.name}
                        </h3>

                        <div className="donor-location">

                          <FaMapMarkerAlt />

                          <span>
                            {donor.location}
                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="find-donor-info">

                      <span className="find-blood-badge">

                        <FaTint />

                        {donor.blood}

                      </span>

                      <span
                        className={
                          donor.available
                            ? "donor-available"
                            : "donor-unavailable"
                        }
                      >

                        <span className="status-dot"></span>

                        {donor.available
                          ? t("available_now")
                          : t("currently_unavailable")}

                      </span>

                    </div>

                    <button
                      type="button"
                      className="contact-donor-btn"
                      disabled={
                        !donor.available
                      }
                      onClick={() => {
  if (donor.available) {
    setSelectedDonor(donor);
  }
}}
                    >

                      <FaPhoneAlt />

                      {donor.available
                        ? t("contact_donor")
                        : t("not_available")}

                    </button>

                  </div>

                )
              )}

            </div>

          ) : (

            /* ========================= */
            /* NO DONORS */
            /* ========================= */

            <div className="no-donors">

              <div className="no-donors-icon">
                <FaTint />
              </div>

              <h3>
                {t("fd_none_title")}
              </h3>

              <p>
                {t("fd_none_text")}
              </p>

              <button
                type="button"
                className="no-donors-reset"
                onClick={handleReset}
              >
                {t("fd_clear")}
              </button>

            </div>

          )}

        </div>
      </section>
{selectedDonor && (
  <div className="contact-modal-overlay">
    <div className="contact-modal">
      <h3>{t("contact_donor")}</h3>

      <p>
       <strong>{t("name_label")}:</strong>{" "}
        {selectedDonor.name}
      </p>

      <p>
        <strong>{t("blood_group")}:</strong>{" "}
        {selectedDonor.blood}
      </p>

      <p>
        <strong>{t("location_label")}:</strong>{" "}
        {selectedDonor.location}
      </p>

      {selectedDonor.phone ? (
        <>
          <div className="phone-box">
            {selectedDonor.phone}
          </div>

          <button onClick={copyPhone}>
            {t("copy_number")}
          </button>

          {copied && <p>{t("copied")}</p>}
        </>
      ) : (
        <>
          <p>{t("contact_login_text")}</p>

          <button
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            {t("contact_login_btn")}
          </button>

          <button
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            {t("req_create_account")}
          </button>
        </>
      )}

      <button
        onClick={() =>
          setSelectedDonor(null)
        }
      >
        {t("close")}
      </button>
    </div>
  </div>
)}
    </main>
  );
}

export default FindDonors;