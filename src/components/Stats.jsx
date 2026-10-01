import { FaUsers, FaTint, FaHeart } from "react-icons/fa";

function Stats() {
  return (
    <section className="stats">
      <div className="container stats-container">

        <div className="stat-card">
          <FaUsers />
          <div>
            <h3>25,000+</h3>
            <p>Active Donors Registered</p>
          </div>
        </div>

        <div className="stat-card">
          <FaTint />
          <div>
            <h3>12,000+</h3>
            <p>Units Donated Globally</p>
          </div>
        </div>

        <div className="stat-card">
          <FaHeart />
          <div>
            <h3>8,500+</h3>
            <p>Critical Lives Saved</p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Stats;