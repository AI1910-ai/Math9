#!/usr/bin/env python3
import http.server
import os
import socket
import socketserver
import webbrowser
import json
import re
import urllib.request
import urllib.error
import sys
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

PORT = 8000
ROOT = Path(__file__).resolve().parent / "dist"


def load_local_env():
    env_file = Path(__file__).resolve().parent / ".env"
    if not env_file.exists():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_local_env()


def local_ip():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.connect(("8.8.8.8", 80))
        return sock.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        sock.close()


class ReusableServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


def retrieve(question, limit=4):
    path = ROOT / "knowledge-base.json"
    if not path.exists():
        return []
    items = json.loads(path.read_text(encoding="utf-8"))
    terms = set(re.findall(r"[a-zA-ZÀ-ỹ0-9]+", question.lower()))
    scored = []
    for item in items:
        hay = (item.get("title", "") + " " + item.get("content", "") + " " + item.get("lesson", "")).lower()
        score = sum(2 if term in item.get("title", "").lower() else 1 for term in terms if len(term) > 2 and term in hay)
        if item.get("lesson", "").lower() in question.lower():
            score += 8
        if score:
            scored.append((score, item))
    scored.sort(key=lambda x: x[0], reverse=True)
    if not scored:
        # Return default prominent topics if query is generic or from an image
        return items[:limit]
    threshold = max(2, scored[0][0] * 0.5)
    return [item for score, item in scored if score >= threshold][:limit]


def call_gemini_api(payload_dict: dict, api_key_input: str) -> tuple[dict, str]:
    import subprocess
    import time

    keys = [k.strip() for k in api_key_input.replace(";", ",").split(",") if k.strip()]
    if not keys:
        return {"error": {"message": "Chưa cung cấp GEMINI_API_KEY."}}, ""

    # Priority list of models supporting Vietnamese Math & Vision
    candidate_models = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-flash-latest",
        "gemini-3.8-flash",
        "gemini-3.1-flash-lite",
        "gemini-3.6-flash"
    ]

    payload_str = json.dumps(payload_dict, ensure_ascii=False)
    last_error = ""

    for key in keys:
        for model in candidate_models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
            try:
                cmd = ["curl.exe", "-s", "-X", "POST", url, "-H", "Content-Type: application/json", "-d", "@-"]
                proc = subprocess.run(cmd, input=payload_str, text=True, capture_output=True, encoding="utf-8", timeout=85)
                
                if proc.returncode == 0 and proc.stdout.strip():
                    data = json.loads(proc.stdout)
                    if "error" not in data:
                        print(f"[Gemini API] Thành công với mô hình: {model}")
                        return data, model
                    
                    err = data.get("error", {})
                    code = err.get("code", 0)
                    msg = err.get("message", "")
                    last_error = msg

                    # If quota exceeded (429) or high demand (503) or deprecated/404, cascade to next model
                    if code in (429, 503, 404) or "quota" in msg.lower() or "demand" in msg.lower():
                        print(f"[Gemini API] Mô hình {model} báo bận/hết quota ({code}). Đang tự động chuyển mô hình dự phòng tiếp theo...")
                        continue
                    
                    # Other errors
                    print(f"[Gemini API] Mô hình {model} lỗi ({code}): {msg[:100]}")
            except subprocess.TimeoutExpired:
                print(f"[Gemini API] Timeout trên mô hình {model}, chuyển mô hình tiếp theo...")
                continue
            except Exception as e:
                print(f"[Gemini API] Lỗi ngoại lệ trên {model}: {e}")
                continue

    return {"error": {"message": f"Tất cả các mô hình Gemini tạm thời bận hoặc hết quota: {last_error}"}}, ""


class RagHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_POST(self):
        if self.path != "/api/chat":
            self.send_error(404)
            return
        try:
            size = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(size) or b"{}")
            
            question = payload.get("question", "").strip()
            image_data = payload.get("image", "").strip()
            image_type = payload.get("image_type", "image/jpeg").strip()
            mode = payload.get("mode", "detail").strip() # 'detail' | 'socratic' | 'teacher'

            if not question and not image_data:
                raise ValueError("Vui lòng nhập câu hỏi hoặc tải ảnh đề bài.")

            # Search knowledge base
            search_query = question if question else "Hệ hai phương trình bậc nhất hai ẩn phương pháp thế cộng đại số hình học không gian hình trụ hình nón"
            sources = retrieve(search_query)

            api_key = os.getenv("GEMINI_API_KEY", "").strip()
            if api_key:
                context_str = "\n\n".join(
                    f"[{i+1}] ({s.get('type', 'SGK')}) {s.get('lesson', '')} - {s.get('title', '')} (Trang {s.get('page','?')}): {s.get('content', '')}"
                    for i, s in enumerate(sources)
                )

                # Custom instruction based on pedagogy mode
                if mode == "socratic":
                    system_prompt = (
                        "Bạn là Gia Sư Toán Socrate dành cho học sinh THCS (Toán 6-9, Bộ Kết Nối Tri Thức).\n"
                        "PHONG CÁCH SƯ PHẠM ĐẶC TRƯNG:\n"
                        "- TUYỆT ĐỐI KHÔNG giải sẵn hay đưa ra ngay đáp số cuối cùng.\n"
                        "- Hãy phân tích đề bài, khen ngợi động viên học sinh.\n"
                        "- Đặt 1 hoặc 2 câu hỏi gợi mở, hướng dẫn học sinh nhận biết công thức hoặc dữ kiện cần thiết từ SGK.\n"
                        "- Viết công thức toán bằng KaTeX/LaTeX: kẹp giữa $...$ hoặc $$...$$.\n"
                        "- Trích dẫn nguồn tài liệu [1], [2] từ ngữ cảnh SGK bên dưới khi gợi ý."
                    )
                elif mode == "teacher":
                    system_prompt = (
                        "Bạn là Chuyên Gia Sư Phạm & Sách Giáo Viên (SGV) Toán THCS (Chương trình GDPT 2018 - Kết Nối Tri Thức).\n"
                        "NHIỆM VỤ DÀNH CHO GIÁO VIÊN:\n"
                        "1. Xác định Mục tiêu cần đạt của bài toán (Kiến thức, Năng lực toán học, Phẩm chất).\n"
                        "2. Hướng dẫn phương pháp sư phạm: Cách tổ chức hoạt động dạy học, câu hỏi gợi mở cho học sinh.\n"
                        "3. Phân tích các sai lầm/lỗ hổng kiến thức học sinh hay mắc phải.\n"
                        "4. Gợi ý bài toán mở rộng hoặc câu hỏi phát triển năng lực.\n"
                        "- Viết công thức bằng LaTeX $...$ và đối chiếu với SGV [1], [2]."
                    )
                else:  # detail
                    system_prompt = (
                        "Bạn là Trợ Lý Dạy & Học Toán THCS (Chương trình Kết Nối Tri Thức Với Cuộc Sống).\n"
                        "CẤU TRÚC LỜI GIẢI SƯ PHẠM:\n"
                        "1. **Tóm tắt & Phân tích đề bài**: Xác định rõ giả thiết, kết luận và các đại lượng đã cho.\n"
                        "2. **Kiến thức & Công thức áp dụng**: Nêu rõ định lý/công thức từ SGK (trích [1], [2]).\n"
                        "3. **Lời giải chi tiết từng bước**: Trình bày mạch lạc, lập luận chặt chẽ. Định dạng mọi công thức toán bằng LaTeX ($...$ cho nội dòng, $$...$$ cho khối công thức riêng).\n"
                        "4. **Kết luận & Mẹo tránh sai sót**: Đáp số chuẩn mực và lưu ý giúp học sinh không bị trừ điểm."
                    )

                user_prompt = f"NGỮ CẢNH TÀI LIỆU SGK & SGV:\n{context_str}\n\n"
                if image_data:
                    user_prompt += (
                        "HƯỚNG DẪN XỬ LÝ ẢNH ĐỀ BÀI:\n"
                        "- Đọc kĩ đề bài và các phương trình/công thức trong ảnh.\n"
                        "- Nếu ảnh là một phiếu bài tập gồm nhiều bài (ví dụ Bài 1, Bài 2, Bài 3, Bài 4, Bài 5...):\n"
                        "  + Hãy nhận diện tổng thể chủ đề của phiếu (ví dụ: Toán 9 - Giải hệ phương trình bằng phương pháp cộng đại số).\n"
                        "  + Hãy giải chi tiết hoàn chỉnh BÀI 1 (câu a, b, c, d) trước tiên làm mẫu chuẩn mực sư phạm.\n"
                        "  + Cuối câu trả lời, nhắc học sinh có thể yêu cầu giải tiếp Bài 2, Bài 3, Bài 4 hoặc Bài 5 bất kì lúc nào.\n"
                    )
                if question:
                    user_prompt += f"YÊU CẦU CỦA NGƯỜI DÙNG: {question}\n"

                parts = [{"text": system_prompt + "\n\n" + user_prompt}]

                # Append multimodal image if provided
                if image_data:
                    clean_b64 = image_data.split(",", 1)[1] if "," in image_data else image_data
                    parts.append({
                        "inlineData": {
                            "mimeType": image_type,
                            "data": clean_b64
                        }
                    })

                # Call Google Gemini using resilient curl.exe runner with auto-model cascade
                gemini_payload = {"contents": [{"parts": parts}]}
                data, used_model = call_gemini_api(gemini_payload, api_key)
                
                if "error" in data:
                    err_msg = data['error'].get('message', 'Không xác định')
                    answer = (
                        f"⚠️ **Thông báo kết nối**: {err_msg}\n\n"
                        f"*(Hệ thống đã tự động chuyển sang đối chiếu kho tri thức SGK & SGV Toán THCS)*\n\n"
                        f"### 📖 Nội dung gợi ý từ SGK Kết Nối Tri Thức:\n"
                        f"{sources[0]['content'] if sources else 'Vui lòng thử lại sau vài giây.'}"
                    )
                else:
                    answer = data["candidates"][0]["content"]["parts"][0]["text"]
            else:
                answer = sources[0]["content"] + "\n\n*(Chế độ tra cứu cục bộ. Hãy thêm GEMINI_API_KEY vào tệp .env để kích hoạt trợ lý AI Gemini đa phương thức)*"

            self.reply({
                "answer": answer,
                "sources": sources,
                "mode": mode,
                "has_image": bool(image_data),
                "out_of_scope": False
            })

        except Exception as exc:
            self.reply({"error": str(exc)}, 500)

    def reply(self, payload, status=200):
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)


def main():
    os.chdir(ROOT)
    ip = local_ip()
    print("=" * 64)
    print(" PHÒNG THÍ NGHIỆM HÌNH HỌC ĐỘNG & TRỢ LÝ TOÁN AI (KHKT 2026)")
    print("=" * 64)
    print(f" Trên máy chủ : http://localhost:{PORT}")
    print(f" Máy cùng Wi-Fi: http://{ip}:{PORT}")
    print(" Model AI      : Google Gemini 3.6 Flash (Đa phương thức & Socrate)")
    print(" Nhấn Ctrl+C để dừng website.")
    print("=" * 64)

    handler = RagHandler
    with ReusableServer(("0.0.0.0", PORT), handler) as server:
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nĐã dừng website.")


if __name__ == "__main__":
    main()
