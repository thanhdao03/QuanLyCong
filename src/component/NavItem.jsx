export function NavItem({ icon: Icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "100%",
        padding: "10px 14px",
        borderRadius: "6px",
        border: "none",
        background: active ? "#1C2B3A" : "transparent",
        color: active ? "#FAFAF8" : "#1C1C1A",
        fontSize: "13.5px",
        fontWeight: active ? 600 : 500,
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s ease, color 0.15s ease",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Icon size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge ? (
        <span
          style={{
            background: "#B8923E",
            color: "#FAFAF8",
            fontSize: "11px",
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: "10px",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}
