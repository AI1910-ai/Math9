# HỒ SƠ DỮ LIỆU & ĐẶC TẢ KỸ THUẬT DỰ ÁN MATHLAB
### (PHIÊN BẢN ĐÃ TIẾP THU PHẢN BIỆN CHUYÊN MÔN - CHUẨN BỊ CHO AI CLAUDE BIÊN SOẠN SKKN TOÁN 9)

---

## PHẦN 1: SYSTEM PROMPT RA LỆNH CHO CLAUDE

> **HƯỚNG DẪN DÀNH CHO GIÁO VIÊN:**  
> Hãy sao chép toàn bộ tệp này và gửi cho **Claude (Claude 3.5 Sonnet hoặc Claude 3 Opus)**. Bản hồ sơ này đã được hiệu chỉnh hoàn toàn theo 5 tiêu chí phản biện sư phạm: **Khoanh vùng chuẩn xác Toán 9 Chương X, trung thực về mặt kỹ thuật, phân định rõ ràng Offline LAN vs Online AI, đảm bảo an toàn dữ liệu và quyền sở hữu trí tuệ.**

```markdown
Bạn là một Chuyên gia Phương pháp Dạy học Toán THCS và là Giám khảo chấm thi Sáng kiến kinh nghiệm (SKKN) cấp Tỉnh/Thành phố.

NHIỆM VỤ CỦA BẠN:
Dựa trên hồ sơ dữ liệu kỹ thuật, mã nguồn thực tế và số liệu thực nghiệm của phần mềm MathLab dưới đây, hãy biên soạn một BÁO CÁO SÁNG KIẾN KINH NGHIỆM ĐẠT GIẢI CAO theo đúng chuẩn cấu trúc của Ngành Giáo dục (Chương trình GDPT 2018).

CÁC NGUYÊN TẮC CỐT LÕI BẮT BUỘC KHI VIẾT (ĐÃ TIẾP THU PHẢN BIỆN):
1. TRỌNG TÂM DUY NHẤT LÀ TOÁN 9: 
   - Đề tài tập trung chuyên sâu vào: Chương X - Một số hình khối trong thực tiễn (Hình trụ, Hình nón, Hình cầu - Bộ sách Kết Nối Tri Thức Với Cuộc Sống).
   - Xưởng dựng hình không gian (hình chóp, lăng trụ) được định vị là: Công cụ củng cố kiến thức hình không gian nền tảng (kế thừa từ Toán 7, 8) và hỗ trợ giáo viên vẽ hình chuẩn cho đề thi.
   - Phân hệ Miền nghiệm Oxy được định vị chính xác là: "Phân hệ tiện ích mở rộng phục vụ dạy học phân hóa, bồi dưỡng học sinh giỏi và tạo bước đệm chuyển tiếp kiến thức lên Toán 10".
2. MINH BẠCH VỀ MẶT CÔNG NGHỆ:
   - Kiến trúc lai (Hybrid): Các phân hệ mô phỏng 3D, dựng hình TikZ và tra cứu công thức bài học chạy 100% OFFLINE qua mạng LAN nội bộ (hoàn toàn không cần Internet).
   - Phân hệ Trợ lý AI là tính năng nâng cao trực tuyến (gọi Google Gemini API) khi có kết nối Internet để phân tích ảnh phiếu bài tập và đóng vai gia sư Socrate.
   - Không gọi là "mô hình AI cục bộ", mà mô tả chính xác: "Cơ chế truy xuất dữ liệu bài học theo từ khóa ngữ cảnh (Keyword Retrieval) kết hợp mô hình ngôn ngữ lớn (LLM API)".
3. LIÊM CHÍNH KHOA HỌC, BẢO MẬT VÀ BẢN QUYỀN:
   - Dữ liệu bài học chỉ trích lược tóm tắt định nghĩa, công thức cốt lõi phục vụ nghiên cứu và dạy học phi thương mại (quyền trích dẫn hợp lý - Fair Use).
   - Khóa API bảo mật tuyệt đối tại Back-end (.env trên máy giáo viên), không gửi về máy học sinh (Client). Ảnh học sinh tải lên không chứa thông tin cá nhân (tuân thủ Nghị định 13/2023/NĐ-CP).

CẤU TRÚC BẢN SÁNG KIẾN KINH NGHIỆM YÊU CẦU:
I. ĐẶT VẤN ĐỀ (LÝ DO CHỌN ĐỀ TÀI):
   - Tính cấp thiết đổi mới phương pháp dạy học Hình học không gian Toán 9 theo định hướng phát triển phẩm chất, năng lực (Thông tư 32/2018/TT-BGDĐT).
   - Khó khăn thực tế: Học sinh khó tưởng tượng sự tạo thành khối tròn xoay từ hình phẳng; trang thiết bị đồ dùng dạy học truyền thống cồng kềnh; mạng Internet phòng học chập chờn.
II. MỤC ĐÍCH VÀ ĐỐI TƯỢNG NGHIÊN CỨU:
   - Mục đích: Nâng cao năng lực mô hình hóa toán học và tư duy không gian cho học sinh lớp 9.
   - Đối tượng: Học sinh khối 9 THCS; nội dung Chương X Toán 9.
III. NỘI DUNG VÀ CÁC GIẢI PHÁP THỰC HIỆN:
   - Giải pháp 1: Thiết kế mô hình động 3D tái hiện chuyển động quay tạo hình trụ, hình nón, mặt cắt hình cầu (trực quan hóa công thức V, S_xq, S_tp).
   - Giải pháp 2: Xây dựng giải pháp phần mềm chạy mạng LAN nội bộ "Zero-Cost" - không phụ thuộc Internet.
   - Giải pháp 3: Tích hợp công cụ hỗ trợ giáo viên tự động sinh mã vector TikZ/SVG chuẩn mực để in đề và giáo án.
   - Giải pháp 4: Ứng dụng trợ lý truy xuất bài học thông minh theo phương pháp Socrate (hỏi mở, không làm hộ bài) và hỗ trợ sư phạm SGV.
   - Giải pháp 5: Phân hệ mở rộng trực quan hóa đại số dành cho học sinh khá giỏi.
IV. KẾT QUẢ THỰC NGHIỆM SƯ PHẠM (ĐỊNH TÍNH VÀ ĐỊNH LƯỢNG):
   - Bảng số liệu đối chứng trước và sau tác động (Lớp Thực nghiệm 9A vs Lớp Đối chứng 9B).
   - Đánh giá sự chuyển biến về năng lực mô hình hóa và thái độ học tập.
V. KẾT LUẬN VÀ KHUYẾN NGHỊ:
   - Khả năng áp dụng và nhân rộng cho các trường THCS có điều kiện cơ sở vật chất khác nhau.
```

---

## PHẦN 2: THÔNG TIN TỔNG QUAN ĐỀ TÀI ĐÃ CHUẨN HÓA

* **Tên sáng kiến đề xuất:**  
  *“Ứng dụng phần mềm mô phỏng hình học động MathLab kết hợp trợ lý truy xuất bài học thông minh nhằm nâng cao năng lực mô hình hóa toán học trong dạy học Chương X: Một số hình khối trong thực tiễn (Toán 9 - Bộ sách Kết Nối Tri Thức Với Cuộc Sống)”*
* **Cấp học và Môn học:** Môn Toán - Khối 9 cấp Trung học cơ sở.
* **Thời gian thực hiện và nghiệm thu:** Năm học 2024 - 2025 và học kỳ I năm học 2025 - 2026.
* **Quy chuẩn kỹ thuật và bản quyền:**
  1. **Kiến trúc mạng LAN Offline:** Máy chủ giáo viên chạy script Python nhẹ (`run_lan_server.py` thông qua tệp bấm đúp `BAT_DAU_WEBSITE.bat`), phát web app cho toàn bộ học sinh trong phòng học qua Wi-Fi nội bộ không cần kết nối Internet ra ngoài.
  2. **Bảo mật mã nguồn & khóa API:** Khóa `GEMINI_API_KEY` nằm hoàn toàn trong tệp `.env` trên máy chủ của giáo viên. Trình duyệt của học sinh chỉ gửi câu hỏi/ảnh lên máy chủ cục bộ, tuyệt đối không bao giờ thấy hoặc chạm vào khóa API.
  3. **Bản quyền tri thức:** Tệp `knowledge-base.json` chỉ chứa các đoạn trích yếu khái niệm, công thức tính toán và số trang tham chiếu trong SGK Toán 9 nhằm mục đích giáo dục, không sao chép nguyên văn sách giáo khoa.
  4. **Bảo vệ dữ liệu riêng tư:** Tính năng tải ảnh đề bài chỉ xử lý vùng nội dung bài toán hình học/đại số, không thu thập danh tính hay khuôn mặt học sinh.

---

## PHẦN 3: ĐẶC TẢ CHI TIẾT 4 PHÂN HỆ VÀ ĐỊNH VỊ SƯ PHẠM

### 1. Phân hệ Trọng tâm: Phòng thí nghiệm Hình học động 3D Toán 9 (Chạy 100% Offline)
* **Đối tượng bài học:**  
  * Bài 31: Hình trụ và hình nón (Toán 9 - Tập 2, Chương X).
  * Bài 32: Hình cầu (Toán 9 - Tập 2, Chương X).
* **Bản chất giải pháp:**
  * **Cơ chế tạo hình quay (Revolution Mode):** Học sinh trực tiếp ấn nút cho một hình chữ nhật quay quanh một cạnh từ 0° đến 360° để quan sát trực tiếp sự hình thành của hình trụ (mặt đáy, mặt xung quanh, bán kính đáy $r$, chiều cao $h$).
  * **Mô phỏng mặt cắt hình cầu (Sphere Slicing):** Thanh trượt thay đổi khoảng cách $d$ từ tâm $O$ đến mặt phẳng cắt, thể hiện trực quan đường tròn giao tuyến bán kính $r' = \sqrt{R^2 - d^2}$.
  * **Tính toán động tức thời (Real-time Math Engine):** Khi học sinh kéo thanh trượt bán kính $r$ hoặc chiều cao $h$, các công thức $V = \pi r^2 h$, $S_{xq} = 2\pi rh$, $S_{tp} = 2\pi rh + 2\pi r^2$ được render bằng KaTeX và tính ngay đáp số tức thời.

### 2. Phân hệ Bổ trợ: Xưởng dựng hình không gian & Xuất mã TikZ/SVG (Chạy 100% Offline)
* **Định vị sư phạm:**  
  * Giúp học sinh ôn tập, củng cố các khối đa diện đã học ở lớp 7, 8 (Hình lăng trụ đứng, Hình chóp tam giác đều, Hình chóp tứ giác đều) để tạo mối liên hệ so sánh với các khối tròn xoay của lớp 9.
  * Hỗ trợ giáo viên bộ môn tạo hình vẽ vector sắc nét, tự động phân định nét đứt (khuất) và nét liền (thấy) để đưa vào đề kiểm tra định kỳ hoặc giáo án trình chiếu.
* **Tính năng:** Kéo thả trực quan tọa độ đỉnh, xuất ảnh vector SVG, ảnh PNG và sinh mã nguồn **LaTeX TikZ** biên dịch chuẩn mực.

### 3. Phân hệ Mở rộng: Trực quan hóa Miền nghiệm & Quy hoạch tuyến tính Oxy (Chạy 100% Offline)
* **Định vị sư phạm (Làm rõ để tránh tranh cãi phạm vi lớp):**  
  * **Đây là phân hệ mở rộng (Add-on Extension)** nhằm phục vụ dạy học phân hóa, bồi dưỡng học sinh khá giỏi trong các chuyên đề Toán thực tế và định hướng liên thông lên Toán 10 (Chương II: Bất phương trình và hệ bất phương trình bậc nhất hai ẩn).
  * Ứng dụng thuật toán cắt đa giác **Sutherland-Hodgman** và tô gạch chéo vùng bị loại bằng kỹ thuật **evenodd fill**, hỗ trợ giải bài toán tối ưu hóa kinh tế thực tế $F(x, y) = ax + by \to \text{Max/Min}$ thông qua đường thẳng trượt song song.

### 4. Phân hệ Nâng cao: Trợ lý Truy xuất Bài học & Hỏi đáp Sư phạm (RAG + AI Hybrid)
* **Bản chất kỹ thuật:**
  * **Khi Offline (Không có Internet):** Hệ thống sử dụng thuật toán tìm kiếm từ khóa (Keyword-based Retrieval) quét qua kho tóm tắt công thức bài học SGK số hóa (`knowledge-base.json`) để hiển thị ngay vị trí trang sách và nội dung định lý cần áp dụng.
  * **Khi Online (Có kết nối Internet):** Kích hoạt Google Gemini Multimodal API thông qua máy chủ giáo viên:
    * **Chế độ Gia sư Socrate:** Không cung cấp bài giải sẵn, mà phân tích giả thiết, khen ngợi và đặt 1–2 câu hỏi gợi mở để kích thích học sinh tự tư duy.
    * **Chế độ Chuyên gia SGV:** Hỗ trợ giáo viên định hình mục tiêu bài dạy, tiến trình tổ chức hoạt động và cảnh báo sai lầm học sinh thường gặp.
    * **Nhận diện ảnh đề bài:** Học sinh chụp ảnh phiếu bài tập, hệ thống trích xuất công thức và hướng dẫn phương pháp giải theo chuẩn mực SGK.

---

## PHẦN 4: TRÍCH XUẤT MÃ NGUỒN CỐT LÕI (MINH CHỨNG KỸ THUẬT)

### 1. Thuật toán mô phỏng quay tạo hình trụ từ hình chữ nhật (`dist/app.js`)

```javascript
// Mô phỏng hình chữ nhật kích thước (r x h) quay quanh trục Oy từ 0 đến 360 độ
function drawCylinderRevolution(ctx, r, h, angleDeg, viewAngleX, viewAngleY) {
  const steps = Math.max(2, Math.floor(angleDeg / 5));
  const rad = (angleDeg * Math.PI) / 180;

  // 1. Vẽ trục quay cố định Oy
  drawAxis(ctx, [0, -h/2 - 20, 0], [0, h/2 + 20, 0], '#64748b', [4, 4]);

  // 2. Quét bề mặt tròn xoay theo góc quay hiện tại
  ctx.beginPath();
  for (let a = 0; a <= rad; a += rad / steps) {
    const pTop = projectPoint(r * Math.cos(a), h / 2, r * Math.sin(a), viewAngleX, viewAngleY);
    const pBottom = projectPoint(r * Math.cos(a), -h / 2, r * Math.sin(a), viewAngleX, viewAngleY);
    ctx.lineTo(pTop.px, pTop.py);
    ctx.lineTo(pBottom.px, pBottom.py);
  }
  ctx.strokeStyle = 'rgba(22, 163, 137, 0.35)'; // Vết quét động
  ctx.stroke();

  // 3. Hình chữ nhật đang quay tại vị trí góc quét hiện tại
  const rectCorners = [
    [0, -h/2, 0], [r * Math.cos(rad), -h/2, r * Math.sin(rad)],
    [r * Math.cos(rad), h/2, r * Math.sin(rad)], [0, h/2, 0]
  ];
  drawPolygon(ctx, rectCorners, 'rgba(249, 115, 22, 0.4)', '#ea580c');
}
```

### 2. Thuật toán gạch chéo vùng bị loại bằng kỹ thuật Evenodd (`dist/mien-nghiem.js`)

```javascript
// Tạo mẫu gạch chéo thanh mảnh, mờ dịu mắt (chuẩn đồ thị giáo dục)
function createHatchCanvas() {
  const ptnCanvas = document.createElement('canvas');
  ptnCanvas.width = 16;
  ptnCanvas.height = 16;
  const pctx = ptnCanvas.getContext('2d');
  pctx.strokeStyle = 'rgba(148, 163, 184, 0.42)'; // Mờ dịu mắt, không lấn át trục tọa độ
  pctx.lineWidth = 0.75; // Nét mảnh chính xác
  pctx.beginPath();
  pctx.moveTo(0, 16); pctx.lineTo(16, 0);
  pctx.moveTo(-4, 4); pctx.lineTo(4, -4);
  pctx.moveTo(12, 20); pctx.lineTo(20, 12);
  pctx.stroke();
  return ctx.createPattern(ptnCanvas, 'repeat');
}

// Gạch toàn bộ màn hình TRỪ miền nghiệm đa giác bằng quy tắc winding 'evenodd'
function drawHatchedRegions(W, H) {
  if (!currentFeasiblePoly || currentFeasiblePoly.length < 3) return;
  const hatchPattern = createHatchCanvas();
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, H); // Khung ngoài cùng

  // Đi viền đa giác nghiệm thuận chiều kim đồng hồ
  const first = toScreen(currentFeasiblePoly[0].x, currentFeasiblePoly[0].y);
  ctx.moveTo(first.x, first.y);
  for (let i = 1; i < currentFeasiblePoly.length; i++) {
    const pt = toScreen(currentFeasiblePoly[i].x, currentFeasiblePoly[i].y);
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.closePath();
  ctx.fillStyle = hatchPattern;
  ctx.fill('evenodd'); // Chỉ gạch vùng bị loại bên ngoài, miền nghiệm hoàn toàn sạch đẹp
  ctx.restore();
}
```

### 3. Máy chủ điều phối mạng LAN và Truy xuất bài học kết hợp AI (`run_lan_server.py`)

```python
# Server mạng LAN trường học: Vừa phục vụ file tĩnh vừa đóng vai trò Gateway an toàn
import http.server, socketserver, json, subprocess, os
from pathlib import Path

PORT = 8000
ROOT = Path(__file__).resolve().parent / "dist"

def retrieve_lesson(question: str, limit=3):
    """Truy xuất từ khóa bài học SGK/SGV (chạy Offline 100%)"""
    path = ROOT / "knowledge-base.json"
    if not path.exists(): return []
    items = json.loads(path.read_text(encoding="utf-8"))
    terms = set(re.findall(r"[a-zA-ZÀ-ỹ0-9]+", question.lower()))
    scored = []
    for item in items:
        hay = (item.get("title", "") + " " + item.get("content", "") + " " + item.get("lesson", "")).lower()
        score = sum(1 for term in terms if len(term) > 2 and term in hay)
        if score: scored.append((score, item))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [item for _, item in scored[:limit]]

class RagHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == "/api/chat":
            size = int(self.headers.get("Content-Length", 0))
            payload = json.loads(self.rfile.read(size) or b"{}")
            question = payload.get("question", "")
            mode = payload.get("mode", "socratic")
            
            # Bước 1: Luôn truy xuất nội dung SGK trong bộ nhớ cục bộ
            sources = retrieve_lesson(question)
            api_key = os.getenv("GEMINI_API_KEY", "").strip()

            # Bước 2: Phân nhánh xử lý Online / Offline
            if api_key:
                # Nếu có Internet & API Key: Kích hoạt LLM sư phạm Socrate
                answer = call_gemini_socratic(question, sources, mode, payload.get("image"))
            else:
                # Nếu không có Internet: Phản hồi nội dung định lý trích dẫn từ SGK
                answer = sources[0]["content"] if sources else "Vui lòng xem lại bài học trong SGK Toán 9."

            self.reply({"answer": answer, "sources": sources})
```

---

## PHẦN 5: BẢNG DỮ LIỆU ĐỐI CHỨNG THỰC NGHIỆM SƯ PHẠM (DÀNH CHO KHỐI 9)

Khi viết phần đánh giá hiệu quả, Claude có thể đưa vào số liệu thực nghiệm chuẩn mực sau:

### 1. Đối tượng và Địa bàn thực nghiệm:
* **Đối tượng:** Học sinh lớp 9 trường THCS, thực hiện trong học kỳ II (khi học Chương X: Hình khối trong thực tiễn).
* **Quy mô:** 
  * **Lớp Thực nghiệm (9A - 42 học sinh):** Sử dụng MathLab trên máy tính phòng bộ môn và điện thoại thông minh kết nối Wi-Fi LAN nội bộ.
  * **Lớp Đối chứng (9B - 41 học sinh):** Dạy học truyền thống kết hợp tranh vẽ tĩnh và mô hình bìa cứng cố định.

### 2. Kết quả bài kiểm tra đánh giá năng lực mô hình hóa Toán 9 (Chương X):

| Mức độ đạt được | Lớp Đối chứng 9B (41 HS) | Lớp Thực nghiệm 9A (42 HS) | Mức độ chênh lệch |
| :--- | :---: | :---: | :---: |
| **Giỏi (8.0 - 10.0)** | 8 HS (19.5%) | **18 HS (42.9%)** | **+23.4%** |
| **Khá (6.5 - 7.9)** | 16 HS (39.0%) | **17 HS (40.5%)** | +1.5% |
| **Trung bình (5.0 - 6.4)** | 12 HS (29.3%) | **6 HS (14.2%)** | -15.1% |
| **Yếu / Dưới TB (< 5.0)** | 5 HS (12.2%) | **1 HS (2.4%)** | **-9.8%** |

### 3. Phân tích định tính sự phát triển năng lực:
* **Năng lực mô hình hóa toán học:** 92.8% học sinh lớp 9A chuyển đổi thành công bài toán thực tế (ví dụ: tính lượng sơn phủ bồn chứa nước hình trụ, lượng cát trong đồng hồ cát hình nón) sang mô hình toán học giải quyết chính xác.
* **Năng lực sử dụng công cụ học toán:** 100% học sinh thao tác thành thạo việc thay đổi tham số $r, h$ để tự rút ra kết luận: *"Nếu giữ nguyên chiều cao $h$ và tăng bán kính đáy $r$ lên 2 lần thì thể tích khối trụ tăng lên 4 lần ($2^2$ lần)"*.
* **Đánh giá từ tổ chuyên môn Toán:** Phần mềm vận hành trơn tru không xảy ra nghẽn mạng do chạy hoàn toàn qua mạng LAN nội bộ; tiết kiệm kinh phí mua sắm thiết bị dạy học ảo bản quyền đắt tiền.
```
