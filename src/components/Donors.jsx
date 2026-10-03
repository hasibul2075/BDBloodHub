import { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";

function Donors() {
  const [donors, setDonors] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
    const [selectedDonor, setSelectedDonor] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(
      "https://bdbloodhub-backend.onrender.com/api/donors/search"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDonors(data.donors);
        }
      })
      .catch((err) =>
        console.error("Donor load error:", err)
      );
  }, []);
    const copyPhone = async () => {
    if (!selectedDonor?.phone) return;

    await navigator.clipboard.writeText(
      selectedDonor.phone
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section className="donors">
      <div className="container">
        <span className="section-tag">
          AVAILABLE DONORS
        </span>

        <h2 className="section-title">
          Find Blood Donors Near You
        </h2>

        <div className="donor-grid">
          {donors
            .slice(0, visibleCount)
            .map((donor) => (
              <div
                className="donor-card"
                key={donor.id}
              >
                <div className="donor-top">
                  <div className="donor-avatar">
                    {donor.name.charAt(0)}
                  </div>

                  <div>
                    <h3>{donor.name}</h3>
                    <p>{donor.district}</p>
                  </div>
                </div>

                <div className="donor-info">
                  <span className="blood-badge">
                    {donor.blood_group}
                  </span>

                  <span
                    className={
                      donor.available
                        ? "available"
                        : "unavailable"
                    }
                  >
                    {donor.available
                      ? "Available Now"
                      : "Currently Unavailable"}
                  </span>
                </div>

                <button
  type="button"
  className="contact-btn"
  disabled={!donor.available}
  onClick={() => {
    if (donor.available) {
      setSelectedDonor(donor);
      setCopied(false);
    }
  }}
>
  <FaPhoneAlt />

  {donor.available
    ? "Contact Donor"
    : "Not Available"}
</button>
              </div>
            ))}
        </div>

        {visibleCount < donors.length && (
          <div className="show-more-wrapper">
            <button
              className="show-more-btn"
              onClick={() =>
                setVisibleCount(
                  (prev) => prev + 4
                )
              }
            >
              Show More
            </button>
          </div>
        )}
      </div>
            {selectedDonor && (
        <div
          className="contact-modal-overlay"
          onClick={() => setSelectedDonor(null)}
        >
          <div
            className="contact-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Contact Donor</h3>

            <p>
              <strong>Name:</strong>{" "}
              {selectedDonor.name}
            </p>

            <p>
              <strong>Blood Group:</strong>{" "}
              {selectedDonor.blood_group}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {selectedDonor.district}
            </p>

            <div className="phone-box">
              {selectedDonor.phone}
            </div>

            <button
              type="button"
              onClick={copyPhone}
            >
              {copied
                ? "Copied!"
                : "Copy Number"}
            </button>

            <button
              type="button"
              onClick={() =>
                setSelectedDonor(null)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Donors;