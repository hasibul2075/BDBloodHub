import { useState } from "react";
import { FaTint, FaChevronDown, FaCheck, FaMapMarkerAlt } from "react-icons/fa";

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
      alert("Please select a blood group or enter a location.");
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
            URGENT DONATION PLATFORM
          </span>

          <h1>
            Find Blood Donors <br />
            Near You —{" "}
            <span className="red">Save a Life</span>{" "}
            Today
          </h1>

          <p>
            Join our network of thousands of volunteer donors.
            Quick search, immediate contact and secure process.
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
                    Blood Group:{" "}
                    <strong>{selectedGroup}</strong>
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
                        Blood Group: All
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
                  placeholder="Enter Location..."
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
                      No district found
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
              Search Donors
            </button>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-right">

          <div className="hero-image">

            <img
              src="/hero.jpg"
              alt="Blood Donation"
            />

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;