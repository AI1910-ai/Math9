# 📐 MathLab - Phòng Thí Nghiệm Hình Học Động Toán 9 (GDPT 2018)

> **Môi trường học tập số và mô phỏng tương tác 3D đa giác quan dành cho môn Toán lớp 9 theo Chương trình Giáo dục Phổ thông 2018.**

[![GitHub Pages](https://img.shields.io/badge/Live_Demo-GitHub_Pages-0c6f61?style=for-the-badge&logo=github)](https://ai1910-ai.github.io/Math9/)
[![GDPT 2018](https://img.shields.io/badge/Chương_trình-GDPT_2018-blue?style=for-the-badge)](https://ai1910-ai.github.io/Math9/)
[![MathType & KaTeX](https://img.shields.io/badge/Công_thức-MathType_%2F_KaTeX-purple?style=for-the-badge)](https://ai1910-ai.github.io/Math9/)
[![Offline First](https://img.shields.io/badge/Mạng_LAN-Chạy_không_cần_Internet-orange?style=for-the-badge)](https://ai1910-ai.github.io/Math9/)

---

## 🌐 Trải nghiệm trực tuyến
👉 **Truy cập ngay:** **[https://ai1910-ai.github.io/Math9/](https://ai1910-ai.github.io/Math9/)**

---

## 💡 Giới thiệu tổng quan

**MathLab** là một sáng kiến công nghệ giáo dục (EdTech) đột phá, biến các khái niệm và công thức hình học không gian trừu tượng trong SGK Toán 9 thành các mô hình đồ họa động 3D tương tác trực tiếp theo thời gian thực.

Dự án được xây dựng bám sát cấu trúc **Chương IX & X - SGK Toán 9 (Kết nối tri thức / Cánh diều / Chân trời sáng tạo)**, đóng vai trò là thiết bị dạy học số hiện đại phục vụ các cuộc thi:
- *Cuộc thi Thiết bị dạy học số toàn quốc*
- *Hội thi Giáo viên dạy giỏi các cấp*
- *Cuộc thi Sáng tạo Khoa học Kỹ thuật dành cho thanh thiếu niên*
- *Báo cáo Sáng kiến Kinh nghiệm đổi mới phương pháp giảng dạy*

---

## ✨ Các tính năng vượt trội

### 1. 🧊 05 Mô hình Hình học Động 3D Thời gian thực
- **Hình trụ động (Bài 30):**
  - *Quan sát khối:* Xoay 360°, phóng to thu nhỏ, tự do điều chỉnh bán kính $r$, chiều cao $h$ và đơn vị đo tùy ý ($cm, m, dm, mm$).
  - *Tạo hình (Quay):* Mô phỏng chuyển động quay $0^\circ \to 360^\circ$ của hình chữ nhật quanh một cạnh cố định để tạo hình trụ.
  - *Trải phẳng (Unfold Net):* Thân trụ từ từ mở bung ra thành hình chữ nhật kích thước $2\pi r \times h$, hai nắp tròn mở ra ở hai mép, chứng minh trực quan công thức $S_{xq} = 2\pi rh$ và $S_{tp} = 2\pi rh + 2\pi r^2$.
  - *Thực tế sinh động:* Mô phỏng vỏ lon sữa đặc Ông Thọ (thân dập gờ chịu lực, hai nắp kín, dung tích $V \approx 344\text{ ml}$).
- **Hình nón động (Bài 31):**
  - *Tạo hình (Quay):* Mô phỏng tam giác vuông quay quanh cạnh góc vuông để quét nên khối nón và đường sinh $l = \sqrt{r^2 + h^2}$.
  - *Trải phẳng (Unfold Net):* Mặt nón xẻ dọc theo đường sinh và mở bung thành hình quạt tròn bán kính $l$, góc ở tâm $\theta = \frac{r}{l} \cdot 360^\circ$, độ dài cung bằng chu vi đáy $2\pi r$.
  - *Thực tế sinh động:* Chiếc nón lá bài thơ truyền thống (rỗng đáy, bộ ba Pythagore 3-4-5).
- **Hình cầu động (Bài 32):**
  - *Tạo hình (Quay):* Nửa hình tròn quay quanh đường kính quét nên khối cầu.
  - *Mặt cắt không gian ($r' = \sqrt{R^2 - h_c^2}$):* Thanh trượt di chuyển mặt phẳng cắt $y = h_c$, nổi bật giao tuyến thiết diện cam rực rỡ và mô phỏng tam giác vuông $\triangle OHM$ chứng minh hệ thức Pythagore giữa $R, h_c, r'$. Tự động nhận diện 3 trường hợp: không cắt ($|h_c| > R$), tiếp xúc ($|h_c| = R$), và đường tròn thiết diện ($0 \le |h_c| < R$).
  - *Thực tế sinh động:* Quả bóng rổ thi đấu tiêu chuẩn Size 7 với các đường rãnh 3D sắc nét.
- **Hình hộp chữ nhật & Hình chóp tứ giác:** Khám phá đường chéo không gian và thể tích khối đa diện.

---

### 2. 📝 Không gian Luyện tập & Đánh giá Năng lực (GDPT 2018)
- **Dành cho Giáo viên:**
  - Giao bài tập mới với giao diện trực quan: hỗ trợ cả câu hỏi tự luận điền số và trắc nghiệm 4 phương án ($A, B, C, D$).
  - Soạn công thức toán học chuẩn KaTeX/LaTeX ($r = 4\text{ cm}$, $$V = \frac{4}{3}\pi r^3$$) và đính kèm ảnh minh họa.
  - **Xuất gói đề thi (`.json`):** Tải toàn bộ ngân hàng câu hỏi để chia sẻ cho đồng nghiệp.
  - **Nhập đề thi (`.json`):** Nạp thêm ngân hàng bài tập mới tức thì với cơ chế bảo toàn dữ liệu.
- **Dành cho Học sinh:**
  - Lọc bài theo chủ đề từng khối hình.
  - Tự làm bài, kiểm tra đáp số tự động, nhận phản hồi tức thì và xem hướng dẫn giải chi tiết.
  - Theo dõi thanh tiến độ hoàn thành bài tập thời gian thực.

---

### 3. 🛠️ Xưởng dựng hình không gian (Builder)
- Công cụ vẽ hình dành cho giáo viên soạn bài giảng và ra đề thi.
- Hỗ trợ các khối hình chóp, lăng trụ, chóp cụt, hình lập phương.
- Thêm điểm, nối cạnh, phân biệt nét liền / nét đứt khuất.
- Xuất bản vẽ ra định dạng vector SVG, ảnh độ phân giải cao PNG hoặc mã nguồn $\text{\LaTeX}$ TikZ để chèn trực tiếp vào tài liệu Word/LaTeX.

---

### 4. 🤖 Trợ lý Toán AI & Nhạc nền tập trung (Ambient Music)
- **Trợ lý AI chuyên biệt:** Hệ thống RAG (Retrieval-Augmented Generation) tra cứu chuẩn kiến thức hình học 9, giải thích công thức, phân tích lỗi sai và gợi ý bài tập thực tế.
- **Nhạc nền Ambient:** Nhạc không lời êm dịu giúp học sinh tập trung tư duy sâu khi học toán; có nút bật/tắt tiện lợi ngay thanh điều hướng.

---

### 5. 📄 Hồ sơ Sáng kiến Kinh nghiệm đi kèm
- Tệp báo cáo hoàn chỉnh: `BAO_CAO_SANG_KIEN_KINH_NGHIEM_MATHLAB_TOAN_9.docx` (và `.md`).
- Biên soạn theo quy chuẩn thể thức văn bản hành chính **Nghị định 30/2020/NĐ-CP**.
- Toàn bộ **708 công thức toán** được chuyển đổi sang đối tượng toán học gốc Microsoft Office OMML, tương thích 2 chiều hoàn hảo với **MathType**.

---

## 🚀 Hướng dẫn cài đặt & Sử dụng

### Cách 1: Chạy trực tuyến (Không cần cài đặt)
Chỉ cần truy cập đường dẫn: **[https://ai1910-ai.github.io/Math9/](https://ai1910-ai.github.io/Math9/)**

### Cách 2: Chạy mạng LAN trong phòng máy trường học (Không cần Internet)
Hệ thống tích hợp sẵn máy chủ cục bộ siêu nhẹ viết bằng Python:
1. Tải toàn bộ mã nguồn về máy tính giáo viên.
2. Nhấp đúp vào tệp **`BAT_DAU_WEBSITE.bat`** (hoặc chạy lệnh: `python run_lan_server.py`).
3. Phần mềm sẽ khởi động tại `http://localhost:8000` và tự động hiển thị mã QR kèm địa chỉ IP nội bộ (ví dụ: `http://192.168.1.15:8000`).
4. Học sinh trong phòng máy chỉ cần mở trình duyệt và nhập địa chỉ IP trên là có thể cùng học tập đồng thời với độ trễ cực thấp.

---

## 📂 Cấu trúc thư mục

```
MathLab/
├── index.html                   # Trang chủ phòng thí nghiệm 3D
├── styles.css                   # Giao diện chính & hiệu ứng chuyển động
├── app.js                       # Đồ họa Canvas 3D, mô phỏng quay, cắt & trải phẳng
├── practice.js                  # Module luyện tập, chấm điểm & xuất nhập JSON
├── practice.css                 # Giao diện khu vực luyện tập
├── builder.js & builder.css     # Xưởng dựng hình không gian cho giáo viên
├── ai-assistant.html & .js      # Không gian Trợ lý Toán AI RAG
├── knowledge-base.json          # Ngân hàng tri thức GDPT 2018
├── vendor/                      # Thư viện KaTeX ngoại tuyến
├── assets/                      # Hình ảnh thực tế & âm thanh ambient
├── BAO_CAO_SANG_KIEN_...docx    # Bản báo cáo sáng kiến chuẩn MathType
├── BAT_DAU_WEBSITE.bat          # Khởi chạy nhanh máy chủ LAN phòng học
└── run_lan_server.py            # Máy chủ Python LAN nội bộ
```

---

## 👨‍🏫 Tác giả & Bản quyền

- **Tác giả:** Thầy cô & Nhóm nghiên cứu Sáng kiến Toán học GDPT 2018.
- **Bản quyền:** © 2026 MathLab. Được phát triển vì tình yêu Toán học và sự tiến bộ của học sinh Việt Nam.
