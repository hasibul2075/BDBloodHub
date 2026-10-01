import { useEffect, useState } from "react";

import { FaBars, FaTimes } from "react-icons/fa";

import { supabase } from "../supabase";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const currentPath = window.location.pathname;

  const isActive = (path) => {
    return currentPath === path;
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
    "User";

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
          <li>
            <a
              href="/"
              className={
                isActive("/") ? "active" : ""
              }
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="/find-donors"
              className={
                isActive("/find-donors")
                  ? "active"
                  : ""
              }
            >
              Find Donors
            </a>
          </li>

          <li>
            <a
              href="/become-donor"
              className={
                isActive("/become-donor")
                  ? "active"
                  : ""
              }
            >
              Become a Donor
            </a>
          </li>

          <li>
            <a
              href="/about"
              className={
                isActive("/about")
                  ? "active"
                  : ""
              }
            >
              About Us
            </a>
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="nav-btns">
          {user ? (
            <>
              <a
  href="/my-profile"
  className="user-profile-link"
  title="My Profile"
>
  <FaUserCircle className="user-profile-icon" />
  <span className="user-greeting">
    Hi, {userName}
  </span>
</a>

              <button
                type="button"
                className="login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="login-btn"
              >
                Login
              </a>

              <a
                href="/register"
                className="register-btn"
              >
                Register
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
          aria-label="Toggle menu"
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
        <a
          href="/"
          className={
            isActive("/") ? "active" : ""
          }
          onClick={() =>
            setMenuOpen(false)
          }
        >
          Home
        </a>

        <a
          href="/find-donors"
          className={
            isActive("/find-donors")
              ? "active"
              : ""
          }
          onClick={() =>
            setMenuOpen(false)
          }
        >
          Find Donors
        </a>

        <a
          href="/become-donor"
          className={
            isActive("/become-donor")
              ? "active"
              : ""
          }
          onClick={() =>
            setMenuOpen(false)
          }
        >
          Become a Donor
        </a>

        <a
          href="/about"
          className={
            isActive("/about")
              ? "active"
              : ""
          }
          onClick={() =>
            setMenuOpen(false)
          }
        >
          About Us
        </a>

        <div className="mobile-menu-buttons">
          {user ? (
            <>
              <span className="user-greeting">
                Hi, {userName}
              </span>

              <button
                type="button"
                className="login-btn"
                onClick={handleLogout}
              >
                Logout
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
                Login
              </a>

              <a
                href="/register"
                className="register-btn"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                Register
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;