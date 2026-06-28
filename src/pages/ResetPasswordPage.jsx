import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";

function getStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthColors = ["", "weak", "medium", "medium", "strong"];
const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const strength = getStrength(password);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (strength < 2) {
      setError("Please choose a stronger password.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, { token, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. The link may have expired.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale-in">
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
          <i className="fa-solid fa-lock-open" />
        </div>

        {!success ? (
          <>
            <div className="auth-header">
              <h2>Set new password</h2>
              <p>Create a new strong password for your account.</p>
            </div>

            <form className="auth-form" onSubmit={onSubmit}>
              <label>
                New password
                <div style={{ position: "relative" }}>
                  <input
                    id="reset-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    required
                    style={{ paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    style={{
                      position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "14px"
                    }}
                  >
                    <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                  </button>
                </div>

                {password && (
                  <div>
                    <div className="password-strength">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className={`strength-bar ${n <= strength ? strengthColors[strength] : ""}`}
                        />
                      ))}
                    </div>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                      {strengthLabels[strength]} password
                    </p>
                  </div>
                )}
              </label>

              <label>
                Confirm new password
                <input
                  id="reset-confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
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
                  <><i className="fa-solid fa-spinner fa-spin" /> Resetting...</>
                ) : (
                  <><i className="fa-solid fa-shield-check" /> Reset Password</>
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
              <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Password updated!</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Your password has been changed successfully.
                You'll be redirected to sign in automatically.
              </p>
            </div>
            <Link to="/login">
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                <i className="fa-solid fa-arrow-right-to-bracket" /> Go to Sign In
              </button>
            </Link>
          </div>
        )}

        <p className="auth-footer" style={{ marginTop: "24px" }}>
          <Link to="/login">← Return to sign in</Link>
        </p>
      </div>
    </div>
  );
}
