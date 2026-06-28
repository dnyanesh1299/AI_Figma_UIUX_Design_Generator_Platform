import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const TABS = ["Profile", "Security", "API Keys", "Preferences"];

const tabIcons = {
  "Profile": "fa-user",
  "Security": "fa-shield-halved",
  "API Keys": "fa-key",
  "Preferences": "fa-sliders"
};

const SESSIONS = [
  { device: "Chrome on MacOS", location: "Mumbai, India", time: "Now", current: true },
  { device: "Firefox on Windows", location: "Pune, India", time: "2 hours ago", current: false },
  { device: "Safari on iPhone", location: "Mumbai, India", time: "Yesterday", current: false }
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Profile");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "John Designer",
    email: user?.email || "john@example.com",
    bio: "AI-powered UI/UX designer | Building the future of design automation.",
    website: "https://johndesigner.io"
  });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKey] = useState("sk_test_mock_key_ai_figma_generator_platform_demomode");
  const [preferences, setPreferences] = useState({
    exportFormat: "json",
    defaultDevice: "desktop",
    notifyEmail: true,
    notifyDesignUpdates: true,
    animatePreview: true
  });
  const [saved, setSaved] = useState(false);

  const initials = profileForm.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleCopyApiKey() {
    navigator.clipboard.writeText(apiKey);
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">{initials}</div>
          <button style={{
            position: "absolute", bottom: 0, right: 0, width: "26px", height: "26px",
            borderRadius: "50%", background: "var(--primary)", border: "2px solid var(--bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "white", fontSize: "11px"
          }}>
            <i className="fa-solid fa-camera" />
          </button>
        </div>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "4px" }}>{profileForm.name}</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "8px" }}>{profileForm.email}</p>
          <span className="pill" style={{ fontSize: "11px", padding: "3px 10px" }}>
            <i className="fa-solid fa-star" style={{ marginRight: "4px", fontSize: "10px" }} />
            Pro Plan
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`profile-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            <i className={`fa-solid ${tabIcons[tab]}`} style={{ marginRight: "6px", fontSize: "12px" }} />
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Profile" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "560px" }} className="animate-fade-in">
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "18px" }}>Personal Information</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
                Display Name
                <input value={profileForm.name} onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))} style={{ margin: 0 }} />
              </label>
              <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
                Email Address
                <input type="email" value={profileForm.email} onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))} style={{ margin: 0 }} />
              </label>
              <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
                Bio
                <textarea value={profileForm.bio} onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ margin: 0, minHeight: "80px" }} />
              </label>
              <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
                Website
                <input value={profileForm.website} onChange={(e) => setProfileForm(p => ({ ...p, website: e.target.value }))} style={{ margin: 0 }} />
              </label>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button className="btn-primary" onClick={handleSave}>
                {saved ? <><i className="fa-solid fa-check" /> Saved!</> : <><i className="fa-solid fa-floppy-disk" /> Save Changes</>}
              </button>
              <button className="btn-secondary" onClick={() => setProfileForm({ name: user?.name || "", email: user?.email || "", bio: "", website: "" })}>
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Security" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "560px" }} className="animate-fade-in">
          {/* Change password */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>Change Password</h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "18px" }}>Update your password regularly to keep your account secure.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[{ label: "Current Password", key: "current" }, { label: "New Password", key: "newPass" }, { label: "Confirm New Password", key: "confirm" }].map(({ label, key }) => (
                <label key={key} style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {label}
                  <input type="password" value={passwords[key]} onChange={(e) => setPasswords(p => ({ ...p, [key]: e.target.value }))} style={{ margin: 0 }} />
                </label>
              ))}
            </div>
            <button className="btn-primary" style={{ marginTop: "18px" }}>
              <i className="fa-solid fa-lock" /> Update Password
            </button>
          </div>

          {/* 2FA */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>Two-Factor Authentication</h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Add an extra layer of security to your account.</p>
              </div>
              <button
                onClick={() => setTwoFAEnabled(p => !p)}
                style={{
                  width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                  background: twoFAEnabled ? "var(--primary)" : "var(--surface-3)", position: "relative", transition: "background 0.25s", flexShrink: 0
                }}
              >
                <span style={{
                  position: "absolute", top: "2px", left: twoFAEnabled ? "22px" : "2px",
                  width: "20px", height: "20px", borderRadius: "50%", background: "white", transition: "left 0.25s"
                }} />
              </button>
            </div>
          </div>

          {/* Active sessions */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "16px" }}>Active Sessions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {SESSIONS.map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: s.current ? "var(--primary-muted)" : "rgba(30,41,59,0.4)", border: `1px solid ${s.current ? "var(--border-glow)" : "var(--border-light)"}`, borderRadius: "10px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <i className="fa-solid fa-desktop" style={{ color: "var(--text-muted)", fontSize: "14px" }} />
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: "600", margin: 0 }}>{s.device}</p>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{s.location} · {s.time}</p>
                    </div>
                  </div>
                  {s.current
                    ? <span className="pill success" style={{ fontSize: "11px", padding: "2px 8px" }}>Current</span>
                    : <button className="btn-danger" style={{ fontSize: "12px", padding: "5px 10px" }}>Revoke</button>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "API Keys" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "560px" }} className="animate-fade-in">
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>Your API Key</h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "18px" }}>
              Use this key to access the AI Design Generator API programmatically. Never share it publicly.
            </p>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ flex: 1, background: "rgba(8,13,24,0.8)", border: "1px solid var(--border)", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {apiKeyVisible ? apiKey : "•".repeat(36)}
              </div>
              <button className="btn-secondary" style={{ padding: "10px 12px", flexShrink: 0 }} onClick={() => setApiKeyVisible(p => !p)}>
                <i className={`fa-regular ${apiKeyVisible ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
              <button className="btn-secondary" style={{ padding: "10px 12px", flexShrink: 0 }} onClick={handleCopyApiKey}>
                <i className="fa-solid fa-copy" />
              </button>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-danger" style={{ fontSize: "13px" }}>
                <i className="fa-solid fa-arrows-rotate" /> Regenerate Key
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>Usage This Month</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { label: "API Calls", value: "284 / 1000", pct: 28 },
                { label: "Designs Generated", value: "47 / 200", pct: 23 },
                { label: "Export Operations", value: "12 / 100", pct: 12 },
                { label: "Token Usage", value: "82K / 500K", pct: 16 }
              ].map((m) => (
                <div key={m.label} style={{ background: "rgba(15,23,42,0.6)", borderRadius: "10px", padding: "12px", border: "1px solid var(--border-light)" }}>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>{m.label}</p>
                  <p style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>{m.value}</p>
                  <div style={{ height: "4px", background: "var(--surface-3)", borderRadius: "2px" }}>
                    <div style={{ height: "100%", width: `${m.pct}%`, background: "var(--gradient-btn)", borderRadius: "2px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Preferences" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "560px" }} className="animate-fade-in">
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "18px" }}>Generation Preferences</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
                Default Export Format
                <select value={preferences.exportFormat} onChange={(e) => setPreferences(p => ({ ...p, exportFormat: e.target.value }))} style={{ margin: 0 }}>
                  <option value="json">JSON Schema</option>
                  <option value="figma">Figma API</option>
                  <option value="png">PNG Snapshot</option>
                </select>
              </label>
              <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
                Default Preview Device
                <select value={preferences.defaultDevice} onChange={(e) => setPreferences(p => ({ ...p, defaultDevice: e.target.value }))} style={{ margin: 0 }}>
                  <option value="desktop">Desktop</option>
                  <option value="tablet">Tablet</option>
                  <option value="mobile">Mobile</option>
                </select>
              </label>
            </div>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "18px" }}>Notifications</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { key: "notifyEmail", label: "Email notifications", desc: "Receive updates and reports via email" },
                { key: "notifyDesignUpdates", label: "Design system updates", desc: "Get notified when new components are added" },
                { key: "animatePreview", label: "Animate live preview", desc: "Show hover and transition animations in canvas" }
              ].map(({ key, label, desc }) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "500", marginBottom: "2px" }}>{label}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>{desc}</p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, [key]: !p[key] }))}
                    style={{
                      width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer", flexShrink: 0,
                      background: preferences[key] ? "var(--primary)" : "var(--surface-3)", position: "relative", transition: "background 0.25s"
                    }}
                  >
                    <span style={{
                      position: "absolute", top: "2px", left: preferences[key] ? "22px" : "2px",
                      width: "20px", height: "20px", borderRadius: "50%", background: "white", transition: "left 0.25s"
                    }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={handleSave} style={{ alignSelf: "flex-start" }}>
            {saved ? <><i className="fa-solid fa-check" /> Preferences Saved!</> : <><i className="fa-solid fa-floppy-disk" /> Save Preferences</>}
          </button>
        </div>
      )}
    </div>
  );
}
