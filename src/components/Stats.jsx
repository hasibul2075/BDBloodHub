import { useEffect, useState } from "react";
import { FaUsers, FaTint, FaHeart } from "react-icons/fa";

function Stats() {
  const [donorCount, setDonorCount] = useState(0);

  useEffect(() => {
    fetch(
      "https://bdbloodhub-backend.onrender.com/api/stats"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDonorCount(data.donors);
        }
      })
      .catch((err) =>
        console.error("Stats error:", err)
      );
  }, []);

  return (
    <section className="stats">
      <div className="container stats-container">

        <div className="stat-card">
          <FaUsers />
          <div>
            <h3>{donorCount}</h3>
            <p>Active Donors Registered</p>
          </div>
        </div>

        <div className="stat-card">
          <FaTint />
          <div>
            <h3>24/7</h3>
            <p>Blood Donor Availability</p>
          </div>
        </div>

        <div className="stat-card">
          <FaHeart />
          <div>
            <h3>100%</h3>
            <p>Community Driven</p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Stats;