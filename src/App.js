import { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Check,
  LogIn,
  LogOut,
  UserCircle2,
  ShieldCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { diffDaysInclusive, formatDate, nowHHMM, todayISO, workedHours } from "./common/FunctionCommon";
import { PageHeader } from "./component/PageHeader";
import { StatusBadge } from "./component/StatusBadge";
import { Toast } from "./component/Toast";
import { NavItem } from "./component/NavItem";
import { EmployeeDashboard } from "./component/EmployeeDashboard";

const EMPLOYEES = [
  { id: "NV-001", name: "Nguyễn Minh Anh", role: "employee", department: "Kinh doanh", leaveBalance: 12 },
  { id: "NV-002", name: "Trần Bảo Long", role: "employee", department: "Kỹ thuật", leaveBalance: 7 },
  { id: "NV-003", name: "Phạm Thu Hà", role: "employee", department: "Kế toán", leaveBalance: 3 },
  { id: "NV-004", name: "Lê Quang Huy", role: "manager", department: "Quản lý", leaveBalance: 10 },
];

const CURRENT_USER_ID_DEFAULT = "NV-001";
const MANAGER_ID = "NV-004";

const INITIAL_TIMELOGS = [
  { id: 1, employeeId: "NV-001", date: "2026-06-19", checkIn: "08:32", checkOut: "17:45" },
  { id: 2, employeeId: "NV-001", date: "2026-06-20", checkIn: "08:28", checkOut: "17:50" },
  { id: 3, employeeId: "NV-001", date: "2026-06-22", checkIn: "08:40", checkOut: "18:02" },
  { id: 4, employeeId: "NV-002", date: "2026-06-19", checkIn: "08:55", checkOut: "17:30" },
  { id: 5, employeeId: "NV-002", date: "2026-06-20", checkIn: "09:05", checkOut: "17:40" },
  { id: 6, employeeId: "NV-002", date: "2026-06-22", checkIn: "08:50", checkOut: null },
  { id: 7, employeeId: "NV-003", date: "2026-06-19", checkIn: "08:20", checkOut: "17:15" },
  { id: 8, employeeId: "NV-003", date: "2026-06-20", checkIn: "08:25", checkOut: "17:20" },
];

const INITIAL_LEAVE_REQUESTS = [
  {
    id: 1,
    employeeId: "NV-002",
    fromDate: "2026-06-25",
    toDate: "2026-06-26",
    days: 2,
    reason: "Về quê giải quyết việc gia đình",
    status: "PENDING",
    createdAt: "2026-06-20",
  },
  {
    id: 2,
    employeeId: "NV-003",
    fromDate: "2026-06-15",
    toDate: "2026-06-15",
    days: 1,
    reason: "Khám sức khỏe định kỳ",
    status: "APPROVED",
    createdAt: "2026-06-10",
  },
  {
    id: 3,
    employeeId: "NV-001",
    fromDate: "2026-06-12",
    toDate: "2026-06-13",
    days: 2,
    reason: "Đám cưới người thân",
    status: "REJECTED",
    rejectReason: "Trùng thời điểm cao điểm cuối quý, đã trao đổi đổi sang tuần sau",
    createdAt: "2026-06-08",
  },
];

let nextTimelogId = INITIAL_TIMELOGS.length + 1;
let nextLeaveId = INITIAL_LEAVE_REQUESTS.length + 1;



export const LEAVE_STATUS_STYLES = {
  PENDING: { bg: "#B8923E1A", text: "#8A6D2F", label: "Chờ duyệt" },
  APPROVED: { bg: "#2F6E4F1A", text: "#2F6E4F", label: "Đã duyệt" },
  REJECTED: { bg: "#C4622D1A", text: "#C4622D", label: "Từ chối" },
};

function LeaveRequestPage({ employee, leaveRequests, onSubmit }) {
  const [fromDate, setFromDate] = useState(todayISO());
  const [toDate, setToDate] = useState(todayISO());
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const myRequests = leaveRequests.filter((l) => l.employeeId === employee.id).sort((a, b) => b.id - a.id);
  const days = diffDaysInclusive(fromDate, toDate);

  function handleSubmit(e) {
    e.preventDefault();

    if (new Date(toDate) < new Date(fromDate)) {
      setError("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
      return;
    }
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do xin nghỉ.");
      return;
    }
    if (days > employee.leaveBalance) {
      setError(`Bạn chỉ còn ${employee.leaveBalance} ngày nghỉ phép, không thể xin ${days} ngày.`);
      return;
    }

    setError("");
    onSubmit({ fromDate, toDate, days, reason: reason.trim() });
    setReason("");
  }

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "4px",
    border: "1px solid #E3E0D8",
    fontSize: "13px",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
    background: "#FFFFFF",
  };
  const labelStyle = { fontSize: "12px", fontWeight: 600, color: "#1C1C1A", marginBottom: "6px", display: "block" };

  return (
    <div>
      <PageHeader title="Xin nghỉ phép" subtitle="Gửi đơn xin nghỉ để quản lý duyệt — đơn sẽ ở trạng thái Chờ duyệt cho đến khi được xử lý." />

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "24px" }}>
        <form onSubmit={handleSubmit} style={{ flex: "1 1 380px", background: "#FFFFFF", border: "1px solid #E3E0D8", borderRadius: "4px", padding: "22px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Từ ngày</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Đến ngày</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ background: "#F4F2EC", borderRadius: "4px", padding: "10px 12px", fontSize: "12px", color: "#6B6862", display: "flex", justifyContent: "space-between" }}>
            <span>Số ngày xin nghỉ</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: days > employee.leaveBalance ? "#C4622D" : "#1C1C1A" }}>
              {days} ngày (còn lại {employee.leaveBalance})
            </span>
          </div>

          <div>
            <label style={labelStyle}>Lý do</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="VD: Về quê giải quyết việc gia đình" style={inputStyle} />
          </div>

          {error && (
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", background: "#C4622D14", border: "1px solid #C4622D40", borderRadius: "4px", padding: "10px 12px", fontSize: "12.5px", color: "#A14E22" }}>
              <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            style={{
              padding: "11px 16px",
              borderRadius: "4px",
              border: "none",
              background: "#1C2B3A",
              color: "#FAFAF8",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Gửi đơn xin nghỉ
          </button>
        </form>

        <div style={{ flex: "1 1 280px", background: "#F4F2EC", border: "1px solid #E3E0D8", borderRadius: "4px", padding: "20px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#1C1C1A", marginBottom: "10px" }}>Quy tắc áp dụng</div>
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12.5px", color: "#6B6862", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>Không thể xin nghỉ vượt quá số ngày phép còn lại trong năm.</li>
            <li>Đơn xin nghỉ luôn ở trạng thái "Chờ duyệt" sau khi gửi — bạn không thể tự duyệt đơn của mình.</li>
            <li>Quản lý là người duy nhất có quyền chuyển trạng thái đơn sang Đã duyệt hoặc Từ chối.</li>
          </ul>
        </div>
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #E3E0D8", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #E3E0D8", fontSize: "13px", fontWeight: 600 }}>Đơn xin nghỉ của tôi</div>
        {myRequests.length === 0 ? (
          <div style={{ padding: "24px 20px", color: "#8A8780", fontSize: "13px" }}>Bạn chưa gửi đơn xin nghỉ nào.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {myRequests.map((l, idx) => (
              <div key={l.id} style={{ padding: "14px 20px", borderBottom: idx === myRequests.length - 1 ? "none" : "1px solid #EDEAE2", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#1C1C1A" }}>
                    {formatDate(l.fromDate)} {l.fromDate !== l.toDate ? `→ ${formatDate(l.toDate)}` : ""} <span style={{ color: "#8A8780", fontWeight: 400 }}>({l.days} ngày)</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#8A8780", marginTop: "3px" }}>{l.reason}</div>
                  {l.status === "REJECTED" && l.rejectReason && (
                    <div style={{ fontSize: "11.5px", color: "#C4622D", marginTop: "4px" }}>Lý do từ chối: {l.rejectReason}</div>
                  )}
                </div>
                <StatusBadge status={l.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ManagerTeamPage({ employees, timelogs }) {
  const today = todayISO();
  const teamMembers = employees.filter((e) => e.role === "employee");

  return (
    <div>
      <PageHeader title="Chấm công của nhóm" subtitle="Trạng thái chấm công hôm nay và lịch sử gần đây của từng nhân viên." />

      <div style={{ background: "#FFFFFF", border: "1px solid #E3E0D8", borderRadius: "4px", overflow: "hidden", marginBottom: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#F4F2EC" }}>
              {["Nhân viên", "Phòng ban", "Giờ vào hôm nay", "Giờ ra hôm nay", "Trạng thái"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: "11.5px", fontWeight: 600, color: "#6B6862", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((emp, idx) => {
              const log = timelogs.find((t) => t.employeeId === emp.id && t.date === today);
              let statusLabel = "Chưa chấm công";
              let statusColor = "#8A8780";
              if (log?.checkIn && !log?.checkOut) {
                statusLabel = "Đang làm việc";
                statusColor = "#2F6E4F";
              } else if (log?.checkIn && log?.checkOut) {
                statusLabel = "Đã hoàn thành";
                statusColor = "#8B5FBF";
              }
              return (
                <tr key={emp.id} style={{ borderBottom: idx === teamMembers.length - 1 ? "none" : "1px solid #EDEAE2" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 500, color: "#1C1C1A" }}>{emp.name}</td>
                  <td style={{ padding: "12px 16px", color: "#6B6862" }}>{emp.department}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "'IBM Plex Mono', monospace", color: "#2F6E4F" }}>{log?.checkIn || "—"}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "'IBM Plex Mono', monospace", color: "#8B5FBF" }}>{log?.checkOut || "—"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: 600, color: statusColor, background: `${statusColor}1A`, padding: "3px 9px", borderRadius: "10px" }}>{statusLabel}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #E3E0D8", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #E3E0D8", fontSize: "13px", fontWeight: 600 }}>Lịch sử chấm công toàn nhóm</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#F4F2EC" }}>
              {["Nhân viên", "Ngày", "Giờ vào", "Giờ ra", "Số giờ làm"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "9px 16px", fontSize: "11.5px", fontWeight: 600, color: "#6B6862", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...timelogs]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 10)
              .map((t, idx, arr) => {
                const emp = employees.find((e) => e.id === t.employeeId);
                const hours = workedHours(t.checkIn, t.checkOut);
                return (
                  <tr key={t.id} style={{ borderBottom: idx === arr.length - 1 ? "none" : "1px solid #EDEAE2" }}>
                    <td style={{ padding: "11px 16px", color: "#1C1C1A" }}>{emp?.name}</td>
                    <td style={{ padding: "11px 16px", color: "#6B6862" }}>{formatDate(t.date)}</td>
                    <td style={{ padding: "11px 16px", fontFamily: "'IBM Plex Mono', monospace", color: "#2F6E4F" }}>{t.checkIn || "—"}</td>
                    <td style={{ padding: "11px 16px", fontFamily: "'IBM Plex Mono', monospace", color: t.checkOut ? "#8B5FBF" : "#C4622D" }}>{t.checkOut || "Chưa chấm ra"}</td>
                    <td style={{ padding: "11px 16px", fontFamily: "'IBM Plex Mono', monospace", color: "#1C1C1A" }}>{hours !== null ? `${hours}h` : "—"}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManagerApprovalPage({ employees, leaveRequests, onApprove, onReject }) {
  const [filter, setFilter] = useState("PENDING");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const sorted = [...leaveRequests].sort((a, b) => b.id - a.id);
  const filtered = filter === "ALL" ? sorted : sorted.filter((l) => l.status === filter);

  function handleRejectSubmit(id) {
    if (!rejectReason.trim()) return;
    onReject(id, rejectReason.trim());
    setRejectingId(null);
    setRejectReason("");
  }

  return (
    <div>
      <PageHeader title="Duyệt đơn xin nghỉ" subtitle="Chỉ quản lý mới có quyền chuyển trạng thái đơn — nhân viên không thể tự duyệt." />

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {[
          { key: "PENDING", label: "Chờ duyệt" },
          { key: "APPROVED", label: "Đã duyệt" },
          { key: "REJECTED", label: "Từ chối" },
          { key: "ALL", label: "Tất cả" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "7px 14px",
              borderRadius: "16px",
              border: "1px solid",
              borderColor: filter === f.key ? "#1C2B3A" : "#E3E0D8",
              background: filter === f.key ? "#1C2B3A" : "#FFFFFF",
              color: filter === f.key ? "#FAFAF8" : "#6B6862",
              fontSize: "12.5px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.length === 0 && (
          <div style={{ background: "#FFFFFF", border: "1px solid #E3E0D8", borderRadius: "4px", padding: "28px 20px", textAlign: "center", color: "#8A8780", fontSize: "13px" }}>
            Không có đơn nào ở trạng thái này.
          </div>
        )}
        {filtered.map((l) => {
          const emp = employees.find((e) => e.id === l.employeeId);
          const isRejecting = rejectingId === l.id;
          return (
            <div key={l.id} style={{ background: "#FFFFFF", border: "1px solid #E3E0D8", borderRadius: "4px", padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#1C1C1A" }}>{emp?.name}</div>
                  <div style={{ fontSize: "12px", color: "#8A8780", marginTop: "2px" }}>{emp?.department} · Còn {emp?.leaveBalance} ngày phép</div>
                  <div style={{ fontSize: "13px", color: "#1C1C1A", marginTop: "8px" }}>
                    {formatDate(l.fromDate)} {l.fromDate !== l.toDate ? `→ ${formatDate(l.toDate)}` : ""}{" "}
                    <span style={{ color: "#8A8780" }}>({l.days} ngày)</span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#6B6862", marginTop: "4px" }}>{l.reason}</div>
                  {l.status === "REJECTED" && l.rejectReason && (
                    <div style={{ fontSize: "11.5px", color: "#C4622D", marginTop: "6px" }}>Lý do từ chối: {l.rejectReason}</div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                  <StatusBadge status={l.status} />
                  {l.status === "PENDING" && !isRejecting && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => onApprove(l.id)}
                        style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "4px", border: "none", background: "#2F6E4F", color: "#FAFAF8", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}
                      >
                        <CheckCircle2 size={14} /> Duyệt
                      </button>
                      <button
                        onClick={() => setRejectingId(l.id)}
                        style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "4px", border: "1px solid #C4622D", background: "#FFFFFF", color: "#C4622D", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}
                      >
                        <XCircle size={14} /> Từ chối
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {isRejecting && (
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #EDEAE2", display: "flex", gap: "8px" }}>
                  <input
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    style={{ flex: 1, padding: "8px 12px", borderRadius: "4px", border: "1px solid #E3E0D8", fontSize: "12.5px", outline: "none", fontFamily: "'Inter', sans-serif" }}
                  />
                  <button
                    onClick={() => handleRejectSubmit(l.id)}
                    style={{ padding: "8px 14px", borderRadius: "4px", border: "none", background: "#C4622D", color: "#FAFAF8", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}
                  >
                    Xác nhận
                  </button>
                  <button
                    onClick={() => { setRejectingId(null); setRejectReason(""); }}
                    style={{ padding: "8px 14px", borderRadius: "4px", border: "1px solid #E3E0D8", background: "#FFFFFF", color: "#6B6862", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AttendanceApp() {
  const [currentUserId, setCurrentUserId] = useState(CURRENT_USER_ID_DEFAULT);
  const [employees] = useState(EMPLOYEES);
  const [timelogs, setTimelogs] = useState(INITIAL_TIMELOGS);
  const [leaveRequests, setLeaveRequests] = useState(INITIAL_LEAVE_REQUESTS);
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const currentUser = employees.find((e) => e.id === currentUserId);
  const isManager = currentUser.role === "manager";

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleSwitchRole(id) {
    setCurrentUserId(id);
    setPage("dashboard");
  }

  function handleCheckIn() {
    const today = todayISO();
    const existing = timelogs.find((t) => t.employeeId === currentUser.id && t.date === today);
    if (existing?.checkIn) {
      showToast("Bạn đã chấm công vào hôm nay rồi.", "error");
      return;
    }
    setTimelogs((prev) => [...prev, { id: nextTimelogId++, employeeId: currentUser.id, date: today, checkIn: nowHHMM(), checkOut: null }]);
    showToast("Đã chấm công vào lúc " + nowHHMM() + ".", "success");
  }

  function handleCheckOut() {
    const today = todayISO();
    const existing = timelogs.find((t) => t.employeeId === currentUser.id && t.date === today);
    if (!existing?.checkIn) {
      showToast("Bạn cần chấm công vào trước khi chấm ra.", "error");
      return;
    }
    if (existing.checkOut) {
      showToast("Bạn đã chấm công ra hôm nay rồi.", "error");
      return;
    }
    setTimelogs((prev) => prev.map((t) => (t.id === existing.id ? { ...t, checkOut: nowHHMM() } : t)));
    showToast("Đã chấm công ra lúc " + nowHHMM() + ".", "success");
  }

  function handleLeaveSubmit({ fromDate, toDate, days, reason }) {
    setLeaveRequests((prev) => [
      ...prev,
      { id: nextLeaveId++, employeeId: currentUser.id, fromDate, toDate, days, reason, status: "PENDING", createdAt: todayISO() },
    ]);
    showToast("Đã gửi đơn xin nghỉ, đang chờ quản lý duyệt.", "success");
  }

  function handleApprove(id) {
    setLeaveRequests((prev) => prev.map((l) => (l.id === id && l.status === "PENDING" ? { ...l, status: "APPROVED" } : l)));
    showToast("Đã duyệt đơn xin nghỉ.", "success");
  }

  function handleReject(id, rejectReason) {
    setLeaveRequests((prev) => prev.map((l) => (l.id === id && l.status === "PENDING" ? { ...l, status: "REJECTED", rejectReason } : l)));
    showToast("Đã từ chối đơn xin nghỉ.", "success");
  }

  const pendingLeaveCount = leaveRequests.filter((l) => l.status === "PENDING").length;

  const employeeNav = [
    { key: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { key: "leave", label: "Xin nghỉ phép", icon: CalendarDays },
  ];
  const managerNav = [
    { key: "team", label: "Chấm công nhóm", icon: Users },
    { key: "approval", label: "Duyệt đơn nghỉ", icon: ShieldCheck, badge: pendingLeaveCount > 0 ? pendingLeaveCount : null },
  ];
  const navItems = isManager ? managerNav : employeeNav;

  const activePage = navItems.find((n) => n.key === page) ? page : navItems[0].key;

  return (
    <div style={{ display: "flex", minHeight: "100%", background: "#FAFAF8", fontFamily: "'Inter', sans-serif", color: "#1C1C1A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus { outline: 2px solid #1C2B3A22; border-color: #1C2B3A !important; }
        button:focus-visible { outline: 2px solid #1C2B3A; outline-offset: 1px; }
      `}</style>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ width: "230px", borderRight: "1px solid #E3E0D8", padding: "20px 12px", display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0 }}>
        <div style={{ padding: "6px 14px 14px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.01em" }}>CHẤM CÔNG</div>
          <div style={{ fontSize: "11px", color: "#8A8780", marginTop: "2px" }}>Demo quản lý công</div>
        </div>

        <div style={{ background: "#F4F2EC", borderRadius: "6px", padding: "10px", marginBottom: "10px" }}>
          <div style={{ fontSize: "10.5px", color: "#8A8780", fontWeight: 600, textTransform: "uppercase", marginBottom: "8px", paddingLeft: "2px" }}>
            Xem với vai trò
          </div>
          {employees.map((e) => (
            <button
              key={e.id}
              onClick={() => handleSwitchRole(e.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "7px 8px",
                borderRadius: "4px",
                border: "none",
                background: currentUserId === e.id ? "#FFFFFF" : "transparent",
                boxShadow: currentUserId === e.id ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
                marginBottom: "2px",
                textAlign: "left",
              }}
            >
              {e.role === "manager" ? <ShieldCheck size={14} color="#1C2B3A" /> : <UserCircle2 size={14} color="#6B6862" />}
              <span style={{ fontSize: "12px", fontWeight: currentUserId === e.id ? 600 : 500, color: "#1C1C1A" }}>{e.name}</span>
            </button>
          ))}
        </div>

        {navItems.map((item) => (
          <NavItem key={item.key} icon={item.icon} label={item.label} active={activePage === item.key} onClick={() => setPage(item.key)} badge={item.badge} />
        ))}

        <div style={{ marginTop: "auto", padding: "12px 14px", fontSize: "11px", color: "#B0AEA6", borderTop: "1px solid #EDEAE2", paddingTop: "14px" }}>
          Dữ liệu mock — phục vụ demo, không lưu trữ thật.
        </div>
      </div>

      <div style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
        {!isManager && activePage === "dashboard" && (
          <EmployeeDashboard employee={currentUser} timelogs={timelogs} leaveRequests={leaveRequests} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />
        )}
        {!isManager && activePage === "leave" && <LeaveRequestPage employee={currentUser} leaveRequests={leaveRequests} onSubmit={handleLeaveSubmit} />}
        {isManager && activePage === "team" && <ManagerTeamPage employees={employees} timelogs={timelogs} />}
        {isManager && activePage === "approval" && (
          <ManagerApprovalPage employees={employees} leaveRequests={leaveRequests} onApprove={handleApprove} onReject={handleReject} />
        )}
      </div>
    </div>
  );
}