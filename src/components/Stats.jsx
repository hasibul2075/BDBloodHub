import { useEffect, useState } from "react";
import { FaUsers, FaTint, FaHeart } from "react-icons/fa";
import { t, DATE_LOCALE } from "../i18n";

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
            <h3>{(Number(donorCount) || 0).toLocaleString(DATE_LOCALE)}</h3>
            <p>{t("stats_donors")}</p>
          </div>
        </div>

        <div className="stat-card">
          <FaTint />
          <div>
            <h3>{t("stats_247")}</h3>
            <p>{t("stats_availability")}</p>
          </div>
        </div>

        <div className="stat-card">
          <FaHeart />
          <div>
            <h3>{t("stats_100")}</h3>
            <p>{t("stats_community")}</p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Stats;