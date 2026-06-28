import { useState } from "react";

const ALL_NOTIFICATIONS = [
  { id: 1, type: "success", icon: "fa-check-circle", iconBg: "var(--success-muted)", iconColor: "var(--success)", title: "Design generated successfully", desc: "Your 'Fintech Pro Dashboard' schema was generated with 3 pages and 18 components.", time: "2 min ago", read: false, category: "Design Updates" },
  { id: 2, type: "info", icon: "fa-wand-magic-sparkles", iconBg: "var(--primary-muted)", iconColor: "var(--secondary)", title: "New component types available", desc: "Product Card, Testimonial, and Pricing Table components added to the generation engine.", time: "1 hour ago", read: false, category: "System" },
  { id: 3, type: "warning", icon: "fa-triangle-exclamation", iconBg: "var(--warning-muted)", iconColor: "var(--warning)", title: "Partial generation: fallback used", desc: "The JSON parser encountered an issue. An optimized fallback layout was loaded automatically.", time: "3 hours ago", read: false, category: "Design Updates" },
  { id: 4, type: "info", icon: "fa-figma", iconBg: "rgba(26,117,255,0.12)", iconColor: "#1A75FF", title: "Figma export completed", desc: "Your 'SaaS Glassmorphism Landing' design was exported to Figma successfully.", time: "Yesterday", read: true, category: "Design Updates" },
  { id: 5, type: "success", icon: "fa-user-plus", iconBg: "var(--success-muted)", iconColor: "var(--success)", title: "Account created successfully", desc: "Welcome to AI Figma UI/UX Generator! You have 200 free design generations this month.", time: "2 days ago", read: true, category: "System" },
  { id: 6, type: "info", icon: "fa-bolt", iconBg: "var(--accent-muted)", iconColor: "var(--info)", title: "API response time improved", desc: "Generation speed has been optimized. Average design generation is now 3.2 seconds.", time: "3 days ago", read: true, category: "System" },
  { id: 7, type: "success", icon: "fa-download", iconBg: "var(--success-muted)", iconColor: "var(--success)", title: "Project exported", desc: "Your 'E-Commerce Mobile UI' JSON schema was downloaded successfully.", time: "5 days ago", read: true, category: "Design Updates" }
];

const FILTER_TABS = ["All", "Unread", "Design Updates", "System"];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS);

  const filtered = notifications.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    return n.category === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function deleteNotification(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div style={{ padding: "32px", maxWidth: "760px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "800", letterSpacing: "-0.02em", margin: 0 }}>Notifications</h1>
            {unreadCount > 0 && (
              <span style={{ background: "var(--primary)", color: "white", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "999px", minWidth: "20px", textAlign: "center" }}>
                {unreadCount}
              </span>
            )}
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
            Stay updated on your design activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <button className="btn-ghost" onClick={markAllRead} style={{ fontSize: "13px" }}>
            <i className="fa-solid fa-check-double" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "16px", background: "rgba(30,41,59,0.6)", padding: "4px", borderRadius: "12px", border: "1px solid var(--border)", width: "fit-content" }}>
        {FILTER_TABS.map((tab) => {
          const count = tab === "Unread" ? unreadCount :
                       tab === "All" ? notifications.length :
                       notifications.filter((n) => n.category === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              style={{
                padding: "6px 14px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "12px",
                fontWeight: "600", fontFamily: "inherit", transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: "5px",
                background: activeFilter === tab ? "var(--primary)" : "transparent",
                color: activeFilter === tab ? "white" : "var(--text-muted)"
              }}
            >
              {tab}
              {count > 0 && (
                <span style={{
                  background: activeFilter === tab ? "rgba(255,255,255,0.25)" : "var(--primary-muted)",
                  color: activeFilter === tab ? "white" : "var(--secondary)",
                  fontSize: "10px", fontWeight: "700", padding: "1px 5px", borderRadius: "999px"
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><i className="fa-regular fa-bell-slash" /></div>
          <h4>All caught up!</h4>
          <p>No notifications here. You'll see design updates, system alerts, and more in this inbox.</p>
        </div>
      ) : (
        <div style={{ background: "rgba(30,41,59,0.5)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
          {filtered.map((n, i) => (
            <div
              key={n.id}
              className={`notification-item ${!n.read ? "unread" : ""}`}
              onClick={() => markRead(n.id)}
              style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border-light)" : "none" }}
            >
              <div className="notification-icon" style={{ background: n.iconBg }}>
                <i className={`fa-solid ${n.icon}`} style={{ color: n.iconColor, fontSize: "15px" }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "3px" }}>
                  <p style={{ fontSize: "13px", fontWeight: !n.read ? "700" : "600", margin: 0, color: "var(--text-primary)" }}>
                    {n.title}
                    {!n.read && (
                      <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--primary)", marginLeft: "6px", verticalAlign: "middle" }} />
                    )}
                  </p>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0 }}>{n.time}</span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>{n.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                  <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "999px", background: "var(--primary-muted)", border: "1px solid var(--border-glow)", color: "var(--secondary)" }}>
                    {n.category}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                style={{
                  background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer",
                  fontSize: "13px", padding: "4px", borderRadius: "6px", flexShrink: 0, transition: "color 0.15s"
                }}
                title="Dismiss"
                onMouseOver={(e) => { e.currentTarget.style.color = "var(--danger)"; }}
                onMouseOut={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
