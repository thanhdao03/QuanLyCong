import { AlertTriangle, Check, X } from "lucide-react";

export function Toast({ message, type, onClose }) {
  const color = type === "error" ? "#C4622D" : "#2F6E4F";
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#1C1C1A",
        color: "#FAFAF8",
        padding: "12px 16px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "13px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        borderLeft: `3px solid ${color}`,
        zIndex: 1000,
        maxWidth: "360px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {type === "error" ? (
        <AlertTriangle size={16} color={color} />
      ) : (
        <Check size={16} color={color} />
      )}
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#8A8780",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
