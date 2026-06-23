export function PageHeader({ title, subtitle, action }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "22px",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#1C1C1A",
            margin: 0,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: "13px", color: "#8A8780", margin: "4px 0 0" }}>
          {subtitle}
        </p>
      </div>
      {action}
    </div>
  );
}
