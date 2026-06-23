import { useMemo } from "react";
import { formatDate, workedHours } from "../common/FunctionCommon";
import { PageHeader } from "./PageHeader";
import { CheckInOutCard } from "./CheckInOutCard";
import { StatCard } from "./StatCard";
import {
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart } from "lucide-react";

export function EmployeeDashboard({
  employee,
  timelogs,
  leaveRequests,
  onCheckIn,
  onCheckOut,
}) {
  const myLogs = timelogs
    .filter((t) => t.employeeId === employee.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const myLeaves = leaveRequests.filter((l) => l.employeeId === employee.id);
  const pendingCount = myLeaves.filter((l) => l.status === "PENDING").length;

  const chartData = useMemo(() => {
    return [...myLogs]
      .reverse()
      .slice(-7)
      .map((t) => ({
        label: formatDate(t.date).slice(0, 5),
        "Giờ làm": workedHours(t.checkIn, t.checkOut) || 0,
      }));
  }, [myLogs]);

  return (
    <div>
      <PageHeader
        title={`Xin chào, ${employee.name}`}
        subtitle={`${employee.department} · Mã nhân viên ${employee.id}`}
      />

      <div style={{ marginBottom: "20px" }}>
        <CheckInOutCard
          employee={employee}
          timelogs={timelogs}
          onCheckIn={onCheckIn}
          onCheckOut={onCheckOut}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "14px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <StatCard
          label="Ngày nghỉ còn lại"
          value={employee.leaveBalance}
          sub="Trong năm nay"
          accent="#1C2B3A"
        />
        <StatCard
          label="Đơn nghỉ chờ duyệt"
          value={pendingCount}
          sub="Đang chờ quản lý xử lý"
          accent="#B8923E"
        />
        <StatCard
          label="Số ngày đã chấm công"
          value={myLogs.length}
          sub="Tổng số bản ghi gần đây"
          accent="#2F6E4F"
        />
      </div>

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E3E0D8",
          borderRadius: "4px",
          padding: "18px 20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#1C1C1A",
            marginBottom: "4px",
          }}
        >
          Số giờ làm theo ngày
        </div>
        <div
          style={{ fontSize: "11.5px", color: "#8A8780", marginBottom: "12px" }}
        >
          7 lượt chấm công gần nhất
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E3E0D8"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6B6862" }}
              axisLine={{ stroke: "#E3E0D8" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6B6862" }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                fontSize: "12px",
                borderRadius: "4px",
                border: "1px solid #E3E0D8",
                fontFamily: "Inter, sans-serif",
              }}
            />
            <Bar
              dataKey="Giờ làm"
              fill="#1C2B3A"
              radius={[2, 2, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E3E0D8",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #E3E0D8",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          Lịch sử chấm công gần đây
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr style={{ background: "#F4F2EC" }}>
              {["Ngày", "Giờ vào", "Giờ ra", "Số giờ làm"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "9px 20px",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    color: "#6B6862",
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myLogs.slice(0, 6).map((t, idx) => {
              const hours = workedHours(t.checkIn, t.checkOut);
              return (
                <tr
                  key={t.id}
                  style={{
                    borderBottom:
                      idx === Math.min(5, myLogs.length - 1)
                        ? "none"
                        : "1px solid #EDEAE2",
                  }}
                >
                  <td style={{ padding: "11px 20px", color: "#1C1C1A" }}>
                    {formatDate(t.date)}
                  </td>
                  <td
                    style={{
                      padding: "11px 20px",
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: "#2F6E4F",
                    }}
                  >
                    {t.checkIn || "—"}
                  </td>
                  <td
                    style={{
                      padding: "11px 20px",
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: t.checkOut ? "#8B5FBF" : "#C4622D",
                    }}
                  >
                    {t.checkOut || "Chưa chấm ra"}
                  </td>
                  <td
                    style={{
                      padding: "11px 20px",
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: "#1C1C1A",
                    }}
                  >
                    {hours !== null ? `${hours}h` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
