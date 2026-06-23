# Hệ thống quản lý chấm công (Attendance Management Demo)

Demo giao diện quản lý chấm công và nghỉ phép nội bộ, xây dựng bằng React. Dự án tập trung thể hiện **tư duy phân tích nghiệp vụ (business analysis)** đứng sau một hệ thống chấm công, đặc biệt là luồng phân quyền giữa nhân viên và quản lý.

> Dữ liệu trong dự án là **mock data** (dữ liệu giả lập), không kết nối backend hay cơ sở dữ liệu thật. Mọi thay đổi chỉ tồn tại trong phiên làm việc hiện tại.

---

## 1. Bài toán nghiệp vụ

Quản lý công xoay quanh **thời gian của con người**, không phải số lượng vật chất như quản lý kho. Đơn vị nghiệp vụ là "nhân viên" và "ngày làm việc", không phải "sản phẩm".

Nghiệp vụ chấm công vận hành theo một vòng lặp 3 bước:

1. **Ghi nhận** — nhân viên tự chấm công vào/ra hằng ngày, hoặc gửi đơn xin nghỉ.
2. **Duyệt** — quản lý xem xét và phê duyệt hoặc từ chối đơn xin nghỉ. **Đây là bước không tồn tại trong nghiệp vụ kho** — người tạo yêu cầu (nhân viên) không có quyền tự xác nhận yêu cầu của mình.
3. **Tổng hợp** — dữ liệu chấm công và nghỉ phép được dùng để tính công, tính lương cuối kỳ (ngoài phạm vi demo này).

### Phạm vi đã triển khai trong demo

Demo tập trung vào 2 luồng chính: **chấm công vào/ra hằng ngày** và **xin nghỉ phép có duyệt**, thể hiện qua 2 góc nhìn (vai trò) riêng biệt: **Nhân viên** và **Quản lý**. Các nghiệp vụ liên quan đến tính lương, làm thêm giờ (overtime), hoặc phân ca không nằm trong phạm vi demo.

---

## 2. Đối tượng dữ liệu (Entities)

| Đối tượng | Mô tả | Thuộc tính chính |
|---|---|---|
| **Nhân viên** | Người dùng hệ thống | Mã NV, họ tên, phòng ban, vai trò (nhân viên/quản lý), số ngày phép còn lại |
| **Bản ghi chấm công** | Một ngày chấm công của một nhân viên | Nhân viên, ngày, giờ vào, giờ ra |
| **Đơn xin nghỉ** | Một yêu cầu nghỉ phép | Nhân viên, từ ngày, đến ngày, số ngày, lý do, trạng thái, lý do từ chối (nếu có) |

`Số ngày phép còn lại` (leaveBalance) là một thuộc tính sống — giảm dần khi đơn xin nghỉ được gửi, là cơ sở để kiểm tra trước khi cho phép gửi đơn mới.

---

## 3. Vai trò và phân quyền (Roles)

Đây là điểm khác biệt cốt lõi so với nghiệp vụ quản lý kho: **người tạo yêu cầu và người xử lý yêu cầu là hai vai trò tách biệt.**

| Vai trò | Được làm gì | Không được làm gì |
|---|---|---|
| **Nhân viên** | Chấm công vào/ra của chính mình; gửi đơn xin nghỉ; xem lịch sử chấm công và đơn nghỉ của mình | Không thể tự duyệt đơn xin nghỉ của mình; không xem được dữ liệu của nhân viên khác |
| **Quản lý** | Xem chấm công của toàn nhóm; duyệt hoặc từ chối đơn xin nghỉ (kèm lý do khi từ chối) | Không tự chấm công thay nhân viên; không tạo đơn xin nghỉ thay người khác |

Demo cho phép chuyển đổi giữa 4 người dùng mẫu (3 nhân viên + 1 quản lý) ở sidebar để minh họa rõ sự khác biệt giữa hai góc nhìn.

---

## 4. Quy tắc nghiệp vụ (Business Rules)

1. **Không thể chấm "vào" hai lần trong cùng một ngày khi chưa chấm "ra".**
   *Lý do nghiệp vụ:* tránh ghi nhận trùng ca làm việc, đảm bảo mỗi ngày chỉ có một cặp giờ vào/giờ ra hợp lệ.

2. **Không thể chấm "ra" khi chưa chấm "vào".**
   *Lý do nghiệp vụ:* giờ ra chỉ có ý nghĩa khi đã xác nhận có giờ vào tương ứng — đảm bảo tính nhất quán của một ca làm việc.

3. **Không thể xin nghỉ vượt quá số ngày phép còn lại.**
   Hệ thống tính số ngày xin nghỉ (bao gồm cả ngày bắt đầu và kết thúc) và so với số ngày phép còn lại của nhân viên trước khi cho gửi đơn.
   *Lý do nghiệp vụ:* đảm bảo nhân viên không nghỉ vượt quyền lợi được cấp, tránh phải xử lý ngoại lệ thủ công sau này.

4. **Đơn xin nghỉ luôn bắt đầu ở trạng thái "Chờ duyệt" và chỉ quản lý mới có quyền chuyển trạng thái.**
   Trạng thái đơn đi theo một chiều: `Chờ duyệt → Đã duyệt` hoặc `Chờ duyệt → Từ chối`. Nhân viên không có giao diện hay quyền nào để tự đổi trạng thái đơn của mình.
   *Lý do nghiệp vụ:* đây chính là **bước duyệt (approval workflow)** — đặc trưng của nghiệp vụ quản lý con người, khác với nghiệp vụ kho nơi người ghi phiếu thường có quyền xác nhận luôn.

5. **Khi từ chối đơn, quản lý phải nhập lý do.**
   *Lý do nghiệp vụ:* đảm bảo nhân viên hiểu vì sao đơn bị từ chối, tránh tranh chấp hoặc hiểu lầm về sau.

6. **Mỗi nhân viên chỉ thấy được dữ liệu chấm công và đơn nghỉ của chính mình; quản lý thấy được dữ liệu của toàn nhóm.**
   *Lý do nghiệp vụ:* nguyên tắc bảo mật và phân quyền dữ liệu theo vai trò cơ bản trong mọi hệ thống nhân sự.

---

## 5. Luồng màn hình

### Góc nhìn Nhân viên
| Màn hình | Vai trò |
|---|---|
| **Tổng quan** | Chấm công vào/ra hôm nay, số ngày phép còn lại, biểu đồ số giờ làm theo ngày, lịch sử chấm công gần đây |
| **Xin nghỉ phép** | Form gửi đơn xin nghỉ (có kiểm tra số ngày phép còn lại), danh sách đơn đã gửi và trạng thái xử lý |

### Góc nhìn Quản lý
| Màn hình | Vai trò |
|---|---|
| **Chấm công nhóm** | Trạng thái chấm công hôm nay của từng nhân viên (đang làm việc / đã hoàn thành / chưa chấm công), lịch sử chấm công toàn nhóm |
| **Duyệt đơn nghỉ** | Danh sách đơn xin nghỉ theo trạng thái, hành động Duyệt/Từ chối (kèm lý do khi từ chối) |

---

## 6. So sánh với nghiệp vụ quản lý kho

Đây là phần giúp nhìn rõ điểm giống và khác giữa hai loại nghiệp vụ "quản lý" thường gặp:

| | Quản lý kho | Quản lý công |
|---|---|---|
| Đối tượng theo dõi | Sản phẩm/vật tư | Con người |
| Đơn vị đo | Số lượng (cái, kg, thùng...) | Thời gian (giờ, ngày) |
| Hành động chính | Nhập / Xuất | Chấm công / Xin nghỉ / Duyệt |
| Ràng buộc cốt lõi | Không xuất vượt tồn | Không xin nghỉ vượt số ngày phép còn lại |
| Ai thay đổi dữ liệu | Người ghi phiếu tự xác nhận | Nhân viên tạo yêu cầu, **quản lý duyệt riêng** |
| Bước duyệt tách biệt | Không có | **Có** — đặc trưng cốt lõi của nghiệp vụ này |

Điểm giống nhau ở tầng kỹ thuật: cả hai đều là hệ thống ghi nhận giao dịch theo thời gian (transaction log), có ngưỡng cảnh báo (kho: dưới mức tối thiểu; công: vượt số ngày phép), và có nhật ký để đối soát. Điểm khác biệt nằm ở **luồng phân quyền (approval workflow)** — đây là khác biệt thuộc về thiết kế nghiệp vụ, không phải khác biệt về giao diện.

---

## 7. Hướng phát triển tiếp (nếu có thêm thời gian)

- Tính lương dựa trên số giờ làm và số ngày nghỉ trong kỳ
- Quản lý làm thêm giờ (overtime) với quy tắc tính riêng
- Phân ca làm việc (ca sáng/chiều/đêm) thay vì một cặp giờ vào/ra duy nhất mỗi ngày
- Thông báo (notification) cho quản lý khi có đơn mới, và cho nhân viên khi đơn được xử lý
- Kết nối backend thật, xác thực đăng nhập theo từng người dùng thay vì chuyển vai trò thủ công như trong demo

---

## 8. Công nghệ sử dụng

- **React** (function components, hooks: `useState`, `useMemo`)
- **Recharts** — biểu đồ số giờ làm theo ngày
- **Lucide React** — icon hệ thống
- Toàn bộ dữ liệu là **mock data** được khai báo sẵn trong code, không có backend/API thật

---

## 9. Giả định đã đặt ra

- Mỗi nhân viên chỉ có một ca làm việc trong ngày (một cặp giờ vào/giờ ra) — không xử lý nhiều ca/ngày
- Số ngày phép còn lại không tự động trừ ngay khi gửi đơn, mà được dùng làm điều kiện kiểm tra khi gửi đơn mới (việc trừ chính thức diễn ra sau khi đơn được duyệt, tùy theo quy chế công ty — đây là điểm có thể tinh chỉnh nếu công ty có quy tắc khác)
- Demo chỉ có một quản lý cho toàn bộ nhân viên (không phân theo nhiều phòng ban có quản lý riêng)
