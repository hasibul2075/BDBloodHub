import { t } from "../i18n";

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
        <span className="section-tag">{t("bg_tag")}</span>

        <h2 className="section-title">
          {t("bg_title")}
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