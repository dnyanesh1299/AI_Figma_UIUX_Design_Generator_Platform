import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: "fa-wand-magic-sparkles", text: "Generate complete multi-page UI flows in seconds" },
  { icon: "fa-layer-group", text: "Desktop, tablet & mobile responsive layouts" },
  { icon: "fa-figma", text: "Export directly to Figma with one click" },
  { icon: "fa-shield-halved", text: "Secure — your designs stay private" }
];

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from ?? "/";

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
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
            <i className="fa-solid fa-wand-magic-sparkles" />
            AI-Powered Design Platform
          </div>

          <h2 style={{ marginBottom: "14px", lineHeight: "1.1" }}>
            Create stunning UIs<br />
            <span className="gradient-text">in seconds with AI</span>
          </h2>

          <p>
            Sign in to access your AI design studio. Generate, preview, and export
            professional UI layouts from simple text prompts.
          </p>

          <ul className="auth-feature-list">
            {features.map((f, i) => (
              <li key={i} className="auth-feature-item">
                <span className="auth-feature-icon">
                  <i className={`fa-solid ${f.icon}`} />
                </span>
                {f.text}
              </li>
            ))}
          </ul>

          {/* Floating mini design mockup */}
          <div
            style={{
              marginTop: "36px",
              background: "rgba(15,23,42,0.6)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: "16px",
              padding: "16px",
              backdropFilter: "blur(10px)"
            }}
          >
            <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
              {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
                <span key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ width: "80px", background: "rgba(71,85,105,0.2)", borderRadius: "8px", padding: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ height: "8px", background: i === 0 ? "var(--primary)" : "rgba(71,85,105,0.3)", borderRadius: "3px", opacity: i === 0 ? 0.8 : 1 }} />
                ))}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ height: "30px", background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))", borderRadius: "6px" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ height: "20px", background: "rgba(124,58,237,0.1)", borderRadius: "4px", border: "1px solid rgba(124,58,237,0.15)" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-split-form">
        <div className="auth-split-form-inner">
          {/* Logo */}
          <Link to="/landing" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px", textDecoration: "none" }}>
            <span className="brand-badge">AI</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "700", fontSize: "16px", color: "var(--text-primary)" }}>
              Figma UI/UX Generator
            </span>
          </Link>

          <div className="auth-header">
            <h2>Welcome back</h2>
            <p>Log in to your account to continue.</p>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            <label>
              Email address
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="designer@company.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <div style={{ position: "relative" }}>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
            </label>

            <div className="auth-meta">
              <label className="checkbox-row" style={{ display: "flex" }}>
                <input type="checkbox" id="remember-me" />
                Keep me signed in
              </label>
              <Link to="/forgot-password" style={{ fontSize: "13px" }}>
                Forgot password?
              </Link>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn-primary" disabled={submitting} style={{ width: "100%", justifyContent: "center" }}>
              {submitting ? (
                <><i className="fa-solid fa-spinner fa-spin" /> Signing in...</>
              ) : (
                <><i className="fa-solid fa-arrow-right-to-bracket" /> Sign In</>
              )}
            </button>

            <div className="auth-divider">or continue with</div>

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
            New to the platform?{" "}
            <Link to="/signup" style={{ color: "var(--secondary)", fontWeight: "600" }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
