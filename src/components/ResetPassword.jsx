import { useEffect, useState } from "react";

import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTint,
} from "react-icons/fa";

import { supabase } from "../supabase";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] =
    useState(true);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "This password reset link is invalid or has expired."
        );
      }

      setCheckingSession(false);
    };

    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!password || !confirmPassword) {
      setError("Please enter your new password.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(
        "Password update error:",
        error
      );

      setError(
        error.message ||
          "Failed to update password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <main className="auth-page">
        <section className="auth-section">
          <div className="auth-container">
            <div className="auth-card">
              <div className="auth-card-header">
                <h2>Checking Reset Link...</h2>
                <p>
                  Please wait a moment.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-section">
        <div className="auth-container">

          {/* LEFT SIDE */}
          <div className="auth-info">
            <div className="auth-logo-icon">
              <FaTint />
            </div>

            <span className="section-tag">
              PASSWORD RECOVERY
            </span>

            <h1>
              Create New
              <span> Password</span>
            </h1>

            <p>
              Choose a new secure password for your
              BDBloodHub account.
            </p>
          </div>

          {/* RESET PASSWORD CARD */}
          <div className="auth-card">

            <div className="auth-card-header">
              <h2>Reset Password</h2>

              <p>
                Enter your new password below.
              </p>
            </div>

            {!success ? (
              <form
                className="auth-form"
                onSubmit={handleSubmit}
              >

                {/* NEW PASSWORD */}
                <div className="auth-form-group">
                  <label htmlFor="new-password">
                    New Password
                  </label>

                  <div className="auth-input-wrapper">
                    <FaLock />

                    <input
                      id="new-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => {
                        setPassword(
                          e.target.value
                        );
                        setError("");
                      }}
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

                {/* CONFIRM PASSWORD */}
                <div className="auth-form-group">
                  <label htmlFor="confirm-password">
                    Confirm New Password
                  </label>

                  <div className="auth-input-wrapper">
                    <FaLock />

                    <input
                      id="confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(
                          e.target.value
                        );
                        setError("");
                      }}
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
                    ? "Updating..."
                    : "Update Password"}
                </button>

              </form>
            ) : (
              <div className="forgot-success">
                <div className="forgot-success-icon">
                  ✓
                </div>

                <h3>
                  Password Updated!
                </h3>

                <p>
                  Your password has been changed
                  successfully.
                </p>

                <a
                  href="/login"
                  className="auth-submit-btn"
                >
                  Go to Login
                </a>
              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}

export default ResetPassword;