function BloodGroups() {
  const groups = [
    "A+",
    "A-",
    "B+",
    "B-",
    "O+",
    "O-",
    "AB+",
    "AB-",
  ];

  const handleGroupClick = (group) => {
    window.location.href =
  `/find-donors?blood=${encodeURIComponent(group)}`;
  };

  return (
    <section className="blood-groups">
      <div className="container">
        <span className="section-tag">QUICK SEARCH</span>

        <h2 className="section-title">
          Find by Blood Group
        </h2>

        <div className="group-grid">
          {groups.map((group) => (
            <div
              key={group}
              className="group-card"
              onClick={() => handleGroupClick(group)}
              style={{ cursor: "pointer" }}
            >
              {group}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BloodGroups;