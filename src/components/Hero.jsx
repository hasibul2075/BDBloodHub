import { useState } from "react";
import { FaTint, FaChevronDown, FaCheck, FaMapMarkerAlt } from "react-icons/fa";
import { t } from "../i18n";

function Hero() {
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [isBloodOpen, setIsBloodOpen] = useState(false);

  const [location, setLocation] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

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

  // Bangladesh 64 Districts
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

  const searchText = location.trim().toLowerCase();

const filteredDistricts =
  searchText.length >= 2
    ? districts.filter((district) =>
        district.toLowerCase().includes(searchText)
      )
    : [];

  const handleBloodSelect = (group) => {
    setSelectedGroup(group);
    setIsBloodOpen(false);
  };

  const handleLocationSelect = (district) => {
    setLocation(district);
    setIsLocationOpen(false);
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;

    setLocation(value);
    setIsLocationOpen(true);
  };

  const handleSearch = () => {
    if (selectedGroup === "All" && !location.trim()) {
      alert(t("hero_alert_select"));
      return;
    }

    const params = new URLSearchParams();

    if (selectedGroup !== "All") {
      params.set("blood", selectedGroup);
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    window.location.href = `/find-donors?${params.toString()}`;
  };

  return (
    <section className="hero">
      <div className="container hero-container">

        {/* LEFT SIDE */}
        <div className="hero-left">

          <span className="badge">
            {t("hero_badge")}
          </span>

          <h1>
            {t("hero_title_1")} <br />
            {t("hero_title_2")}{" "}
            <span className="red">{t("hero_title_red")}</span>{" "}
            {t("hero_title_3")}
          </h1>

          <p>
            {t("hero_desc")}
          </p>

          {/* SEARCH BOX */}
          <div className="search-box">

            {/* BLOOD GROUP DROPDOWN */}
            <div className="blood-select-wrapper">

              <button
                type="button"
                className={`blood-select ${
                  isBloodOpen ? "active" : ""
                }`}
                onClick={() => setIsBloodOpen(!isBloodOpen)}
              >
                <span className="blood-select-left">

                  <span className="blood-icon">
                    <FaTint />
                  </span>

                  <span>
                    {t("blood_group")}:{" "}
                    <strong>
                      {selectedGroup === "All" ? t("all") : selectedGroup}
                    </strong>
                  </span>

                </span>

                <FaChevronDown
                  className={`chevron ${
                    isBloodOpen ? "rotate" : ""
                  }`}
                />
              </button>

              {isBloodOpen && (
                <div className="blood-dropdown">

                  {/* ALL */}
                  <button
                    type="button"
                    className={`blood-option ${
                      selectedGroup === "All"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleBloodSelect("All")
                    }
                  >

                    <span className="blood-option-left">

                      <span className="blood-icon small">
                        <FaTint />
                      </span>

                      <span>
                        {t("fd_blood_group_all")}
                      </span>

                    </span>

                    {selectedGroup === "All" && (
                      <FaCheck className="check-icon" />
                    )}

                  </button>

                  {/* BLOOD GROUPS */}
                  {bloodGroups.map((group) => (
                    <button
                      type="button"
                      className={`blood-option ${
                        selectedGroup === group
                          ? "selected"
                          : ""
                      }`}
                      key={group}
                      onClick={() =>
                        handleBloodSelect(group)
                      }
                    >

                      <span className="group-badge">
                        {group}
                      </span>

                      <span className="group-name">
                        {group}
                      </span>

                      {selectedGroup === group && (
                        <FaCheck className="check-icon" />
                      )}

                    </button>
                  ))}

                </div>
              )}

            </div>

            {/* LOCATION AUTOCOMPLETE */}
            <div className="location-wrapper">

              <div className="location-input-wrapper">

                <FaMapMarkerAlt className="location-icon" />

                <input
                  type="text"
                  placeholder={t("fd_location_placeholder")}
                  value={location}
                  onChange={handleLocationChange}
                  onFocus={() => {
  if (location.trim().length >= 2) {
    setIsLocationOpen(true);
  }
}}
                  onBlur={() => {
                    // একটু delay যাতে suggestion click কাজ করে
                    setTimeout(() => {
                      setIsLocationOpen(false);
                    }, 150);
                  }}
                />

                {location && (
                  <button
                    type="button"
                    className="clear-location"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setLocation("");
                      setIsLocationOpen(true);
                    }}
                  >
                    ×
                  </button>
                )}

              </div>

              {/* LOCATION SUGGESTIONS */}
              {isLocationOpen && (
                <div className="location-dropdown">

                  {filteredDistricts.length > 0 ? (
                    filteredDistricts.map((district) => (
                      <button
                        type="button"
                        className="location-option"
                        key={district}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleLocationSelect(district);
                        }}
                      >

                        <FaMapMarkerAlt />

                        <span>{district}</span>

                      </button>
                    ))
                  ) : (
                    <div className="no-location">
                      {t("hero_no_district")}
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* SEARCH BUTTON */}
            <button
              type="button"
              onClick={handleSearch}
            >
              {t("fd_search")}
            </button>

          </div>
        </div>

        {/* RIGHT SIDE */}
       

      </div>
    </section>
  );
}

export default Hero;