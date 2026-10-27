# Hướng dẫn chạy website trong mạng trường học

## Bật chatbot Gemini RAG

1. Sao chép tệp `.env.example` và đổi tên bản sao thành `.env`.
2. Mở `.env`, điền khóa vào dòng `GEMINI_API_KEY=...`.
3. Không gửi hoặc đăng tệp `.env` lên mạng.
4. Chạy lại `BAT_DAU_WEBSITE.bat`.

Khi chưa có khóa, chatbot vẫn tra cứu kho kiến thức cục bộ nhưng không dùng Gemini để diễn giải.

## 1. Chuẩn bị máy chủ

- Chọn một máy tính Windows của giáo viên làm máy chủ.
- Máy chủ và thiết bị học sinh phải kết nối cùng một mạng Wi-Fi hoặc LAN.
- Cài Python 3 nếu máy chưa có: https://www.python.org/downloads/
- Khi cài Python, chọn **Add Python to PATH**.

## 2. Khởi động website

1. Giải nén toàn bộ thư mục, không chạy trực tiếp trong file ZIP.
2. Bấm đúp vào `BAT_DAU_WEBSITE.bat`.
3. Trình duyệt trên máy chủ sẽ tự mở website.
4. Cửa sổ màu đen sẽ hiện địa chỉ dành cho máy cùng Wi-Fi, ví dụ:

   `http://192.168.1.25:8000`

5. Học sinh nhập đúng địa chỉ này vào Chrome, Edge hoặc Safari.
6. Giữ cửa sổ máy chủ mở trong suốt tiết học.

## 3. Cho phép qua Windows Firewall

Ở lần chạy đầu tiên, Windows có thể hiện thông báo **Windows Defender Firewall**:

1. Chọn **Private networks**.
2. Chọn **Allow access**.
3. Không cần chọn Public networks nếu chỉ dùng trong trường.

Nếu không thấy thông báo nhưng máy học sinh không truy cập được, mở PowerShell bằng quyền Administrator và chạy:

```powershell
New-NetFirewallRule -DisplayName "Geometry Lab Port 8000" -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow -Profile Private
```

## 4. Kiểm tra kết nối

- Kiểm tra website mở được trên máy chủ bằng `http://localhost:8000`.
- Kiểm tra các thiết bị đang dùng cùng một Wi-Fi.
- Tắt VPN trên máy chủ và thiết bị học sinh nếu có.
- Một số Wi-Fi trường học bật chế độ cô lập thiết bị. Khi đó cần nhờ quản trị mạng cho phép các thiết bị trong cùng mạng liên lạc với nhau.

## 5. Dừng website

- Quay lại cửa sổ màu đen và nhấn `Ctrl + C`.
- Hoặc đóng cửa sổ đó.

## Lưu ý

- Địa chỉ IP có thể thay đổi sau khi khởi động lại modem hoặc máy tính.
- Có thể nhờ quản trị mạng đặt IP tĩnh cho máy chủ để địa chỉ luôn giống nhau.
- Website không cần Internet sau khi đã tải phông chữ; nếu trường không có Internet, giao diện vẫn hoạt động với phông chữ mặc định.
