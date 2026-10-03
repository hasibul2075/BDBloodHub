import { useState } from "react";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTint,
} from "react-icons/fa";

import { supabase } from "../supabase";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

      if (loginError) {
        throw loginError;
      }

      console.log("LOGIN SUCCESS:", data);

setSubmitted(true);

setTimeout(() => {
  window.location.href = "/";
}, 1000);
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page login-page">
      <section className="auth-section">
        <div className="auth-container">

          {/* LEFT SIDE */}
          <div className="auth-info">
            <div className="auth-logo-icon">
              <FaTint />
            </div>

            <span className="section-tag">
              WELCOME BACK
            </span>

            <h1>
              Welcome Back to
              <span> BDBloodHub</span>
            </h1>

            <p>
              Sign in to your account to find blood donors,
              manage your donor information and stay connected
              with the community.
            </p>
          </div>

          {/* LOGIN CARD */}
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>Login</h2>

              <p>
                Enter your details to continue.
              </p>
            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >

              {/* EMAIL */}
              <div className="auth-form-group">
                <label htmlFor="login-email">
                  Email Address
                </label>

                <div className="auth-input-wrapper">
                  <FaEnvelope />

                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="auth-form-group">
                <label htmlFor="login-password">
                  Password
                </label>

                <div className="auth-input-wrapper">
                  <FaLock />

                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
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

              {/* FORGOT PASSWORD */}
              <div className="auth-extra-row">
                <label className="remember-option">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <a
                  href="/forgot-password"
                  className="forgot-link"
                >
                  Forgot Password?
                </a>
              </div>

              {/* ERROR */}
              {error && (
                <div className="auth-error-message">
                  {error}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* SUCCESS */}
              {submitted && (
                <div className="auth-success-message">
                  Login successful!
                </div>
              )}
            </form>

            {/* REGISTER LINK */}
            <div className="auth-bottom-text">
              <span>
                Don't have an account?
              </span>

              <a href="/register">
                Register
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

export default Login;