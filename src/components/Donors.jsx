import { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { t } from "../i18n";
import { supabase } from "../supabase";

function Donors() {
  const [donors, setDonors] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
    const [selectedDonor, setSelectedDonor] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadDonors = async () => {
      try {
        // Logged-in visitors send their token so the server includes phone numbers
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const res = await fetch(
          "https://bdbloodhub-backend.onrender.com/api/donors/search",
          session
            ? {
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                },
              }
            : undefined
        );

        const data = await res.json();

        if (data.success) {
          setDonors(data.donors);
        }
      } catch (err) {
        console.error("Donor load error:", err);
      }
    };

    loadDonors();
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
          {t("dn_tag")}
        </span>

        <h2 className="section-title">
          {t("fd_title")}
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
                      ? t("available_now")
                      : t("currently_unavailable")}
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
    ? t("contact_donor")
    : t("not_available")}
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
              {t("dn_show_more")}
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
            <h3>{t("contact_donor")}</h3>

            <p>
              <strong>{t("name_label")}:</strong>{" "}
              {selectedDonor.name}
            </p>

            <p>
              <strong>{t("blood_group")}:</strong>{" "}
              {selectedDonor.blood_group}
            </p>

            <p>
              <strong>{t("location_label")}:</strong>{" "}
              {selectedDonor.district}
            </p>

            {selectedDonor.phone ? (
              <>
                <div className="phone-box">
                  {selectedDonor.phone}
                </div>

                <button
                  type="button"
                  onClick={copyPhone}
                >
                  {copied
                    ? t("copied")
                    : t("copy_number")}
                </button>
              </>
            ) : (
              <>
                <p>{t("contact_login_text")}</p>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                >
                  {t("contact_login_btn")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/register";
                  }}
                >
                  {t("req_create_account")}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() =>
                setSelectedDonor(null)
              }
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Donors;