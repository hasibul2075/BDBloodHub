import { useState } from "react";

import {
  FaEnvelope,
  FaTint,
  FaArrowLeft,
} from "react-icons/fa";

import { supabase } from "../supabase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(false);
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const redirectTo =
        `${window.location.origin}/reset-password`;

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo,
          }
        );

      if (resetError) {
        throw resetError;
      }

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      setError(
        error.message ||
          "Unable to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-section">
        <div className="auth-container">

          {/* LEFT SIDE */}
          <div className="auth-info forgot-auth-info">
            <div className="auth-logo-icon">
              <FaTint />
            </div>

            <span className="section-tag">
              PASSWORD RECOVERY
            </span>

            <h1>
              Reset Your
              <span> Password</span>
            </h1>

            <p>
              Enter the email address associated with
              your account and we'll help you get back
              into your BDBloodHub account.
            </p>
          </div>

          {/* FORGOT PASSWORD CARD */}
          <div className="auth-card">

            <div className="auth-card-header">
              <h2>Forgot Password?</h2>

              <p>
                Enter your email to reset your password.
              </p>
            </div>

            {!submitted ? (
              <form
                className="auth-form"
                onSubmit={handleSubmit}
              >

                <div className="auth-form-group">
                  <label htmlFor="forgot-email">
                    Email Address
                  </label>

                  <div className="auth-input-wrapper">
                    <FaEnvelope />

                    <input
                      id="forgot-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      required
                    />
                  </div>
                </div>

                {/* ERROR */}
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
                    ? "Sending..."
                    : "Send Reset Link"}
                </button>
              </form>
            ) : (
              <div className="forgot-success">
                <div className="forgot-success-icon">
                  ✓
                </div>

                <h3>
                  Check Your Email
                </h3>

                <p>
                  If an account exists with{" "}
                  <strong>{email}</strong>, you will
                  receive instructions to reset your
                  password.
                </p>
              </div>
            )}

            <div className="auth-bottom-text">
              <FaArrowLeft className="back-arrow" />

              <a href="/login">
                Back to Login
              </a>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;