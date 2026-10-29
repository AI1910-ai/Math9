# -*- coding: utf-8 -*-
"""
Module Part 4: Hệ thống 4 Thang Rubric chi tiết và 2 Kế hoạch bài dạy (KHBD 1 và KHBD 2)
"""

PART4_CONTENT = r"""## 2.4. Áp dụng phần mềm MathLab vào tổ chức hoạt động dạy học thực hành

### 2.4.0. Khung tiêu chí Rubric đánh giá Năng lực Mô hình hóa Toán học theo Thông tư 22/2021/TT-BGDĐT

Để bảo đảm việc đánh giá năng lực học sinh diễn ra khách quan, khoa học, toàn diện và đúng tinh thần quy định tại **Thông tư số 22/2021/TT-BGDĐT** của Bộ Giáo dục và Đào tạo (với 4 mức xếp loại: **Chưa đạt – Đạt – Khá – Tốt**), chúng tôi đã thiết kế hệ thống **04 Thang tiêu chí Rubric chi tiết** phục vụ cho toàn bộ các hoạt động dạy học của Chương X Toán 9:

#### Bảng 2.4.0A: Thang tiêu chí Rubric 1 – Đánh giá Năng lực Mô hình hóa Toán học (NLMHH)

| Tiêu chí thành phần | Mức 1: Chưa đạt (Dưới 5,0) | Mức 2: Đạt (5,0 – 6,4) | Mức 3: Khá (6,5 – 7,9) | Mức 4: Tốt (8,0 – 10,0) |
| :--- | :--- | :--- | :--- | :--- |
| **Tiêu chí 1: Nhận diện mô hình toán từ thực tiễn** | Không nhận diện được dạng hình khối tương ứng từ vật thể thực, hoặc nhầm lẫn giữa hình trụ, hình nón và hình cầu. | Nhận diện được dạng hình khối cơ bản nhưng còn lúng túng khi xác định các đại lượng biên ($R, h, l$). | Nhận diện chính xác hình khối; xác định đúng các yếu tố cơ bản ($R, h, l$); chỉ ra được trục quay và đáy. | Trừu tượng hóa xuất sắc; nhận diện nhanh chóng hình khối phức tạp hoặc hình khối phối hợp; xác định đầy đủ các yếu tố ẩn/hiện. |
| **Tiêu chí 2: Thiết lập mối quan hệ và công thức** | Không nhớ công thức hoặc áp dụng sai hoàn toàn công thức diện tích, thể tích khối tròn xoay. | Viết được công thức cơ bản nhưng áp dụng máy móc, nhầm lẫn giữa $l$ và $h$ ở hình nón, hoặc quên tính đáy ở vật không nắp. | Thiết lập đúng công thức toán học; biết vận dụng định lý Pythagore $l^2 = R^2 + h^2$ hoặc $r' = \\sqrt{R^2 - h_c^2}$ chuẩn xác. | Thiết lập hoàn hảo hệ thức toán học; biết lập hàm số biểu diễn mối quan hệ giữa các biến; vận dụng linh hoạt bất đẳng thức tối ưu. |
| **Tiêu chí 3: Kỹ năng tính toán và giải toán** | Tính toán sai sót nhiều, không nắm được cách làm tròn số thập phân, thế số sai vào công thức. | Tính toán được các phép tính đơn giản nhưng còn phụ thuộc máy tính cầm tay, đôi khi nhầm lẫn giữa $\\pi$ và số gần đúng. | Tính toán chính xác các đại lượng; thực hiện đúng quy tắc làm tròn số theo yêu cầu của đề bài; trình bày mạch lạc. | Tính toán cực nhanh và chính xác; biết sử dụng phương pháp tính gần đúng hợp lý; lời giải ngắn gọn, thanh thoát, khoa học. |
| **Tiêu chí 4: Phiên giải kết quả và đánh giá thực tế** | Không nêu được ý nghĩa thực tế của con số tìm được; không đổi được đơn vị đo ($cm^3$ sang lít). | Nêu được kết quả nhưng quên đổi đơn vị đo lường, chưa đánh giá được tính hợp lý của kết quả đối với vật thể thực. | Đổi đúng đơn vị đo lường thực tế (lít, $m^3$); giải thích được ý nghĩa kết quả trong ngữ cảnh bài toán đời sống. | Phiên giải xuất sắc kết quả; phân tích sâu sắc sai số do mép gấp, độ dày vật liệu; đề xuất được giải pháp cải tiến tối ưu. |

#### Bảng 2.4.0B: Thang tiêu chí Rubric 2 – Đánh giá Kỹ năng thao tác số và tư duy trực quan không gian trên MathLab

| Tiêu chí thao tác số | Mức 1: Chưa đạt | Mức 2: Đạt | Mức 3: Khá | Mức 4: Tốt |
| :--- | :--- | :--- | :--- | :--- |
| **1. Kỹ năng điều khiển góc nhìn 3D đa chiều** | Lúng túng, không biết dùng chuột xoay góc nhìn hoặc làm mất khối hình khỏi khung nhìn. | Biết xoay mô hình nhưng thao tác còn chậm, chưa nhận diện được các góc nhìn thuận lợi nhất. | Thao tác xoay, phóng to, thu nhỏ mượt mà; quan sát rõ các trục đối xứng và yếu tố khuất. | Điều khiển góc nhìn cực kỳ điêu luyện; phối hợp góc nhìn 3D để phát hiện các tính chất đối xứng và bất biến hình học. |
| **2. Tương tác thanh trượt tham số ($R, h, \\alpha$)** | Kéo thả ngẫu nhiên, không hiểu mối liên hệ giữa con số trên thanh trượt và hình ảnh biến đổi. | Biết kéo thanh trượt để thay đổi kích thước nhưng chưa chú ý quan sát sự biến thiên của diện tích, thể tích. | Kéo thanh trượt chính xác đến thông số yêu cầu của bài toán; quan sát và ghi chép kịp thời các số liệu biến đổi. | Chủ động thay đổi tham số để kiểm tra các trường hợp đặc biệt (ví dụ $h = 2R$); rút ra nhận định dự đoán quy luật toán học. |
| **3. Thao tác bóc tách và khai triển bề mặt** | Không tìm được nút chức năng bóc phẳng hoặc không hiểu hình ảnh hình chữ nhật, hình quạt mở ra. | Thực hiện được thao tác bóc phẳng nhưng còn cần sự hướng dẫn của bạn cùng nhóm hoặc GV. | Tự thao tác bóc phẳng thuần thục; chỉ ra được đâu là chu vi đáy, đâu là độ dài đường sinh trên hình phẳng. | Thao tác thành thạo; đối chiếu trực tiếp sự tương ứng 1-1 giữa các cạnh trên hình phẳng với các đường trên khối 3D. |
| **4. Khai thác Trợ lý sư phạm Socrate gợi mở** | Không biết đặt câu hỏi hoặc gõ câu hỏi cụt ngủn; chỉ chờ đợi đáp án số cuối cùng. | Đặt được câu hỏi nhưng diễn đạt chưa rõ ràng; cần 2 – 3 lần trao đổi mới hiểu gợi ý của trợ lý. | Đặt câu hỏi đúng trọng tâm khó khăn; tiếp thu tốt câu hỏi gợi mở của trợ lý để tự lực hoàn thành bài tập. | Sử dụng câu hỏi phản biện thông minh; kết hợp gợi ý từ SGK của trợ lý để giải quyết các bài toán mở rộng và nâng cao. |

#### Bảng 2.4.0C: Thang tiêu chí Rubric 3 – Đánh giá Năng lực Tự học, Giao tiếp và Hợp tác nhóm

| Tiêu chí hợp tác nhóm | Mức 1: Chưa đạt | Mức 2: Đạt | Mức 3: Khá | Mức 4: Tốt |
| :--- | :--- | :--- | :--- | :--- |
| **1. Tinh thần trách nhiệm và phân công nhiệm vụ** | Thụ động, ỷ lại vào nhóm trưởng, không tham gia thực hiện nhiệm vụ chung của nhóm. | Có nhận nhiệm vụ nhưng thực hiện còn chậm, đôi khi làm việc riêng trong giờ học. | Chủ động nhận việc và hoàn thành đúng tiến độ; phối hợp nhịp nhàng với các thành viên khác. | Gương mẫu, điều phối nhóm xuất sắc; chủ động hỗ trợ các thành viên còn lúng túng trong nhóm. |
| **2. Thảo luận và tranh biện toán học** | Im lặng, không tham gia thảo luận hoặc nói chuyện riêng không đúng chủ đề. | Tham gia thảo luận khi được hỏi nhưng ý kiến còn dè dặt, chưa có chính kiến toán học rõ ràng. | Tích cực đóng góp ý kiến; biết lắng nghe và phản biện lịch sự, có căn cứ toán học vững chắc. | Tranh biện sắc sảo, tự tin; biết tổng hợp ý kiến đa chiều để đưa ra giải pháp toán học tối ưu cho nhóm. |
| **3. Sử dụng ngôn ngữ toán học chuẩn xác** | Dùng từ ngữ đời thường tùy tiện, nhầm lẫn các thuật ngữ (gọi đường sinh là cạnh xiên, gọi thể tích là dung lượng). | Sử dụng được một số thuật ngữ cơ bản nhưng đôi khi còn nói tắt, thiếu chính xác về mặt ký hiệu toán học. | Diễn đạt bằng ngôn ngữ toán học chuẩn mực; trình bày bài làm rõ ràng, ký hiệu đúng chuẩn SGK. | Ngôn ngữ toán học mạch lạc, chính xác tuyệt đối; lập luận logic chặt chẽ; viết báo cáo nhóm khoa học, đẹp mắt. |
| **4. Tinh thần tự học và vượt khó** | Dễ bỏ cuộc khi gặp bài toán khó; không chủ động tìm kiếm thông tin trong SGK hay phần mềm. | Có nỗ lực tự học nhưng chưa bền bỉ; chỉ làm xong bài tập cơ bản là dừng lại. | Chủ động nghiên cứu SGK và tương tác với MathLab; kiên trì giải quyết các bài toán tình huống thực tiễn. | Say mê tìm tòi, tự giác khám phá các bài toán mở rộng; có thói quen tự kiểm tra và sửa lỗi sai trong bài làm. |

#### Bảng 2.4.0D: Thang tiêu chí Rubric 4 – Đánh giá Sản phẩm dự án STEAM đo đạc thực tế hình khối tròn xoay

| Tiêu chí sản phẩm STEAM | Mức 1: Chưa đạt | Mức 2: Đạt | Mức 3: Khá | Mức 4: Tốt |
| :--- | :--- | :--- | :--- | :--- |
| **1. Kỹ thuật đo đạc và độ chính xác số liệu** | Đo đạc tùy tiện, sai lệch lớn; ghi chép số liệu lộn xộn, thiếu đơn vị đo. | Biết dùng thước đo nhưng kỹ thuật đo chưa chuẩn xác (ví dụ đo đường kính bằng thước thẳng bị lệch tâm). | Thao tác đo cẩn thận; biết dùng thước dây quấn quanh đáy để đo chu vi rồi suy ra đường kính; số liệu tin cậy. | Kỹ thuật đo chuyên nghiệp; phối hợp nhiều dụng cụ đo; biết tính giá trị trung bình qua nhiều lần đo để giảm thiểu sai số. |
| **2. Bản vẽ thiết kế và mô hình toán học** | Không có bản vẽ hoặc vẽ hình cẩu thả; không thể hiện được mô hình toán học tương ứng. | Có bản vẽ phác thảo hình khối nhưng chưa đúng quy cách hình học không gian (nét đứt, nét liền lộn xộn). | Bản vẽ đẹp, chuẩn quy tắc biểu diễn hình học không gian; ghi chú đầy đủ các thông số kích thước thực tế. | Bản vẽ kỹ thuật hoàn hảo hoặc mô hình số 3D dựng trên MathLab; có chú giải chi tiết các yếu tố hình học và vật lý. |
| **3. Bản tính toán diện tích, thể tích và chi phí** | Tính toán sai công thức; không dự toán được nguyên vật liệu hoặc chi phí sản xuất. | Áp dụng đúng công thức nhưng tính toán chi phí còn sơ sài, chưa tính đến lượng vật liệu dư thừa. | Tính toán chính xác diện tích vật liệu và dung tích; dự toán chi phí sát với thực tế thị trường. | Bản tính toán chi tiết, tối ưu hóa vật liệu xuất sắc; tính toán khoa học tỉ lệ hao hụt do đường cắt và mối hàn/dán. |
| **4. Báo cáo thuyết trình sản phẩm** | Thuyết trình ngắc ngứ, đọc tài liệu; không trả lời được các câu hỏi phản biện của GV và bạn học. | Thuyết trình được các nội dung cơ bản nhưng còn thiếu tự tin; trả lời câu hỏi phản biện còn lúng túng. | Thuyết trình tự tin, rõ ràng, phân công các thành viên trình bày hợp lý; trả lời tốt các câu hỏi chất vấn. | Phong cách thuyết trình cuốn hút, chuyên nghiệp; bảo vệ quan điểm thiết kế và mô hình toán học vô cùng thuyết phục. |

---

### 2.4.1. Kế hoạch bài dạy số 1: Bài 31 – Hình trụ và hình nón (Toán 9, KNTTVCS – 02 tiết)

- **Môn học:** Toán – Khối lớp 9.
- **Thời lượng thực hiện:** 02 tiết (Tiết 1: Hình trụ; Tiết 2: Hình nón).
- **Bộ sách:** Kết nối tri thức với cuộc sống (Chương X – Bài 31).
- **Địa điểm tổ chức:** Phòng máy vi tính nhà trường (kết nối mạng LAN MathLab).

---

#### TIẾT 1: HÌNH TRỤ (SỰ TẠO THÀNH, HÌNH KHAI TRIỂN, DIỆN TÍCH XUNG QUANH VÀ THỂ TÍCH)

##### I. MỤC TIÊU BÀI DẠY

1. **Về kiến thức:**
   - Mô tả được sự tạo thành hình trụ khi quay một hình chữ nhật một vòng quanh một cạnh cố định làm trục.
   - Nhận biết và chỉ rõ được các yếu tố của hình trụ: hai đáy (hai hình tròn bằng nhau và song song), mặt xung quanh, đường sinh, chiều cao, bán kính đáy, trục của hình trụ.
   - Hiểu được hình khai triển mặt xung quanh của hình trụ là một hình chữ nhật có kích thước là chu vi đáy $2\\pi R$ và chiều cao $h$.
   - Ghi nhớ và vận dụng thành thạo công thức tính diện tích xung quanh $S_{\text{xq}} = 2\\pi R h$, diện tích toàn phần $S_{\text{tp}} = 2\\pi R h + 2\\pi R^2$, và thể tích hình trụ $V = \\pi R^2 h$.
2. **Về năng lực:**
   - *Năng lực mô hình hóa toán học:* Biết trừu tượng hóa các vật thể quen thuộc trong đời sống (lon sữa đặc, ống nước, thùng phi, cột bê tông) thành mô hình hình trụ toán học; thiết lập công thức tính diện tích vật liệu và dung tích chứa.
   - *Năng lực sử dụng công cụ, phương tiện học toán:* Thao tác thành thạo trên phần mềm MathLab: điều khiển góc xoay 3D, kéo thanh trượt góc quay để quan sát sự tạo thành hình trụ, thực hiện chức năng bóc phẳng bề mặt hình học.
   - *Năng lực giao tiếp và hợp tác toán học:* Phối hợp nhịp nhàng trong nhóm đôi, trình bày rõ ràng lập luận và bảo vệ kết quả tính toán trước tập thể.
3. **Về phẩm chất:**
   - Chăm chỉ, tích cực tham gia các hoạt động thực hành, trung thực trong đo đạc và ghi nhận số liệu vật thật.
   - Có ý thức trách nhiệm bảo vệ tài sản công cộng tại phòng máy vi tính.

##### II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU

1. **Giáo viên chuẩn bị:**
   - Máy chủ GV khởi chạy mạng LAN MathLab (`run_lan_server.bat` cổng 8000), máy chiếu Projector kết nối máy chủ.
   - Vật mẫu thực tế: 04 vỏ lon sữa đặc Ông Thọ (đã rửa sạch, giữ nguyên tem nhãn), 04 cuộn giấy bìa, kéo cắt giấy, thước cuộn, thước kẹp cơ khí.
   - Hệ thống Phiếu học tập cá nhân số 1 và Bảng Rubric 1, Rubric 2.
2. **Học sinh chuẩn bị:**
   - Mỗi bàn (nhóm 2 HS) sử dụng 01 máy trạm đã kết nối sẵn vào trang web MathLab trên mạng LAN (`http://192.168.1.xxx:8000`).
   - Thước kẻ học sinh có vạch chia milimét, máy tính cầm tay bỏ túi, bút dạ viết bảng nhóm.

##### III. TIẾN TRÌNH DẠY HỌC CHI TIẾT (TIẾT 1)

###### 1. HOẠT ĐỘNG 1: KHỞI ĐỘNG VÀ ĐẶT VẤN ĐỀ THỰC TIỄN (7 phút)

- **Mục tiêu:** Kích thích sự tò mò, tạo nhu cầu nhận thức về việc xác định diện tích vỏ kim loại và dung tích chứa của lon sữa đặc thực tế.
- **Nội dung:** GV đưa ra một vỏ lon sữa đặc Ông Thọ thật và đặt bài toán đời sống: *"Một nhà máy sản xuất sữa muốn làm 1 triệu vỏ lon hình trụ như thế này. Làm thế nào để các kỹ sư tính toán được chính xác diện tích tôn thép cần mua và lượng sữa tối đa lon có thể chứa được?"*
- **Tổ chức thực hiện:**
  - *Bước 1 (Giao nhiệm vụ):* GV phát cho mỗi nhóm bàn 01 vỏ lon sữa và thước dây. Yêu cầu HS quan sát hình dạng và dùng tay sờ, cảm nhận bề mặt lon.
  - *Bước 2 (HS thực hiện):* HS trao đổi nhanh: Đáy lon là hình tròn, thân lon cong tròn đều. Đo nhanh đường kính đáy lon ($d \\approx 7{,}4\\text{ cm} \\implies R \\approx 3{,}7\\text{ cm}$) và chiều cao lon ($h \\approx 8{,}0\\text{ cm}$).
  - *Bước 3 (Báo cáo, tranh luận):* GV hỏi: *"Mặt xung quanh của lon sữa có dạng hình gì khi bóc ra? Liệu có thể tính diện tích của nó như một hình chữ nhật hay không?"* Đa số HS trả lời băn khoăn: *"Mặt lon bị cong tròn, làm sao tính như hình chữ nhật được?"*
  - *Bước 4 (Kết luận dẫn dắt):* GV dẫn dắt: *"Để trả lời chính xác câu hỏi này và tìm ra công thức tính toán khoa học, chúng ta cùng bước vào Phòng thí nghiệm hình học ảo MathLab để khám phá Bài 31: Hình trụ."*

###### 2. HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (23 phút)

**Nội dung 1: Khám phá sự tạo thành hình trụ từ phép quay hình phẳng (8 phút)**
- GV hướng dẫn HS trên máy trạm chọn **Phân hệ 1: Mô phỏng khối tròn xoay** $\\rightarrow$ Chọn nút **"Hình trụ"**.
- GV yêu cầu HS kéo thanh trượt "Góc quay $\\alpha$" từ $0^\\circ$ đến $360^\\circ$:
  - *Quan sát hiện tượng:* Trên màn hình 3D, một hình chữ nhật $ABCD$ màu xanh bắt đầu quay liên tục quanh cạnh cố định $AB$. Cạnh đối diện $CD$ quét trong không gian tạo thành một mặt cong khép kín (mặt xung quanh). Hai cạnh kề $AD$ và $BC$ quét tạo thành hai hình tròn bằng nhau nằm trên hai mặt phẳng song song (hai đáy).
  - *Lời thoại GV – HS:*
    - GV: *"Khi cạnh CD quét trong không gian một vòng trọn vẹn, nó vạch ra mặt gì?"*
    - HS (Em An - Lớp 9A): *"Thưa thầy, cạnh CD vạch ra một mặt cong tròn đều, đó chính là mặt xung quanh của hình trụ ạ!"*
    - GV: *"Rất chính xác! Đoạn CD đó được gọi là gì của hình trụ?"*
    - HS (Em Bình): *"Dạ là đường sinh của hình trụ ạ! Độ dài đường sinh bằng đúng độ dài chiều cao AB."*
- GV chuẩn hóa định nghĩa: Khi quay hình chữ nhật $ABCD$ một vòng quanh cạnh cố định $AB$, ta được một hình trụ. $AB$ là trục, $CD$ là đường sinh, độ dài $AB$ là chiều cao $h$, $AD$ và $BC$ là bán kính đáy $R$.

**Nội dung 2: Khám phá hình khai triển và thiết lập công thức diện tích (8 phút)**
- GV yêu cầu HS chuyển sang **Phân hệ 3: Trải nghiệm hình khai triển (Net Unfolding)** và bấm nút **"Trải phẳng mặt trụ"**:
  - *Mô phỏng động:* Vỏ trụ tròn xoay từ từ mở bung sang hai bên và duỗi thẳng thành một hình chữ nhật phẳng hoàn hảo trên màn hình. Hai hình tròn đáy mở lật lên trên và xuống dưới.
  - *Dẫn dắt kiến tạo công thức:*
    - GV: *"Hình chữ nhật vừa trải phẳng có một kích thước bằng chiều cao $h$ của hình trụ. Kích thước còn lại của nó tương ứng với đường nào của hình trụ ban đầu?"*
    - HS cả lớp thảo luận nhóm đôi. Em Chi đại diện nhóm 3 phát biểu: *"Thưa thầy, chiều dài của hình chữ nhật chính là đường viền đáy của lon sữa cuộn ra, tức là chu vi của hình tròn đáy ạ!"*
    - GV: *"Tuyệt vời! Chu vi hình tròn đáy bán kính $R$ được tính bằng công thức nào ở lớp dưới?"*
    - HS: *"Dạ là $C = 2\\pi R$!"*
    - GV: *"Vậy diện tích của hình chữ nhật khai triển – tức diện tích xung quanh của hình trụ – sẽ bằng gì?"*
    - HS đồng thanh: *"Bằng dài nhân rộng, tức là $S_{\text{xq}} = 2\\pi R \\times h$!"*
- GV khen ngợi cả lớp đã tự mình tìm ra công thức diện tích xung quanh!
- GV phân tích tiếp: Diện tích toàn phần của hình trụ có nắp gồm diện tích xung quanh cộng với diện tích cả hai đáy:
  $$S_{\text{tp}} = S_{\text{xq}} + 2 S_{\text{đáy}} = 2\\pi R h + 2\\pi R^2 = 2\\pi R (h + R)$$
- GV lưu ý lỗi sai số 3: *"Nếu đề bài yêu cầu tính diện tích tôn làm thùng không có nắp (như xô nước) thì ta chỉ cộng 1 đáy: $S = 2\\pi R h + \\pi R^2$."*

**Nội dung 3: Thiết lập công thức thể tích hình trụ (7 phút)**
- GV gợi lại kiến thức lớp 7: Thể tích hình lăng trụ đứng đáy là đa giác bằng diện tích đáy nhân chiều cao: $V = S_{\text{đáy}} \\cdot h$.
- Hình trụ có thể coi như một hình lăng trụ đứng có đáy là đa giác đều vô số cạnh.
- Do đáy hình trụ là hình tròn diện tích $S_{\text{đáy}} = \\pi R^2$, nên thể tích hình trụ được tính bằng:
  $$V = \\pi R^2 h$$
- HS nhập trực tiếp bán kính $R = 3{,}7\\text{ cm}$ và $h = 8{,}0\\text{ cm}$ của lon sữa Ông Thọ vào MathLab để kiểm chứng:
  $$V = 3{,}14 \\times 3{,}7^2 \\times 8{,}0 \\approx 344\\text{ cm}^3 = 0{,}344\\text{ lít} = 344\\text{ ml}$$
  Học sinh đối chiếu với dung tích ghi trên vỏ hộp thực tế ($380\\text{ g}$ sữa đặc có khối lượng riêng $1{,}1\\text{ g/ml} \\implies V \\approx 345\\text{ ml}$). Cả lớp vô cùng hào hứng khi thấy số học toán học khớp hoàn toàn với thực tế đời sống!

###### 3. HOẠT ĐỘNG 3: LUYỆN TẬP CÓ GIÀN GIÁO HỖ TRỢ (10 phút)

- **Mục tiêu:** Vận dụng công thức giải bài tập có lời văn, rèn luyện kỹ năng tính toán và chuyển đổi đơn vị đo lường.
- **Nội dung:** Bài tập trong Phiếu học tập số 1 (Bài 1):
  > *"Một bể chứa nước sinh hoạt của một hộ gia đình tại TP. Thủ Đức có dạng hình trụ bằng inox, đường kính đáy trong là $d = 1{,}2\\text{ m}$, chiều cao là $h = 1{,}8\\text{ m}$. Bể có nắp đậy kín.*
  > *a) Tính diện tích inox cần dùng để làm chiếc bể nước trên (coi mép gấp mối hàn không đáng kể, lấy $\\pi \\approx 3{,}14$ và làm tròn kết quả đến chữ số thập phân thứ hai).*
  > *b) Bể nước này có thể chứa tối đa được bao nhiêu mét khối nước ($m^3$) và bao nhiêu lít nước?"*
- **Tổ chức thực hiện:**
  - HS làm việc cá nhân vào Phiếu học tập số 1.
  - Những học sinh gặp khó khăn trong việc xác định bán kính hoặc đổi mét khối sang lít được GV hướng dẫn mở khung chat **Trợ lý Socrate** trên MathLab.
  - *Hộp thoại sư phạm mẫu giữa HS Dũng và Trợ lý Socrate:*
    - HS Dũng gõ: *"Em tính thể tích ra 2{,}035\text{ m}^3 thì đổi ra lít thế nào?"*
    - Trợ lý Socrate phản hồi: *"Chào Dũng! Em đã tính đúng thể tích bể rồi đấy. Em hãy nhớ lại kiến thức lớp dưới trong Bài 31 SGK trang 96: $1\\text{ m}^3$ bằng bao nhiêu đề-xi-mét khối ($dm^3$)? Và $1\\text{ dm}^3$ nước chính là mấy lít nước nào?"*
    - HS Dũng gõ: *"1\text{ m}^3 = 1000 dm3, vậy bằng 1000 lít đúng không ạ?"*
    - Trợ lý Socrate: *"Chính xác! Vậy với thể tích $2{,}035\\text{ m}^3$, em hãy nhân với 1000 để tìm ra số lít nước nhé!"*
  - HS Dũng tự tin ghi đáp số vào phiếu: $2035\\text{ lít}$ nước mà không cần GV phải trực tiếp nhắc nhở.

###### 4. HOẠT ĐỘNG 4: VẬN DỤNG VÀ HƯỚNG DẪN DỰ ÁN MINI (5 phút)

- GV trình chiếu slide giao nhiệm vụ về nhà (thuộc Dự án mini vỏ lon):
  *"Các nhóm hãy thu thập một lon nước ngọt (Pepsi, Coca-Cola dung tích 330ml), đo bán kính và chiều cao, kiểm tra xem tại sao các nhà sản xuất lại chọn kích thước đó mà không làm lon thật dài hoặc thật lùn? Chúng ta sẽ giải mã bài toán kinh tế này trong tiết học tiếp theo."*
- GV nhận xét tinh thần học tập của lớp, lưu lại điểm số tương tác trên hệ thống mạng LAN.

---

#### TIẾT 2: HÌNH NÓN (SỰ TẠO THÀNH, HÌNH QUẠT KHAI TRIỂN, DIỆN TÍCH XUNG QUANH VÀ THỂ TÍCH)

##### I. MỤC TIÊU BÀI DẠY (TIẾT 2)

1. **Về kiến thức:**
   - Mô tả được sự tạo thành hình nón khi quay một hình tam giác vuông một vòng quanh một cạnh góc vuông cố định.
   - Phân biệt rõ ràng ba yếu tố hình học: bán kính đáy $R$, chiều cao $h$, và độ dài đường sinh $l$; thiết lập được mối quan hệ Pythagore: $l^2 = R^2 + h^2$.
   - Hiểu được hình khai triển mặt xung quanh của hình nón là một hình quạt tròn bán kính $l$ có độ dài cung đúng bằng chu vi đáy $2\\pi R$.
   - Vận dụng thành thạo công thức: $S_{\text{xq}} = \\pi R l$, $S_{\text{tp}} = \\pi R l + \\pi R^2$, và $V = \\frac{1}{3}\\pi R^2 h$.
2. **Về năng lực:**
   - *Năng lực mô hình hóa toán học:* Mô hình hóa được chiếc nón lá truyền thống Việt Nam, tính toán lượng lá cần may nón, tính góc quạt khai triển để cắt bìa làm nón sinh nhật.
   - *Năng lực tư duy và lập luận toán học:* Chứng minh được công thức diện tích xung quanh hình nón thông qua tỉ lệ diện tích hình quạt tròn.

##### II. TIẾN TRÌNH DẠY HỌC CHI TIẾT (TIẾT 2)

###### 1. HOẠT ĐỘNG 1: KHỞI ĐỘNG (5 phút)

- GV mang đến lớp một chiếc nón lá bài thơ xứ Huế và một chiếc mũ sinh nhật bằng giấy bìa.
- GV đặt câu hỏi: *"Các em có biết các nghệ nhân may nón lá làm thế nào để từ những chiếc lá cọ phẳng mà khâu thành một chiếc nón hình chóp nón khum khum tròn trịa không? Làm sao để tính diện tích lá tối thiểu cần dùng cho một chiếc nón có đường kính đáy 40cm và chiều cao 30cm?"*
- HS dự đoán: Cần phải biết diện tích xung quanh của chiếc nón lá. Nhưng nón lá không có nắp đáy, vậy công thức tính diện tích xung quanh của nó là gì?

###### 2. HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (25 phút)

**Nội dung 1: Khám phá sự tạo thành hình nón và mối liên hệ Pythagore (8 phút)**
- GV yêu cầu HS mở **Phân hệ 1 trên MathLab** $\\rightarrow$ Chọn nút **"Hình nón"**.
- HS kéo thanh trượt góc quay $\\alpha$ từ $0^\\circ$ đến $360^\\circ$:
  - Một tam giác vuông $SOB$ vuông tại $O$ bắt đầu quay quanh cạnh góc vuông cố định $SO$.
  - Cạnh góc vuông $OB$ quét tạo thành một hình tròn đáy bán kính $R = OB$.
  - Cạnh huyền $SB$ quét tạo thành mặt cong xung quanh của hình nón. Đỉnh $S$ là đỉnh hình nón, $SO$ là trục và chiều cao $h$, $SB$ là đường sinh $l$.
- GV nhấn mạnh khắc phục **Lỗi sai 1**:
  - *"Các em hãy nhìn tam giác vuông SOB trên màn hình: Cạnh huyền SB luôn dài hơn cạnh góc vuông SO ($l > h$). Khi tính diện tích xung quanh, ta phải dùng độ dài đường sinh $l$ chứ không được dùng chiều cao $h$!"*
  - Học sinh quan sát tam giác vuông trên MathLab và đọc to định lý Pythagore:
    $$l = \\sqrt{R^2 + h^2} \\quad \\text{hay} \\quad h = \\sqrt{l^2 - R^2}$$

**Nội dung 2: Khám phá hình quạt khai triển và công thức diện tích xung quanh (10 phút)**
- GV hướng dẫn HS chuyển sang **Phân hệ 3**, chọn nút **"Trải phẳng mặt nón"**:
  - Mặt xung quanh hình nón từ từ bung mở và trải phẳng thành một **hình quạt tròn** tâm $S$, bán kính quạt đúng bằng độ dài đường sinh $l$.
  - Cung quạt tròn có độ dài đúng bằng chu vi đường tròn đáy: $C = 2\\pi R$.
- *GV hướng dẫn HS lập luận suy diễn toán học:*
  - Cả hình tròn tâm $S$ bán kính $l$ có chu vi là $2\\pi l$ và diện tích là $\\pi l^2$.
  - Cung quạt có độ dài $2\\pi R$, do đó tỉ lệ độ dài cung trên toàn bộ chu vi hình tròn là:
    $$\\text{Tỉ lệ} = \\frac{2\\pi R}{2\\pi l} = \\frac{R}{l}$$
  - Vì diện tích hình quạt tròn tỉ lệ thuận với độ dài cung của nó, nên diện tích hình quạt (chính là diện tích xung quanh của hình nón) là:
    $$S_{\text{xq}} = \\pi l^2 \\times \\left( \\frac{R}{l} \\right) = \\pi R l$$
  - Góc ở tâm của hình quạt tròn khai triển được tính bằng:
    $$\\alpha = \\frac{R}{l} \\times 360^\\circ$$
- Học sinh reo lên thích thú vì hiểu rõ tận gốc rễ tại sao lại có công thức $S_{\text{xq}} = \\pi R l$ mà không phải học thuộc lòng một cách vô hồn!
- Diện tích toàn phần của hình nón (có đáy): $S_{\text{tp}} = S_{\text{xq}} + S_{\text{đáy}} = \\pi R l + \\pi R^2 = \\pi R (l + R)$.

**Nội dung 3: Thể tích hình nón (7 phút)**
- GV cho HS quan sát mô phỏng so sánh hình trụ và hình nón có cùng bán kính đáy $R$ và cùng chiều cao $h$:
  - Trên MathLab, nước từ hình nón đầy tràn được đổ vào hình trụ có cùng kích thước. Mực nước dâng lên đúng một phần ba ($\\\\frac{1}{3}$) chiều cao của hình trụ!
  - Thể tích hình nón bằng một phần ba thể tích hình trụ cùng đáy, cùng chiều cao:
    $$V = \\frac{1}{3} \\pi R^2 h$$

###### 3. HOẠT ĐỘNG 3: LUYỆN TẬP VÀ ĐỐI THOẠI SOCRATE (10 phút)

- **Đề bài trong Phiếu học tập số 2 (Bài toán Nón lá):**
  > *"Một chiếc nón lá có đường kính đáy là $d = 40\\text{ cm}$ (suy ra bán kính $R = 20\\text{ cm}$) và độ dài đường sinh là $l = 30\\text{ cm}$.*
  > *a) Tính diện tích lá cọ cần dùng để may chiếc nón (lấy $\\pi \\approx 3{,}14$, làm tròn đến hàng đơn vị).*
  > *b) Tính chiều cao $h$ và thể tích không khí bên trong chiếc nón lá đó."*
- **Tiến trình thực hiện:**
  - HS làm bài vào phiếu. Khi tính chiều cao $h$, HS Mai lúng túng vì đề bài không cho sẵn $h$.
  - Mai mở chat với Trợ lý Socrate: *"Làm sao tính chiều cao nón khi chỉ biết R = 20 và l = 30 ạ?"*
  - Trợ lý Socrate gợi mở: *"Chào Mai! Em hãy nhìn lại tam giác vuông $SOB$ trong Bài 31 SGK trang 98 hoặc trên mô hình MathLab: Ba đoạn thẳng $h$ (chiều cao), $R$ (bán kính đáy) và $l$ (đường sinh) tạo thành một tam giác gì? Em có thể dùng định lý toán học nổi tiếng nào để tính cạnh góc vuông khi đã biết cạnh huyền và cạnh góc vuông kia?"*
  - Mai reo lên: *"À, định lý Pythagore!"* và viết ngay vào vở:
    $$h = \\sqrt{l^2 - R^2} = \\sqrt{30^2 - 20^2} = \\sqrt{900 - 400} = \\sqrt{500} \\approx 22{,}36\\text{ cm}$$
    $$V = \\frac{1}{3} \\pi R^2 h = \\frac{1}{3} \\times 3{,}14 \\times 20^2 \\times 22{,}36 \\approx 9361\\text{ cm}^3$$

###### 4. HOẠT ĐỘNG 4: VẬN DỤNG VÀ ĐÁNH GIÁ RUBRIC (5 phút)

- GV cùng HS đánh giá chéo sản phẩm làm bài của các nhóm theo **Rubric 1 (Mô hình hóa)** và **Rubric 2 (Thao tác MathLab)**.
- Kết quả: 100% học sinh nhóm 1 và nhóm 2 đạt mức Khá và Tốt, không còn hiện tượng nhầm lẫn giữa $l$ và $h$.

---

### 2.4.2. Kế hoạch bài dạy số 2: Bài 32 – Hình cầu (Toán 9, KNTTVCS – 02 tiết)

- **Môn học:** Toán – Khối lớp 9.
- **Thời lượng:** 02 tiết (Tiết 1: Mặt cầu, hình cầu và mặt cắt bởi mặt phẳng; Tiết 2: Diện tích mặt cầu và thể tích hình cầu).
- **Bộ sách:** Kết nối tri thức với cuộc sống (Chương X – Bài 32).
- **Địa điểm:** Phòng máy vi tính trường học (kết nối mạng LAN MathLab).

---

#### TIẾT 1: MẶT CẦU, HÌNH CẦU VÀ MẶT CẮT BỞI MẶT PHẲNG

##### I. MỤC TIÊU BÀI DẠY (TIẾT 1)

1. **Về kiến thức:**
   - Mô tả được sự tạo thành mặt cầu và hình cầu khi quay nửa hình tròn quanh đường kính cố định.
   - Phân biệt rõ khái niệm **Mặt cầu** (tập hợp các điểm trong không gian cách tâm $O$ một khoảng đúng bằng $R$) và **Hình cầu** (tập hợp các điểm cách tâm $O$ một khoảng nhỏ hơn hoặc bằng $R$, bao gồm cả mặt cầu và các điểm bên trong).
   - Hiểu và xác định được mặt cắt của hình cầu khi cắt bởi mặt phẳng đi qua tâm: luôn là một **hình tròn lớn** có bán kính đúng bằng bán kính hình cầu $r = R$ và diện tích $S = \pi R^2$.
   - Nắm vững khái niệm **Bán cầu**: Mặt phẳng đi qua tâm chia khối cầu thành hai nửa bằng nhau gọi là hai bán cầu, thể tích mỗi bán cầu bằng $V_{\text{bán cầu}} = \frac{2}{3}\pi R^3$.
2. **Về năng lực:**
   - *Năng lực mô hình hóa toán học:* Giải thích được các hiện tượng địa lý thực tế (đường Xích đạo là đường tròn lớn, các đường vĩ tuyến Bắc/Nam là các đường tròn nhỏ có bán kính thu hẹp dần về hai cực).
   - *Năng lực tư duy không gian:* Khắc phục triệt để Lỗi sai số 2 về mặt cắt hình cầu.

##### II. TIẾN TRÌNH DẠY HỌC CHI TIẾT (TIẾT 1)

###### 1. HOẠT ĐỘNG 1: KHỞI ĐỘNG (6 phút)

- GV mang một Quả địa cầu mini và một quả cam hình cầu vào lớp. Dùng dao cắt một lát quả cam ở gần đỉnh (cắt ngang).
- GV cho HS quan sát lát cắt: *"Vết cắt trên quả cam có dạng hình gì? Nếu thầy cắt một lát khác đi qua đúng tâm quả cam thì vết cắt đó có gì khác so với lát cắt đầu tiên?"*
- HS nhận xét: Cả hai vết cắt đều là hình tròn, nhưng vết cắt đi qua tâm quả cam to hơn rất nhiều so với vết cắt gần đỉnh.
- GV nêu vấn đề: *"Làm thế nào để tính chính xác bán kính của vết cắt khi biết bán kính quả cầu và vị trí dao cắt? Chúng ta cùng khám phá trên MathLab."*

###### 2. HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (24 phút)

**Nội dung 1: Khám phá sự tạo thành hình cầu (8 phút)**
- HS mở **Phân hệ 1 trên MathLab** $\\rightarrow$ Chọn nút **"Hình cầu"**.
- Kéo thanh trượt góc quay từ $0^\\circ$ đến $360^\\circ$: Nửa hình tròn tâm $O$ bán kính $R$ quay quanh đường kính $AB$ tạo nên một khối cầu đặc hoàn chỉnh. Đường viền nửa đường tròn quét nên **Mặt cầu**.
- GV chuẩn hóa định nghĩa mặt cầu $S(O, R)$ và hình cầu $B(O, R)$ theo SGK Toán 9 Kết nối tri thức.

**Nội dung 2: Khám phá Cắt đôi hình cầu và cấu trúc Bán cầu trên MathLab (16 phút)**
- HS chuyển sang tab **"🔪 Cắt đôi hình cầu"** trên phân hệ Hình cầu MathLab.
- Trên màn hình xuất hiện một khối cầu bán kính $R = 10\\text{ cm}$.
- *Thao tác thí nghiệm số:*
  - HS nhấn nút **`[▶ Bổ đôi]`** hoặc kéo thanh trượt "Tiến trình cắt đôi (Bán cầu)":
    - Hai nửa bán cầu từ từ tách rời nhau dọc theo trục thẳng đứng. Nửa bán cầu trên nhấc lên, làm lộ rõ bề mặt phẳng ở giữa là một **hình tròn lớn màu cam phẳng lì** có tâm $O$ và bán kính đúng bằng bán kính hình cầu $r = R = 10\\text{ cm}$.
    - GV giải thích và chuẩn hóa: *"Khi cắt hình cầu bởi một mặt phẳng đi qua tâm, mặt phẳng đó chia hình cầu và khối cầu thành hai phần bằng nhau gọi là hai bán cầu. Mặt cắt thu được là một hình tròn lớn có bán kính đúng bằng bán kính hình cầu $R$."*
    - Bảng thông số HUD trên MathLab tự động hiển thị:
      $$S_{\\text{cắt}} = \\pi R^2 = 3{,}14 \\times 10^2 = 314\\text{ cm}^2$$
      $$V_{\\text{bán cầu}} = \\frac{2}{3}\\pi R^3 = \\frac{2}{3} \\times 3{,}14 \\times 1\,000 \\approx 2094{,}4\\text{ cm}^3$$
  - HS nhấn nút **`[↺ Khép lại]`**: Hai nửa bán cầu lập tức khép khít lại thành khối cầu hoàn chỉnh $V = \\frac{4}{3}\\pi R^3 \\approx 4188{,}8\\text{ cm}^3$, chứng minh trực quan $V_{\\text{cầu}} = 2 \\times V_{\\text{bán cầu}}$.
- Cả lớp ghi chép kiến thức trọng tâm vào vở, hào hứng và thấu hiểu sâu sắc bản chất hình học của bán cầu và mặt cắt đường tròn lớn!

###### 3. HOẠT ĐỘNG 3: LUYỆN TẬP BÀI TOÁN THỰC TIỄN (10 phút)

- **Bài toán trong Phiếu học tập số 3:**
  > *"Trái Đất của chúng ta được mô hình hóa xấp xỉ như một khối cầu có bán kính $R \\approx 6371\\text{ km}$. Thành phố Hà Nội nằm ở khoảng vĩ độ $21^\\circ\\text{Bắc}$.*
  > *a) Tính khoảng cách $h_c$ từ tâm Trái Đất đến mặt phẳng chứa vĩ tuyến $21^\\circ\\text{Bắc}$ ($h_c = R \\cdot \\sin 21^\\circ$).*
  > *b) Tính bán kính $r'$ của đường vĩ tuyến $21^\\circ\\text{Bắc}$ và độ dài (chu vi) của đường vĩ tuyến này (lấy $\\sin 21^\\circ \\approx 0{,}3584$, $\\cos 21^\\circ \\approx 0{,}9336$)."*
- HS vận dụng công thức: $r' = R \\cdot \\cos 21^\\circ = 6371 \\times 0{,}9336 \\approx 5948\\text{ km}$. Chu vi vĩ tuyến: $C = 2\\pi r' \\approx 37372\\text{ km}$ (ngắn hơn chu vi đường Xích đạo $C_0 = 2\\pi R \\approx 40030\\text{ km}$).

###### 4. HOẠT ĐỘNG 4: VẬN DỤNG (5 phút)

- GV tổng kết tiết học, yêu cầu HS về nhà chuẩn bị Tiết 2: *"Tại sao vương miện của vua Hieron lại bị Archimedes phát hiện bị pha bạc chỉ nhờ một chậu nước hình trụ? Chúng ta sẽ tái hiện thí nghiệm lịch sử này vào tiết sau."*

---

#### TIẾT 2: DIỆN TÍCH MẶT CẦU VÀ THỂ TÍCH HÌNH CẦU

##### I. MỤC TIÊU BÀI DẠY (TIẾT 2)

1. **Về kiến thức:**
   - Ghi nhớ và vận dụng chính xác công thức diện tích mặt cầu: $S = 4\\pi R^2 = \\pi d^2$.
   - Hiểu rõ bản chất hình thành công thức thể tích hình cầu: $V = \\frac{4}{3}\\pi R^3 = \\frac{1}{6}\\pi d^3$ thông qua mô phỏng thí nghiệm Archimedes và nguyên lý Cavalieri trên MathLab.
   - Phân biệt rõ thứ nguyên đơn vị ($R^2$ cho diện tích, $R^3$ cho thể tích), khắc phục dứt điểm Lỗi sai số 5.
2. **Về năng lực:**
   - *Năng lực mô hình hóa toán học:* Vận dụng tính toán dung tích bồn chứa khí hóa lỏng hình cầu, tính lượng da may quả bóng đá, tính thể tích vật liệu đúc bi thép.

##### II. TIẾN TRÌNH DẠY HỌC CHI TIẾT (TIẾT 2)

###### 1. HOẠT ĐỘNG 1: KHỞI ĐỘNG (5 phút)

- GV chiếu hình ảnh bồn chứa khí hóa lỏng LPG hình cầu tại Cảng dầu khí Thị Vải (Bà Rịa - Vũng Tàu).
- GV đặt câu hỏi: *"Tại sao trong công nghiệp hóa dầu, người ta không xây bể chứa hình hộp chữ nhật hay hình trụ mà lại chế tạo những bồn chứa khổng lồ hình cầu? Hình cầu có ưu điểm gì về diện tích bề mặt và khả năng chịu áp lực?"*
- HS bước đầu suy nghĩ: Hình cầu không có góc nhọn, phân tán lực đều, và có thể tiết kiệm vật liệu nhất.

###### 2. HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (22 phút)

**Nội dung 1: Diện tích mặt cầu (8 phút)**
- GV giới thiệu: Bằng thực nghiệm quấn sợi dây vừa khít quanh nửa mặt cầu rồi đem quấn phẳng lên một hình tròn có cùng bán kính $R$, diện tích phủ kín đúng bằng 2 lần diện tích hình tròn đáy. Do đó, toàn bộ diện tích mặt cầu gấp 4 lần diện tích hình tròn lớn:
  $$S = 4\\pi R^2 = \\pi d^2$$
- HS tính nhanh: Với quả bóng chuyền thi đấu chuẩn có đường kính $d = 21\\text{ cm} \\implies R = 10{,}5\\text{ cm}$:
  $$S = 4 \\times 3{,}14 \\times 10{,}5^2 \\approx 1385\\text{ cm}^2$$

**Nội dung 2: Khám phá công thức thể tích hình cầu qua mô phỏng thí nghiệm Archimedes (14 phút)**
- GV hướng dẫn HS mở **Phân hệ 2 trên MathLab** $\\rightarrow$ Chế độ **"Thí nghiệm thể tích Archimedes"**:
  - *Mô phỏng 1 (Thí nghiệm mực nước trong cốc trụ):*
    - Một chiếc cốc hình trụ có bán kính đáy $R$ và chiều cao đúng bằng $2R$.
    - Một quả cầu bằng kim loại bán kính $R$ nằm khít bên trong chiếc cốc đó (tiếp xúc với đáy cốc, thành cốc và miệng cốc).
    - Ban đầu, cốc được đổ đầy nước đến miệng ($h = 2R$).
    - HS bấm nút **"Nhấc quả cầu ra khỏi cốc"**:
    - Trên màn hình 3D, quả cầu từ từ được nhấc lên khỏi cốc. Mực nước trong cốc lập tức tụt xuống. Thước đo mực nước hiển thị vạch: Chiều cao cột nước còn lại trong cốc đúng bằng $\\frac{2}{3}R$, tức là bằng $\\frac{1}{3}$ chiều cao của cốc!
    - GV hỏi: *"Mực nước còn lại trong cốc chiếm bao nhiêu phần chiều cao ban đầu?"*
    - HS: *"Thưa thầy, còn lại đúng một phần ba ($\frac{1}{3}$) ạ!"*
    - GV: *"Vậy lượng nước bị quả cầu chiếm chỗ (tức thể tích quả cầu) bằng bao nhiêu phần thể tích của cốc hình trụ?"*
    - HS (Em Tuấn): *"Dạ, bằng hai phần ba ($\frac{2}{3}$) thể tích của chiếc cốc hình trụ ngoại tiếp ạ!"*
    - GV hướng dẫn HS tính toán đại số:
      $$V_{\\text{trụ}} = S_{\text{đáy}} \\times h = (\\pi R^2) \\times (2R) = 2\\pi R^3$$
      $$V_{\\text{cầu}} = \\frac{2}{3} \\times V_{\\text{trụ}} = \\frac{2}{3} \\times (2\\pi R^3) = \\frac{4}{3}\\pi R^3$$
- *Mô phỏng 2 (Chứng minh toán học bằng Nguyên lý Cavalieri):*
  - MathLab hiển thị khối cầu bên cạnh khối trụ khoét hai hình nón đối đỉnh. Khi kéo mặt cắt ở độ cao $h_c$, học sinh thấy diện tích hình tròn đỏ luôn bằng diện tích hình vành khăn xanh:
    $$S_1 = \\pi(R^2 - h_c^2) = S_2$$
  - HS hoàn toàn bị thuyết phục bởi vẻ đẹp của lập luận toán học cổ đại!

###### 3. HOẠT ĐỘNG 3: LUYỆN TẬP VÀ ĐÁNH GIÁ (11 phút)

- **Bài toán trong Phiếu học tập số 4:**
  > *"Một quả bóng bàn tiêu chuẩn thi đấu có đường kính $d = 40\\text{ mm}$ ($R = 20\\text{ mm} = 2\\text{ cm}$).*
  > *a) Tính diện tích bề mặt của quả bóng bàn đó theo $\\text{cm}^2$.*
  > *b) Tính thể tích không khí chứa trong quả bóng bàn theo $\\text{cm}^3$ (lấy $\\pi \\approx 3{,}14$, làm tròn kết quả đến chữ số thập phân thứ hai).*
  > *c) Một hộp nhựa hình trụ có thể chứa vừa khít 3 quả bóng bàn xếp chồng lên nhau theo chiều thẳng đứng. Tính tỉ số phần trăm giữa tổng thể tích của 3 quả bóng bàn và thể tích của chiếc hộp hình trụ."*
- **Hướng dẫn giải câu c:**
  - Bán kính đáy hộp hình trụ: $R = 2\\text{ cm}$. Chiều cao hộp trụ: $h = 3 \\times d = 3 \\times 4 = 12\\text{ cm}$.
  - Thể tích hộp trụ: $V_{\\text{hộp}} = \\pi R^2 h = \\pi \\times 2^2 \\times 12 = 48\\pi\\text{ cm}^3$.
  - Tổng thể tích 3 quả bóng: $V_{\\text{bóng}} = 3 \\times \\left( \\frac{4}{3}\\pi R^3 \\right) = 4\\pi \\times 2^3 = 32\\pi\\text{ cm}^3$.
  - Tỉ số phần trăm:
    $$T = \\frac{V_{\\text{bóng}}}{V_{\\text{hộp}}} = \\frac{32\\pi}{48\\pi} = \\frac{2}{3} \\approx 66{,}67\\%$$
  - Học sinh nhận ra một kết quả toán học vô cùng kỳ diệu: Bất kể kích thước quả bóng là bao nhiêu, 3 quả bóng nằm vừa khít trong hộp trụ luôn chiếm đúng $\\frac{2}{3}$ (khoảng 66,67%) thể tích chiếc hộp!

###### 4. HOẠT ĐỘNG 4: VẬN DỤNG & DỰ ÁN STEAM LIÊN MÔN (7 phút)

- GV giao nhiệm vụ dự án STEAM nhóm (hoàn thành trong 1 tuần):
  *"Thiết kế mô hình vỏ hộp đựng 3 quả bóng tennis tiêu chuẩn thi đấu ITF. Lập bảng dự toán chi phí nhựa sản xuất hộp và phân tích khoảng không lãng phí."*
- HS nhận Phiếu hoạt động nhóm số 1 và tiêu chí chấm điểm theo **Rubric 4 (Sản phẩm STEAM)**.
"""
