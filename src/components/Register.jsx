import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTint,
} from "react-icons/fa";

import { supabase } from "../supabase";

function Register() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(false);
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            data: {
              name: formData.name.trim(),
              phone: formData.phone.trim(),
            },
          },
        });

      if (signUpError) {
        throw signUpError;
      }

      console.log("REGISTER RESPONSE:", data);

      // Existing email check
      if (
        data?.user &&
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0
      ) {
        setError(
          "An account with this email already exists. Please login instead."
        );

        return;
      }

      // New account
      setSubmitted(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      const message =
        error.message || "";

      if (
        message
          .toLowerCase()
          .includes("already registered")
      ) {
        setError(
          "An account with this email already exists. Please login instead."
        );
      } else {
        setError(
          message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-section">
        <div className="auth-container">

          <div className="auth-info">

            <div className="auth-logo-icon">
              <FaTint />
            </div>

            <span className="section-tag">
              JOIN OUR COMMUNITY
            </span>

            <h1>
              Create Your
              <span> BDBloodHub</span> Account
            </h1>

            <p>
              Create an account to connect with blood
              donors, manage your information and become
              part of a community helping people in need.
            </p>

          </div>

          <div className="auth-card">

            <div className="auth-card-header">

              <h2>Register</h2>

              <p>
                Create your account to get started.
              </p>

            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >

              <div className="auth-form-group">

                <label htmlFor="register-name">
                  Full Name
                </label>

                <div className="auth-input-wrapper">

                  <FaUser />

                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="auth-form-group">

                <label htmlFor="register-email">
                  Email Address
                </label>

                <div className="auth-input-wrapper">

                  <FaEnvelope />

                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="auth-form-group">

                <label htmlFor="register-phone">
                  Phone Number
                </label>

                <div className="auth-input-wrapper">

                  <FaPhoneAlt />

                  <input
                    id="register-phone"
                    type="tel"
                    name="phone"
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="auth-form-group">

                <label htmlFor="register-password">
                  Password
                </label>

                <div className="auth-input-wrapper">

                  <FaLock />

                  <input
                    id="register-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

              </div>

              <div className="auth-form-group">

                <label htmlFor="register-confirm-password">
                  Confirm Password
                </label>

                <div className="auth-input-wrapper">

                  <FaLock />

                  <input
                    id="register-confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

              </div>

              {error && (
                <div className="auth-error-message">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

              {submitted && (
                <div className="auth-success-message">
                  Account created successfully! Please
                  check your email to verify your account.
                </div>
              )}

            </form>

            <div className="auth-bottom-text">

              <span>
                Already have an account?
              </span>

              <a href="/login">
                Login
              </a>

            </div>

          </div>

        </div>
      </section>
    </main>
  );
}

export default Register;