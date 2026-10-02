import { useEffect, useState } from "react";

function Donors() {
  const [donors, setDonors] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

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

                <button className="contact-btn">
                  Contact Donor
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
    </section>
  );
}

export default Donors;