import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function getStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["", "weak", "medium", "medium", "strong"];

const benefits = [
  { icon: "fa-bolt", text: "Generate unlimited UI designs instantly" },
  { icon: "fa-palette", text: "Auto design tokens for any industry" },
  { icon: "fa-clock", text: "10× faster than manual wireframing" },
  { icon: "fa-users", text: "Join 10,000+ designers and founders" }
];

function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = getStrength(form.password);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function onSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please accept the Terms of Service to continue.");
      return;
    }
    if (strength < 2) {
      setError("Please choose a stronger password.");
      return;
    }

    setSubmitting(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-split">
      {/* Left visual panel */}
      <div className="auth-split-visual">
        <div className="auth-split-visual-content">
          <div className="auth-header-badge" style={{ marginBottom: "20px" }}>
            <i className="fa-solid fa-sparkles" />
            Free to Get Started
          </div>

          <h2 style={{ marginBottom: "14px", lineHeight: "1.1" }}>
            Design with AI —<br />
            <span className="gradient-text">No Design Skills Needed</span>
          </h2>

          <p>
            Create your free account and start generating professional-grade UI layouts
            from simple text prompts in under 30 seconds.
          </p>

          <ul className="auth-feature-list" style={{ marginBottom: "32px" }}>
            {benefits.map((b, i) => (
              <li key={i} className="auth-feature-item">
                <span className="auth-feature-icon">
                  <i className={`fa-solid ${b.icon}`} />
                </span>
                {b.text}
              </li>
            ))}
          </ul>

          {/* Sample prompt UI */}
          <div
            style={{
              background: "rgba(15,23,42,0.6)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: "14px",
              padding: "16px",
              backdropFilter: "blur(10px)"
            }}
          >
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "600" }}>
              Example Prompt
            </p>
            <div style={{ background: "rgba(30,41,59,0.6)", borderRadius: "10px", padding: "12px", fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5", border: "1px solid rgba(71,85,105,0.3)" }}>
              "Create a dark mode SaaS dashboard with glassmorphism cards, revenue metrics, user growth chart, and an activity feed sidebar"
              <span style={{ display: "inline-block", width: "2px", height: "14px", background: "var(--secondary)", marginLeft: "2px", animation: "blink 1s step-end infinite", verticalAlign: "middle" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-split-form">
        <div className="auth-split-form-inner">
          <Link to="/landing" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px", textDecoration: "none" }}>
            <span className="brand-badge">AI</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "16px", color: "var(--text-primary)" }}>
              Figma UI/UX Generator
            </span>
          </Link>

          <div className="auth-header">
            <h2>Create your account</h2>
            <p>Start generating stunning UI designs for free.</p>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            <label>
              Full name
              <input
                id="signup-name"
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="John Doe"
                autoComplete="name"
                required
              />
            </label>

            <label>
              Email address
              <input
                id="signup-email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="john@company.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <div style={{ position: "relative" }}>
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
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

              {/* Strength bars */}
              {form.password && (
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
              Confirm password
              <input
                id="signup-confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange("confirm")}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
              />
            </label>

            <label className="checkbox-row" style={{ display: "flex", alignItems: "flex-start" }}>
              <input
                type="checkbox"
                id="signup-agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ marginTop: "2px" }}
              />
              <span>
                I agree to the{" "}
                <a href="#" style={{ color: "var(--secondary)" }}>Terms of Service</a>
                {" "}and{" "}
                <a href="#" style={{ color: "var(--secondary)" }}>Privacy Policy</a>
              </span>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn-primary" disabled={submitting} style={{ width: "100%", justifyContent: "center" }}>
              {submitting ? (
                <><i className="fa-solid fa-spinner fa-spin" /> Creating account...</>
              ) : (
                <><i className="fa-solid fa-user-plus" /> Create Account</>
              )}
            </button>

            <div className="auth-divider">or sign up with</div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a className="btn-oauth" href={`${API_BASE_URL}/auth/google`}>
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                  <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                  <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                  <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                  <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                </svg>
                Continue with Google
              </a>
              <a className="btn-oauth" href={`${API_BASE_URL}/auth/github`}>
                <i className="fa-brands fa-github" style={{ fontSize: "18px" }} />
                Continue with GitHub
              </a>
            </div>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--secondary)", fontWeight: "600" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
