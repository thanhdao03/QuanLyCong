import { LEAVE_STATUS_STYLES } from "../App";

export function StatusBadge({ status }) {
  const s = LEAVE_STATUS_STYLES[status];
  return (
    <span
      style={{
        fontSize: "11.5px",
        fontWeight: 600,
        color: s.text,
        background: s.bg,
        padding: "3px 10px",
        borderRadius: "10px",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}
