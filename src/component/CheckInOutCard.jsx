import { LogIn, LogOut } from "lucide-react";
import { formatDate, todayISO } from "../common/FunctionCommon";

export function CheckInOutCard({ employee, timelogs, onCheckIn, onCheckOut }) {
  const today = todayISO();
  const todayLog = timelogs.find(
    (t) => t.employeeId === employee.id && t.date === today,
  );
  const hasCheckedIn = !!todayLog?.checkIn;
  const hasCheckedOut = !!todayLog?.checkOut;

  return (
    <div
      style={{
        background: "#1C2B3A",
        borderRadius: "6px",
        padding: "22px 24px",
        color: "#FAFAF8",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "11.5px",
            color: "#A8B4C2",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            marginBottom: "6px",
          }}
        >
          Chấm công hôm nay — {formatDate(today)}
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "baseline" }}>
          <div>
            <span style={{ fontSize: "11px", color: "#A8B4C2" }}>Vào: </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              {todayLog?.checkIn || "—"}
            </span>
          </div>
          <div>
            <span style={{ fontSize: "11px", color: "#A8B4C2" }}>Ra: </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              {todayLog?.checkOut || "—"}
            </span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={onCheckIn}
          disabled={hasCheckedIn}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "10px 16px",
            borderRadius: "4px",
            border: "1px solid #3D5269",
            background: hasCheckedIn ? "#2A3A4C" : "#2F6E4F",
            color: hasCheckedIn ? "#7D8A99" : "#FAFAF8",
            fontSize: "13px",
            fontWeight: 600,
            cursor: hasCheckedIn ? "not-allowed" : "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <LogIn size={15} /> Chấm vào
        </button>
        <button
          onClick={onCheckOut}
          disabled={!hasCheckedIn || hasCheckedOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "10px 16px",
            borderRadius: "4px",
            border: "1px solid #3D5269",
            background: !hasCheckedIn || hasCheckedOut ? "#2A3A4C" : "#8B5FBF",
            color: !hasCheckedIn || hasCheckedOut ? "#7D8A99" : "#FAFAF8",
            fontSize: "13px",
            fontWeight: 600,
            cursor: !hasCheckedIn || hasCheckedOut ? "not-allowed" : "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <LogOut size={15} /> Chấm ra
        </button>
      </div>
    </div>
  );
}
