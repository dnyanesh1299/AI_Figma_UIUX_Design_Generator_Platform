import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale-in">
        {/* Back to login */}
        <Link
          to="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "var(--text-muted)",
            marginBottom: "24px",
            transition: "color 0.2s"
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <i className="fa-solid fa-arrow-left" style={{ fontSize: "11px" }} />
          Back to sign in
        </Link>

        {/* Icon */}
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: "var(--primary-muted)",
            border: "1px solid var(--border-glow)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            color: "var(--secondary)",
            marginBottom: "20px"
          }}
        >
          <i className="fa-regular fa-envelope" />
        </div>

        {!sent ? (
          <>
            <div className="auth-header">
              <h2>Forgot your password?</h2>
              <p>No worries! Enter your email and we'll send you a reset link.</p>
            </div>

            <form className="auth-form" onSubmit={onSubmit}>
              <label>
                Email address
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="designer@company.com"
                  autoComplete="email"
                  required
                />
              </label>

              {error && <p className="auth-error">{error}</p>}

              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {submitting ? (
                  <><i className="fa-solid fa-spinner fa-spin" /> Sending...</>
                ) : (
                  <><i className="fa-regular fa-paper-plane" /> Send Reset Link</>
                )}
              </button>
            </form>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="animate-scale-in">
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "var(--success-muted)",
                border: "1px solid rgba(34,197,94,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                color: "var(--success)"
              }}
            >
              <i className="fa-solid fa-check" />
            </div>

            <div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Check your email</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                We've sent a password reset link to{" "}
                <strong style={{ color: "var(--text-primary)" }}>{email}</strong>.
                Check your inbox and click the link to reset your password.
              </p>
            </div>

            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Didn't receive the email?{" "}
              <button
                type="button"
                onClick={() => setSent(false)}
                style={{ background: "none", border: "none", color: "var(--secondary)", cursor: "pointer", fontSize: "13px", fontWeight: "600", padding: 0 }}
              >
                Try again
              </button>
            </p>
          </div>
        )}

        <p className="auth-footer" style={{ marginTop: "24px" }}>
          <Link to="/login">← Return to sign in</Link>
        </p>
      </div>
    </div>
  );
}
