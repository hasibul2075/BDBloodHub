function Donors() {
  const donors = [
    {
      name: "Rahim Ahmed",
      blood: "A+",
      location: "Dhaka",
      available: true,
    },
    {
      name: "Nusrat Jahan",
      blood: "B+",
      location: "Chittagong",
      available: true,
    },
    {
      name: "Tanvir Hasan",
      blood: "O+",
      location: "Khulna",
      available: false,
    },
    {
      name: "Sadia Islam",
      blood: "AB+",
      location: "Rajshahi",
      available: true,
    },
  ];

  return (
    <section className="donors">
      <div className="container">

        <span className="section-tag">AVAILABLE DONORS</span>

        <h2 className="section-title">
          Find Blood Donors Near You
        </h2>

        <div className="donor-grid">
          {donors.map((donor, index) => (
            <div className="donor-card" key={index}>

              <div className="donor-top">
                <div className="donor-avatar">
                  {donor.name.charAt(0)}
                </div>

                <div>
                  <h3>{donor.name}</h3>
                  <p>{donor.location}</p>
                </div>
              </div>

              <div className="donor-info">
                <span className="blood-badge">
                  {donor.blood}
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

      </div>
    </section>
  );
}

export default Donors;