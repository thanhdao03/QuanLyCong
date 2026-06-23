export function StatCard({ label, value, sub, accent }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E3E0D8",
        borderRadius: "4px",
        padding: "18px 20px",
        flex: 1,
        minWidth: "180px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "3px",
          height: "100%",
          background: accent || "#1C2B3A",
        }}
      />
      <div
        style={{
          fontSize: "11.5px",
          color: "#6B6862",
          fontWeight: 600,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "28px",
          fontWeight: 700,
          fontFamily: "'IBM Plex Mono', monospace",
          color: "#1C1C1A",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub ? (
        <div style={{ fontSize: "12px", color: "#8A8780", marginTop: "6px" }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
}
