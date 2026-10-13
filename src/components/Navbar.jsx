import { useEffect, useState } from "react";

import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

import { supabase } from "../supabase";
import { t, getLang, setLang } from "../i18n";

// [link, translation key]
const NAV_LINKS = [
  ["/", "nav_home"],
  ["/find-donors", "nav_find_donors"],
  ["/become-donor", "nav_become_donor"],
  ["/blood-requests", "nav_blood_requests"],
  ["/blood-guide", "nav_blood_guide"],
  ["/about", "nav_about"],
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const currentPath = window.location.pathname;
  const lang = getLang();

  const isActive = (path) => {
    return currentPath === path;
  };

  // The button shows the language you will switch TO
  const toggleLang = () => {
    setLang(lang === "bn" ? "en" : "bn");
  };

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return;
    }

    setMenuOpen(false);
    window.location.href = "/";
  };

  const userName =
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    t("nav_user_fallback");

  return (
    <nav className="navbar">
      <div className="container nav-container">

        {/* LOGO */}
        <a href="/" className="logo">
          <img
            src="/logo.png"
            alt="BDBloodHub"
            className="logo-img"
          />
        </a>

        {/* Desktop Menu */}
        <ul className="nav-links">
          {NAV_LINKS.map(([href, key]) => (
            <li key={href}>
              <a
                href={href}
                className={isActive(href) ? "active" : ""}
              >
                {t(key)}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Buttons */}
        <div className="nav-btns">
          <button
            type="button"
            className="lang-toggle"
            onClick={toggleLang}
          >
            {lang === "bn" ? "English" : "বাংলা"}
          </button>

          {user ? (
            <>
              <a
                href="/my-profile"
                className="user-profile-link"
                title={t("nav_my_profile")}
              >
                <FaUserCircle className="user-profile-icon" />
                <span className="user-greeting">
                  {t("nav_hi", { name: userName })}
                </span>
              </a>

              <button
                type="button"
                className="login-btn"
                onClick={handleLogout}
              >
                {t("nav_logout")}
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="login-btn"
              >
                {t("nav_login")}
              </a>

              <a
                href="/register"
                className="register-btn"
              >
                {t("nav_register")}
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          type="button"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label={t("nav_toggle_menu")}
        >
          {menuOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${
          menuOpen ? "show" : ""
        }`}
      >
        {NAV_LINKS.map(([href, key]) => (
          <a
            key={href}
            href={href}
            className={isActive(href) ? "active" : ""}
            onClick={() =>
              setMenuOpen(false)
            }
          >
            {t(key)}
          </a>
        ))}

        <div className="mobile-menu-buttons">
          <button
            type="button"
            className="lang-toggle"
            onClick={toggleLang}
          >
            {lang === "bn" ? "English" : "বাংলা"}
          </button>

          {user ? (
            <>
              <a
                href="/my-profile"
                className="user-greeting"
                onClick={() => setMenuOpen(false)}
              >
                {t("nav_hi", { name: userName })}
              </a>

              <button
                type="button"
                className="login-btn"
                onClick={handleLogout}
              >
                {t("nav_logout")}
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="login-btn"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                {t("nav_login")}
              </a>

              <a
                href="/register"
                className="register-btn"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                {t("nav_register")}
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;