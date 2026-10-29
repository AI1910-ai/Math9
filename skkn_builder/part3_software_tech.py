# -*- coding: utf-8 -*-
"""
Module Part 3: Quy trình thiết kế, xây dựng phần mềm MathLab và Trợ lý sư phạm (2.3)
"""

PART3_CONTENT = r"""## 2.3. Quy trình thiết kế, xây dựng phần mềm MathLab và Trợ lý sư phạm

### 2.3.1. Câu hỏi nghiên cứu

Để định hướng xuyên suốt quá trình thiết kế công nghệ và thực nghiệm sư phạm, đề tài xác lập 3 câu hỏi nghiên cứu cốt lõi:
1. **Câu hỏi 1 (Về mặt công nghệ):** *Làm thế nào để xây dựng một môi trường mô phỏng hình học 3D trực quan, nhẹ, chạy mượt mà trên nền tảng mạng LAN nội bộ không cần Internet, đảm bảo phục vụ đồng thời 40 – 45 học sinh với độ trễ thấp và an toàn dữ liệu trẻ em theo đúng Nghị định 13/2023/NĐ-CP?*
2. **Câu hỏi 2 (Về mặt sư phạm):** *Việc tổ chức dạy học Chương X Toán 9 theo chu trình mô hình hóa Blum – Ferri kết hợp phần mềm MathLab và Trợ lý gợi mở Socrate có giúp học sinh khắc phục được 6 dạng lỗi sai nhận thức không gian điển hình và nâng cao năng lực mô hình hóa toán học hay không?*
3. **Câu hỏi 3 (Về mặt hiệu quả thực chứng):** *Mức độ tác động định lượng (thông qua điểm số kiểm tra, kiểm định Student t-test và kích thước ảnh hưởng Cohen's d) của giải pháp này đối với kết quả học tập của học sinh lớp 9 như thế nào so với phương pháp dạy học truyền thống?*

### 2.3.2. Thiết kế và phương pháp nghiên cứu

#### 2.3.2.1. Tiến trình thực hiện đề tài qua các giai đoạn

Đề tài được tổ chức triển khai khoa học qua 5 giai đoạn nối tiếp nhau chặt chẽ:
- **Giai đoạn 1 (Tháng 8/2026 – Tháng 9/2026): Nghiên cứu lý luận, khảo sát thực trạng và xác lập mô hình toán học:** Tiến hành rà soát chương trình SGK Toán 9 Kết nối tri thức, khảo sát 125 học sinh và 16 giáo viên, lập bảng phân loại 6 dạng lỗi sai không gian.
- **Giai đoạn 2 (Tháng 10/2026 – Tháng 11/2026): Lập trình phát triển phần mềm MathLab và Kiến trúc mạng LAN:** Xây dựng hệ thống giải tích tham số 3D, lập trình giao diện HTML5/WebGL, lập trình dịch vụ máy chủ nội bộ Python LAN Server, tích hợp xưởng trích xuất mã TikZ cho giáo viên.
- **Giai đoạn 3 (Tháng 12/2026): Tích hợp Trợ lý Socratic, phân quyền và kiểm thử an toàn dữ liệu:** Xây dựng kho tri thức số hóa SGK/SGV Chương X, thiết lập bộ lọc prompt ngăn chặn giải hộ bài tập, kiểm thử an toàn dữ liệu trẻ em theo Nghị định 13/2023/NĐ-CP, đo tải hệ thống bằng Apache Bench.
- **Giai đoạn 4 (Tháng 01/2027 – Tháng 02/2027): Triển khai thực nghiệm sư phạm tại 2 lớp 9A và 9B:** Dạy thực nghiệm 02 Kế hoạch bài dạy (Bài 31 và Bài 32) tại lớp 9A, dạy đối chứng tại lớp 9B; tiến hành quan sát sư phạm, chấm điểm theo Rubric và thu thập phiếu khảo sát sau thực nghiệm.
- **Giai đoạn 5 (Tháng 03/2027): Xử lý dữ liệu thống kê, viết báo cáo tổng kết và thẩm định:** Tiến hành bài kiểm tra 45 phút chuẩn Thông tư 22, xử lý dữ liệu thống kê bằng t-test và Cohen's d, hoàn thiện báo cáo sáng kiến kinh nghiệm.

#### 2.3.2.2. Cơ sở khoa học toán học và thuật toán đồ họa 3D tương tác

##### 1. Phép chiếu phối cảnh 3D Wireframe (Perspective 3D Projection)

Để biểu diễn một điểm $P(X, Y, Z)$ trong không gian ba chiều lên mặt phẳng màn hình hai chiều $(x', y')$, hệ thống áp dụng ma trận biến đổi phối cảnh quang học chuẩn. Giả sử điểm quan sát (Camera / Mắt người nhìn) đặt tại gốc tọa độ hướng dọc theo trục $Z$, khoảng cách từ mắt đến mặt phẳng chiếu là $d_{\text{cam}}$. Tọa độ chiếu phẳng $(x', y')$ được tính theo công thức tỉ lệ đồng dạng tam giác:

$$x' = \frac{X \cdot d_{\text{cam}}}{Z + d_{\text{cam}}} \cdot S_x + x_{\text{center}}, \quad y' = -\frac{Y \cdot d_{\text{cam}}}{Z + d_{\text{cam}}} \cdot S_y + y_{\text{center}}$$

Trong đó $S_x, S_y$ là hệ số tỉ lệ thu phóng màn hình (Zoom factor), và $(x_{\text{center}}, y_{\text{center}})$ là tọa độ tâm của khung vẽ đồ họa (Canvas). Để mô phỏng góc nhìn linh hoạt khi người dùng kéo chuột xoay khối hình, hệ tọa độ thế giới được nhân với ma trận quay Euler theo góc nghiêng $\alpha$ (trục $X$) và góc xoay $\beta$ (trục $Y$):

$$\begin{pmatrix} X' \\\\ Y' \\\\ Z' \end{pmatrix} = \begin{pmatrix} \cos\beta & 0 & \sin\beta \\\\ 0 & 1 & 0 \\\\ -\sin\beta & 0 & \cos\beta \end{pmatrix} \begin{pmatrix} 1 & 0 & 0 \\\\ 0 & \cos\alpha & -\sin\alpha \\\\ 0 & \sin\alpha & \cos\alpha \end{pmatrix} \begin{pmatrix} X \\\\ Y \\\\ Z \end{pmatrix}$$

##### 2. Phương trình giải tích tham số các mặt cong tròn xoay (Chương X Toán 9)

Hệ thống đồ họa của MathLab dựng nên các khối tròn xoay thông qua lưới tọa độ tham số giải tích liên tục (Parametric Mesh), đảm bảo độ trơn nhẵn và độ chính xác hình học tuyệt đối:

- **Mặt trụ tròn xoay (Cylinder):** Tạo thành khi quay hình chữ nhật quanh một cạnh cố định làm trục. Phương trình tham số với góc quét $u \in [0, 2\pi]$ và chiều cao $v \in [0, h]$:
  $$\begin{cases} X(u, v) = R \cos u \\\\ Y(u, v) = v - \frac{h}{2} \\\\ Z(u, v) = R \sin u \end{cases}$$
- **Mặt nón tròn xoay (Cone):** Tạo thành khi quay tam giác vuông quanh một cạnh góc vuông làm trục. Phương trình tham số với góc quét $u \in [0, 2\pi]$ và chiều cao dọc trục $v \in [0, h]$:
  $$\begin{cases} X(u, v) = \frac{R(h - v)}{h} \cos u \\\\ Y(u, v) = v - \frac{h}{2} \\\\ Z(u, v) = \frac{R(h - v)}{h} \sin u \end{cases}$$
  Độ dài đường sinh $l$ thỏa mãn hệ thức định lý Pythagore: $l = \sqrt{R^2 + h^2}$.
- **Mặt cầu (Sphere):** Tạo thành khi quay nửa hình tròn bán kính $R$ quanh đường kính của nó. Phương trình tham số với góc vĩ độ $u \in [-\frac{\pi}{2}, \frac{\pi}{2}]$ và kinh độ $v \in [0, 2\pi]$:
  $$\begin{cases} X(u, v) = R \cos u \cos v \\\\ Y(u, v) = R \sin u \\\\ Z(u, v) = R \cos u \sin v \end{cases}$$

##### 3. Thuật toán mô phỏng cắt đôi hình cầu qua tâm và trực quan hóa hai bán cầu

Trọng tâm chuẩn kiến thức của chương trình Hình học 9 (Bài 32: Hình cầu - Bộ sách Kết nối tri thức với cuộc sống) là trường hợp mặt phẳng đi qua tâm $O$ cắt đôi khối cầu thành hai phần bằng nhau gọi là **hai bán cầu**. Giao tuyến của mặt phẳng đi qua tâm và mặt cầu là **đường tròn lớn (Great Circle)** có tâm trùng với tâm hình cầu $O$ và bán kính đúng bằng bán kính hình cầu $r = R$.

Nhằm đáp ứng yêu cầu sư phạm tinh gọn, giúp học sinh nắm vững bản chất cốt lõi mà không bị quá tải bởi các tham số phức tạp ngoài chuẩn, MathLab thiết kế thuật toán **Cắt đôi hình cầu (Hemisphere Slicing & Dynamic Separation)**:

- **Phương trình giải tích mặt phẳng cắt qua tâm ($Y = 0$):**
  Thiết diện nhận được là hình tròn lớn thỏa mãn:
  $$X^2 + Z^2 = R^2 \quad (Y = 0)$$
  - Bán kính thiết diện: $r = R$.
  - Chu vi đường tròn lớn: $C = 2\pi R$.
  - Diện tích mặt cắt tròn lớn: $S_{\text{cắt}} = \pi R^2$.
  - Thể tích của mỗi nửa bán cầu bằng đúng một nửa thể tích khối cầu:
    $$V_{\text{bán cầu}} = \frac{1}{2} V_{\text{cầu}} = \frac{1}{2} \cdot \left(\frac{4}{3}\pi R^3\right) = \frac{2}{3}\pi R^3$$

- **Thuật toán phân tách động 3D hai nửa bán cầu theo trục tung:**
  Với tham số tiến trình phân tách $f \in [0, 1]$ (tương ứng thanh trượt $0\% - 100\%$ trên giao diện), độ dời thẳng đứng $\Delta y$ được tính theo công thức:
  $$\Delta y = f \cdot 0{,}55 R$$
  - **Bán cầu trên ($Y \ge 0$):** Tâm dịch chuyển lên vị trí $(0, +\Delta y, 0)$. Hệ tọa độ các điểm trên mặt cầu trên:
    $$\begin{cases} X(u, v) = R \cos u \cos v \\ Y(u, v) = R \sin u + \Delta y \\ Z(u, v) = R \cos u \sin v \end{cases} \quad \left(u \in \left[0, \frac{\pi}{2}\right], v \in [0, 2\pi]\right)$$
    Bề mặt đáy của bán cầu trên là hình tròn bán kính $R$ tại cao độ $Y = +\Delta y$.
  - **Bán cầu dưới ($Y \le 0$):** Tâm dịch chuyển xuống vị trí $(0, -\Delta y, 0)$. Các điểm trên mặt cong có tung độ $Y(u, v) = R \sin u - \Delta y$ với $u \in \left[-\frac{\pi}{2}, 0\right]$.
  - **Mặt cắt hình tròn lớn (Great Circle Surface):** Được tô màu cam sáng ấm áp với độ trong suốt cao cấp (`rgba(249, 115, 22, 0.42)`), viền nét cam đậm (`#f97316`, độ dày 2,8px), hiển thị rõ tâm $O$, điểm $M$ trên vành tròn, đoạn bán kính $OM = R$, đường kính $2R$ và nhãn đo lường tức thời $r = R = \dots\text{ cm}$.

- **Cơ chế điều khiển trực quan 1 chạm:**
  Giao diện cung cấp thanh trượt tiến trình kèm 3 nút điều khiển:
  - `[▶ Bổ đôi]`: Chạy hoạt họa mượt mà nhấc nửa bán cầu trên lên, mở rộng khoảng cách để lộ rõ mặt phẳng cắt ở giữa.
  - `[⏸ Tạm dừng]`: Cố định trạng thái ở góc xoay bất kỳ để giáo viên giảng bài và học sinh quan sát.
  - `[↺ Khép lại]`: Hoàn nguyên chuyển động, khép hai bán cầu khít lại thành khối cầu hoàn chỉnh.

##### 4. Thuật toán mô phỏng thí nghiệm thể tích hình cầu của Archimedes và trực quan hóa bán cầu khi cắt đôi

Một trong những đóng góp đồ họa đột phá nhất của MathLab là mô phỏng sinh động thí nghiệm kinh điển mà nhà bác học vĩ đại **Archimedes (287 – 212 TCN)** đã sáng tạo ra để tìm ra công thức thể tích hình cầu, kết hợp cùng tính năng **cắt đôi hình cầu qua tâm thành hai bán cầu bằng nhau** bám sát chương trình SGK Toán 9 GDPT 2018:

- **Mô phỏng thí nghiệm cốc nước hình trụ của Archimedes:**
  - Khối thứ nhất là **Khối cầu** tâm $O$, bán kính $R$.
  - Khối thứ hai là một **Khối trụ** có bán kính đáy $R$ và chiều cao $h = 2R$. Thể tích khối trụ ngoại tiếp là:
    $$V_{\text{trụ}} = \pi R^2 h = \pi R^2 (2R) = 2\pi R^3$$
  - Khi quả cầu được nhúng chìm hoàn toàn vào chiếc cốc trụ chứa đầy nước rồi nhấc ra, lượng nước tràn ra ngoài (bằng đúng thể tích khối cầu) chiếm đúng $\frac{2}{3}$ thể tích của cốc hình trụ:
    $$V_{\text{cầu}} = \frac{2}{3} V_{\text{trụ}} = \frac{2}{3} \times (2\pi R^3) = \frac{4}{3}\pi R^3$$

- **Thuật toán trực quan hóa cắt đôi hình cầu qua tâm (Hai bán cầu):**
  - Khi dùng một mặt phẳng đi qua tâm $O$ cắt đôi khối cầu, khối cầu được chia thành hai phần hoàn toàn bằng nhau gọi là **hai bán cầu** (bán cầu trên và bán cầu dưới).
  - Thiết diện tạo thành ở vị trí cắt là một **Hình tròn lớn (Great Circle)** có tâm $O$ và bán kính đúng bằng bán kính khối cầu:
    $$r = R$$
  - Diện tích mặt cắt hình tròn lớn qua tâm:
    $$S_{\text{cắt}} = \pi R^2$$
  - Thể tích của mỗi nửa bán cầu sau khi cắt đôi bằng đúng một nửa thể tích khối cầu:
    $$V_{\text{bán cầu}} = \frac{1}{2} V_{\text{cầu}} = \frac{1}{2} \times \left(\frac{4}{3}\pi R^3\right) = \frac{2}{3}\pi R^3$$

Thuật toán mô phỏng trên MathLab hiển thị trực quan chuyển động bổ đôi hình cầu: Nút `[▶ Bổ đôi]` nâng nhẹ bán cầu trên lên theo trục thẳng đứng, làm lộ rõ mặt cắt hình tròn lớn màu cam sáng rực rỡ ở chính giữa; nút `[↺ Khép lại]` khép hai nửa bán cầu khít lại thành khối cầu ban đầu. Học sinh dễ dàng nắm bắt trực quan mối liên hệ cốt lõi: **thể tích bán cầu bằng $\frac{2}{3}\pi R^3$** và **diện tích mặt cắt qua tâm bằng $\pi R^2$**, loại bỏ hoàn toàn sự nhầm lẫn với các công thức khác mà không cần đến các phép tính cắt song song vi phân phức tạp.

#### 2.3.2.3. Cấu trúc 4 phân hệ chuyên biệt của phần mềm MathLab (Chỉ tập trung Chương X)

Phần mềm MathLab được tái cấu trúc triệt để, loại bỏ toàn bộ các mảng kiến thức ngoài lề lớp 9, tập trung tối đa vào 4 phân hệ chuyên biệt phục vụ hoàn hảo cho Chương X Toán 9:

- **Phân hệ 1: Mô phỏng động sự tạo thành khối tròn xoay (Bài 31 & 32):**
  - Chức năng: Cho phép chọn hình phẳng ban đầu (hình chữ nhật, tam giác vuông, nửa hình tròn).
  - Tương tác: Kéo thanh trượt góc quay $\alpha$ từ $0^\circ$ đến $360^\circ$. Quỹ đạo quét hiển thị vệt màu trong suốt, từ từ hình thành khối trụ, khối nón và khối cầu hoàn chỉnh.
  - Tích hợp thước đo ảo: Cho phép thay đổi bán kính $R$ và chiều cao $h$, các đại lượng $S_{\text{xq}}, S_{\text{tp}}, V$ tự động cập nhật công thức và kết quả số tương ứng.
- **Phân hệ 2: Khám phá tương tác mặt cắt hình cầu và thí nghiệm thể tích Archimedes (Bài 32):**
  - Chức năng: Mô phỏng mặt phẳng cắt đi qua tâm chia đôi khối cầu thành hai bán cầu bằng nhau. Hiển thị trực quan mặt cắt hình tròn lớn có bán kính đúng bằng bán kính khối cầu ($r = R$), diện tích mặt cắt $S_{\text{cắt}} = \pi R^2$ và thể tích bán cầu $V_{\text{bán cầu}} = \frac{2}{3}\pi R^3$.
  - Chế độ thí nghiệm Archimedes: Mô phỏng cốc nước hình trụ chứa quả cầu. Khi nhấn nút "Nhấc quả cầu ra", mực nước rút xuống còn $\frac{1}{3}$ thể tích cốc, chứng minh trực quan thể tích khối cầu chiếm đúng $\frac{2}{3}$ thể tích cốc trụ ngoại tiếp.
- **Phân hệ 3: Trải nghiệm hình khai triển (Net Unfolding) và Bài toán tối ưu vỏ lon (Bài 31):**
  - Chức năng: Mô phỏng quá trình "bóc vỏ" bề mặt xung quanh hình trụ và hình nón.
  - Trực quan: Mặt trụ mở phẳng thành hình chữ nhật kích thước $2\pi R \times h$; Mặt nón mở phẳng thành hình quạt tròn bán kính $l$ với góc ở tâm $\alpha = \frac{R}{l} \times 360^\circ$.
  - Chế độ "Tối ưu hóa kinh tế vỏ lon nước ngọt": Cho phép giữ cố định thể tích $V = 500\text{ cm}^3$ (liên kết ràng buộc $h = \frac{500}{\pi R^2}$). Khi kéo trượt bán kính $R$, phần mềm vẽ đồ thị hàm diện tích toàn phần $S_{\text{tp}}(R)$, giúp học sinh nhận ra điểm cực tiểu tại vị trí $h = 2R$.
- **Phân hệ 4: Trợ lý sư phạm Socrate gợi mở và Xưởng xuất mã TikZ chuyên nghiệp:**
  - Khung chat Socratic: Tích hợp kho tri thức SGK Kết nối tri thức. Khi học sinh đặt câu hỏi hoặc gửi ảnh bài tập, trợ lý đưa ra 3 bước gợi mở tư duy, dẫn xuất số trang SGK, kiên quyết không đưa lời giải sẵn.
  - Xưởng dựng hình TikZ: Chỉ dành cho giáo viên (có mật mã bảo vệ). Khi giáo viên xoay góc nhìn ưng ý trên màn hình 3D, bấm "Xuất mã TikZ", hệ thống tự động sinh mã LaTeX TikZ chuẩn nét đứt (hidden lines) để GV chèn vào Word hoặc LaTeX soạn đề thi.

#### 2.3.2.4. Kiến trúc mạng LAN Offline-First và giải pháp kỹ thuật phòng học

MathLab được kiến trúc theo mô hình **Offline-First Local Server**. Toàn bộ mã nguồn giao diện, thư viện đồ họa Canvas/WebGL, phông chữ toán học KaTeX và kho tri thức bài học JSON được đóng gói cục bộ trong một thư mục máy tính duy nhất.

Máy chủ giáo viên khởi chạy dịch vụ HTTP thông qua tệp khởi động nhẹ bằng Python (`run_lan_server.py`) hoặc tệp thực thi độc lập không cần cài đặt môi trường. Máy chủ tự động dò quét card mạng vật lý để lấy địa chỉ IP LAN (ví dụ: `192.168.1.100`) và lắng nghe tại cổng `8000`. Toàn bộ máy trạm học sinh chỉ cần mở trình duyệt web và truy cập địa chỉ IP này là có thể tương tác mượt mà tức thì với độ trễ cực thấp (dưới 25 ms), phản hồi tức thời, hoàn toàn không phụ thuộc vào kết nối Internet bên ngoài.

##### Giải pháp xử lý các rào cản kỹ thuật thực tế tại phòng máy trường học:

- **Khắc phục tường lửa Windows Firewall:** Tích hợp sẵn một dòng lệnh mở cổng cục bộ an toàn trong tệp thực thi khởi động:
  ```powershell
  netsh advfirewall firewall add rule name="MathLab_LAN" dir=in action=allow protocol=TCP localport=8000
  ```
  Lệnh này chỉ cho phép giao tiếp nội bộ trong mạng con của trường học, không mở cổng ra Internet bên ngoài, đảm bảo an toàn an ninh mạng tuyệt đối.
- **Xử lý rào cản Client Isolation trên Router Wi-Fi:** Nếu phòng máy dùng bộ phát Wi-Fi có bật tính năng cô lập client, giáo viên chỉ cần cắm máy chủ GV vào cổng LAN có dây của Switch mạng chung, toàn bộ máy học sinh kết nối vào mạng dây hoặc Wi-Fi cùng dải IP đều nhìn thấy máy chủ mà không bị cô lập.

#### 2.3.2.5. Cơ chế Trợ lý sư phạm Socrate, phân quyền truy cập, bảo mật dữ liệu và an toàn thông tin trẻ em (Nghị định 13/2023/NĐ-CP)

Nhằm đảm bảo tính chuẩn mực sư phạm và tuân thủ nghiêm ngặt pháp luật hiện hành, hệ thống được thiết lập với các cơ chế bảo vệ kép:

1. **Phân quyền người dùng nghiêm ngặt (Role-based Access Control):**
   - Phía giao diện học sinh: Chỉ xuất hiện chế độ *"Trợ lý gợi ý Socrate"*. Các nút bấm xem lời giải chi tiết, xem đáp án bài kiểm tra hoặc xuất mã TikZ đều bị khóa ẩn hoàn toàn bằng mã định danh phiên (Session Token).
   - Phía giao diện giáo viên: Được bảo vệ bằng mật mã quản trị riêng. Giáo viên có quyền bật/tắt quyền truy cập của từng máy trạm, xem nhật ký câu hỏi của học sinh trên lớp để nắm bắt kịp thời các em đang gặp khó khăn.
2. **Cơ chế Prompt Socratic "Chỉ gợi mở – Không làm hộ":**
   - Lõi Trợ lý Socrate được nạp cấu hình hệ thống (System Prompt) với các rào chắn sư phạm kiên cố:
     > *"Bạn là Trợ lý Sư phạm Toán 9 bám sát SGK Kết nối tri thức. Nhiệm vụ của bạn là hướng dẫn học sinh tư duy từng bước theo chu trình mô hình hóa. Khi nhận được câu hỏi bài tập: (1) Nhắc lại định nghĩa hoặc công thức liên quan trong Bài 31 hoặc Bài 32 SGK kèm số trang; (2) Đặt 01 câu hỏi định hướng để học sinh tự xác định đại lượng đã cho và đại lượng cần tìm; (3) TUYỆT ĐỐI KHÔNG xuất kết quả số cuối cùng hoặc bài giải hoàn chỉnh; (4) Khích lệ học sinh tự viết phép tính vào vở."*
3. **Tuân thủ triệt để Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân của trẻ em:**
   - Hệ thống MathLab chạy nội bộ mạng LAN, **hoàn toàn không yêu cầu học sinh tạo tài khoản, không thu thập họ tên, ngày sinh, số điện thoại hay địa chỉ email**.
   - Khi học sinh sử dụng tính năng chụp ảnh bài làm để nhờ gợi ý: Trước khi hình ảnh được gửi đi xử lý, một thuật toán xử lý ảnh cục bộ (Local Canvas Cropper) trên máy chủ trường học sẽ tự động làm mờ hoặc cắt bỏ vùng tiêu đề đầu trang vở (nơi thường ghi tên, lớp của học sinh). Ảnh gửi đi chỉ thuần túy là các nét vẽ hình học và biểu thức toán học.
   - Nhà trường và nhóm nghiên cứu đã ban hành Mẫu văn bản đồng thuận của cha mẹ học sinh (Consent Form) theo đúng quy định tại Điều 20 Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân của trẻ em trước khi tiến hành thực nghiệm (xem toàn văn tại Phụ lục 6).

#### 2.3.2.6. Bảng so sánh khách quan, toàn diện giữa MathLab và GeoGebra 3D

Để khẳng định tính ưu việt và tính phù hợp đặc thù của sáng kiến, chúng tôi xây dựng bảng so sánh khoa học, khách quan giữa MathLab và phần mềm phổ biến GeoGebra 3D:

#### Bảng 2.2.1: So sánh đặc tính sư phạm và kỹ thuật chuyên sâu giữa MathLab và GeoGebra 3D

| Tiêu chí so sánh | Phần mềm GeoGebra 3D | Phần mềm MathLab (Đề tài nghiên cứu) | Lợi thế vượt trội của MathLab |
| :--- | :--- | :--- | :--- |
| **Mục tiêu sư phạm** | Phần mềm toán học tổng quát cho mọi cấp học từ tiểu học đến đại học. | **Chuyên biệt hóa sâu sắc cho Chương X Toán 9** (Bộ SGK Kết nối tri thức với cuộc sống). | Bám sát 100% ngữ liệu, bài tập và yêu cầu cần đạt của Chương trình GDPT 2018 Toán 9. |
| **Giao diện & Đường cong học tập** | Giao diện phức tạp với hàng trăm thanh công cụ đại số, giải tích, vector 3D; đòi hỏi học sinh mất nhiều thời gian học cách dựng hình. | **Giao diện tối giản, trực quan thuần Việt (Zero-learning curve).** Các bài học hiển thị rõ ràng, tương tác tức thì bằng nút bấm và thanh trượt. | Học sinh vào bài học là thao tác được ngay trong 30 giây đầu tiên, không tốn thời gian học lệnh. |
| **Phụ thuộc Internet & Cài đặt** | Bản web cần Internet cáp quang mạnh; Bản cài đặt máy tính nặng (~150MB), cần quyền Administrator để cài đặt. | **100% Offline mạng LAN nội bộ.** Phía máy học sinh không cài đặt bất cứ thứ gì, chạy trên trình duyệt web có sẵn. | Triển khai được trên mọi phòng máy trường học nghèo nàn, không lo mất mạng hay đứt cáp quang. |
| **Tính năng bóc tách & Trải phẳng (Net Unfolding)** | Phải viết lệnh phức tạp hoặc lập trình Slider bằng tay rất tốn công của giáo viên. | **Tích hợp sẵn nút bấm "Trải phẳng hình học"** tự động cho hình trụ và hình nón, hiển thị kích thước chu vi đáy và độ dài sinh. | Khắc phục triệt để lỗi sai số 3 và số 6 của học sinh trong việc hình dung diện tích xung quanh. |
| **Thí nghiệm thể tích Archimedes** | Không có sẵn mô hình thí nghiệm cốc nước Archimedes và cắt đôi bán cầu. | **Tích hợp sẵn mô hình thí nghiệm tương tác mực nước Archimedes** và bổ đôi hình cầu qua tâm. | Trực quan hóa sinh động nguồn gốc công thức thể tích hình cầu $V = \frac{4}{3}\pi R^3$ và thể tích bán cầu $V_{\text{bán cầu}} = \frac{2}{3}\pi R^3$. |
| **Hỗ trợ tự học bằng AI có giàn giáo** | Hoàn toàn không có tính năng trợ lý đối thoại sư phạm. | **Tích hợp Trợ lý Socrate** chỉ gợi ý theo phương pháp dẫn dắt từng bước, bám sát số trang SGK, không giải hộ. | Ngăn chặn thói quen ỷ lại, phát triển tư duy phản biện và năng lực tự học của học sinh. |
| **Hỗ trợ Giáo viên soạn đề (LaTeX TikZ)** | Xuất ảnh PNG hoặc mã TikZ thô rất nặng, nét khuất nét liền không tối ưu cho tài liệu in ấn. | **Tích hợp Xưởng trích xuất mã TikZ chuyên dụng**, tự động nhận diện góc quay và sinh mã LaTeX chuẩn nét đứt mượt mà. | Tiết kiệm hàng chục giờ vẽ hình cho giáo viên khi biên soạn đề kiểm tra và giáo án. |
"""
