import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { path: "/", label: "Studio", icon: "fa-wand-magic-sparkles", end: true },
  { path: "/projects", label: "Projects", icon: "fa-folder-open" },
  { path: "/export", label: "Export", icon: "fa-arrow-up-from-bracket" },
  { path: "/analytics", label: "Analytics", icon: "fa-chart-line" },
  { path: "/explore", label: "Explore", icon: "fa-compass" },
  { path: "/preview", label: "Preview", icon: "fa-laptop-code" },
];

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <>
      <header className="navbar">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <span className="brand-badge">AI</span>
          <span className="navbar-title">Figma UI/UX Generator</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="navbar-links" style={{ display: "flex" }}>
          {/* Show main nav only when authenticated */}
          {isAuthenticated && navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <i className={`fa-solid ${item.icon}`} style={{ fontSize: "12px" }} />
              {item.label}
            </NavLink>
          ))}

          {/* Public nav items */}
          {!isAuthenticated && (
            <NavLink
              to="/landing"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Product
            </NavLink>
          )}
        </nav>

        {/* Right section */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          {isAuthenticated ? (
            <>
              {/* Help */}
              <Link to="/help" title="Help & Docs">
                <button className="nav-icon-btn">
                  <i className="fa-regular fa-circle-question" />
                </button>
              </Link>

              {/* Notifications */}
              <Link to="/notifications" title="Notifications">
                <button className="nav-icon-btn">
                  <i className="fa-regular fa-bell" />
                  <span className="nav-badge" />
                </button>
              </Link>

              {/* Avatar dropdown */}
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button
                  className="nav-avatar"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  title="Account"
                >
                  {initials}
                </button>

                {dropdownOpen && (
                  <div className="nav-dropdown">
                    <div style={{ padding: "10px 12px 8px" }}>
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>
                        {user?.name || "User"}
                      </p>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {user?.email || ""}
                      </p>
                    </div>
                    <div className="nav-dropdown-divider" />
                    <Link
                      to="/profile"
                      className="nav-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fa-regular fa-user" style={{ width: "16px" }} />
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="nav-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fa-solid fa-gear" style={{ width: "16px" }} />
                      App Settings
                    </Link>
                    <Link
                      to="/projects"
                      className="nav-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fa-regular fa-folder" style={{ width: "16px" }} />
                      My Projects
                    </Link>
                    <Link
                      to="/notifications"
                      className="nav-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fa-regular fa-bell" style={{ width: "16px" }} />
                      Notifications
                    </Link>
                    <div className="nav-dropdown-divider" />
                    <button
                      className="nav-dropdown-item danger"
                      onClick={() => { setDropdownOpen(false); logout(); }}
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket" style={{ width: "16px" }} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Login
              </NavLink>
              <NavLink to="/signup" className="nav-link nav-link-cta">
                Get Started
              </NavLink>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            className="nav-icon-btn"
            style={{ display: "none" }}
            onClick={() => setMobileMenuOpen((p) => !p)}
            id="mobile-menu-toggle"
          >
            <i className={mobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"} />
          </button>
        </div>
      </header>

      {/* Mobile slide-out drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "68px",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(8,13,24,0.95)",
            backdropFilter: "blur(20px)",
            zIndex: 90,
            padding: "24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            animation: "slideInLeft 0.25s ease"
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          {isAuthenticated && navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              style={{ fontSize: "16px", padding: "12px 16px" }}
            >
              <i className={`fa-solid ${item.icon}`} />
              {item.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <>
              <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }} />
              <Link to="/profile" className="nav-link" style={{ fontSize: "16px", padding: "12px 16px" }}>
                <i className="fa-regular fa-user" /> Profile
              </Link>
              <Link to="/settings" className="nav-link" style={{ fontSize: "16px", padding: "12px 16px" }}>
                <i className="fa-solid fa-gear" /> Settings
              </Link>
              <Link to="/help" className="nav-link" style={{ fontSize: "16px", padding: "12px 16px" }}>
                <i className="fa-regular fa-circle-question" /> Help
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .navbar-links { display: none !important; }
          #mobile-menu-toggle { display: flex !important; }
          .navbar-title { display: none; }
        }
      `}</style>
    </>
  );
}

export default Navbar;
