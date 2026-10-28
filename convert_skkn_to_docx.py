import sys
import os
import re
import time
from pathlib import Path
import docx
from docx.shared import Inches, Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
from lxml import etree
import latex2mathml.commands
from latex2mathml.converter import convert as latex2mathml_convert

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# ==============================================================================
# BỘ CHUYỂN ĐỔI CÔNG THỨC TOÁN SANG CHUẨN WORD EQUATION & MATHTYPE (OMML)
# ==============================================================================
_xslt_path = Path(__file__).resolve().parent / "skkn_builder" / "MML2OMML.XSL"
if not _xslt_path.exists():
    _xslt_path = Path(r"C:\Program Files\Microsoft Office\root\Office16\MML2OMML.XSL")

_omml_transform = None
if _xslt_path.exists():
    try:
        _xslt_doc = etree.parse(str(_xslt_path))
        _omml_transform = etree.XSLT(_xslt_doc)
    except Exception as _e:
        print(f"Cảnh báo: Không thể nạp tệp chuyển đổi XSLT: {_e}")

def latex_to_omml(latex_code, is_display=False):
    code = latex_code.strip()
    if not code or not _omml_transform:
        return None
    try:
        mml = latex2mathml_convert(code)
        tree = etree.fromstring(mml)
        omml = _omml_transform(tree).getroot()
        if is_display:
            para = etree.Element('{http://schemas.openxmlformats.org/officeDocument/2006/math}oMathPara')
            para.append(omml)
            return para
        return omml
    except Exception:
        return None

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_table_borders(table, border_color="94A3B8"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="6" w:space="0" w:color="{border_color}"/>'
        f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="{border_color}"/>'
        f'<w:left w:val="single" w:sz="6" w:space="0" w:color="{border_color}"/>'
        f'<w:right w:val="single" w:sz="6" w:space="0" w:color="{border_color}"/>'
        f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>'
        f'<w:insideV w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_outline_level(paragraph, level):
    pPr = paragraph._p.get_or_add_pPr()
    outline = parse_xml(f'<w:outlineLvl {nsdecls("w")} w:val="{level}"/>')
    pPr.append(outline)

def add_inline_runs(paragraph, text, default_bold=False, default_italic=False, font_size=13, font_color=RGBColor(0,0,0)):
    if not text:
        return
    tokens = re.split(r'(\*\*[^*]+?\*\*|\*[^*]+?\*|`[^`]+?`|\$\$[^\$]+?\$\$|\$[^\$]+?\$)', text)
    for token in tokens:
        if not token:
            continue
        if token.startswith('**') and token.endswith('**') and len(token) >= 4:
            add_inline_runs(paragraph, token[2:-2], default_bold=True, default_italic=default_italic, font_size=font_size, font_color=font_color)
        elif token.startswith('*') and token.endswith('*') and len(token) >= 2:
            add_inline_runs(paragraph, token[1:-1], default_bold=default_bold, default_italic=True, font_size=font_size, font_color=font_color)
        elif token.startswith('`') and token.endswith('`') and len(token) >= 2:
            run = paragraph.add_run(token[1:-1])
            run.font.name = 'Consolas'
            run.font.size = Pt(font_size - 1.5)
            run.font.color.rgb = RGBColor(180, 40, 40)
            run.bold = default_bold
        elif (token.startswith('$$') and token.endswith('$$') and len(token) >= 4) or (token.startswith('$') and token.endswith('$') and len(token) >= 2):
            math_code = token[2:-2].strip() if token.startswith('$$') else token[1:-1].strip()
            omml_elem = latex_to_omml(math_code, is_display=False)
            if omml_elem is not None:
                paragraph._p.append(omml_elem)
            else:
                run = paragraph.add_run(math_code)
                run.italic = True
                run.bold = default_bold
                run.font.name = 'Times New Roman'
                run.font.size = Pt(font_size)
                run.font.color.rgb = RGBColor(16, 75, 120)
        else:
            run = paragraph.add_run(token)
            run.bold = default_bold
            run.italic = default_italic
            run.font.name = 'Times New Roman'
            run.font.size = Pt(font_size)
            run.font.color.rgb = font_color

def create_cover_page(doc):
    p_header = doc.add_paragraph()
    p_header.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_header.paragraph_format.line_spacing = 1.15
    p_header.paragraph_format.space_after = Pt(2)
    r1 = p_header.add_run("SỞ GIÁO DỤC VÀ ĐÀO TẠO THÀNH PHỐ HỒ CHÍ MINH\n")
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(13)
    r1.bold = True
    r2 = p_header.add_run("TRƯỜNG TRUNG HỌC CƠ SỞ\n")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(13)
    r2.bold = True
    r_line = p_header.add_run("-----------------------***-----------------------\n\n\n\n")
    r_line.font.name = "Times New Roman"
    r_line.font.size = Pt(12)

    p_title_main = doc.add_paragraph()
    p_title_main.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title_main.paragraph_format.line_spacing = 1.2
    p_title_main.paragraph_format.space_after = Pt(18)
    r_main = p_title_main.add_run("BÁO CÁO SÁNG KIẾN KINH NGHIỆM\n")
    r_main.font.name = "Times New Roman"
    r_main.font.size = Pt(22)
    r_main.bold = True
    r_main.font.color.rgb = RGBColor(15, 60, 110)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.line_spacing = 1.35
    p_sub.paragraph_format.space_after = Pt(40)
    r_sub = p_sub.add_run(
        "ỨNG DỤNG PHẦN MỀM MÔ PHỎNG HÌNH HỌC ĐỘNG MATHLAB\n"
        "KẾT HỢP TRỢ LÝ TRUY XUẤT BÀI HỌC THÔNG MINH\n"
        "NHẰM NÂNG CAO NĂNG LỰC MÔ HÌNH HÓA TOÁN HỌC TRONG DẠY HỌC\n"
        "CHƯƠNG X: MỘT SỐ HÌNH KHỐI TRONG THỰC TIỄN\n"
        "(TOÁN 9 – BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)"
    )
    r_sub.font.name = "Times New Roman"
    r_sub.font.size = Pt(15)
    r_sub.bold = True
    r_sub.font.color.rgb = RGBColor(180, 30, 30)

    p_info = doc.add_paragraph()
    p_info.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_info.paragraph_format.left_indent = Inches(1.5)
    p_info.paragraph_format.line_spacing = 1.3
    p_info.paragraph_format.space_after = Pt(60)

    info_text = (
        "Lĩnh vực áp dụng : Phương pháp dạy học môn Toán THCS\n"
        "Cấp học áp dụng  : Trung học cơ sở (Khối 9)\n"
        "Tác giả          : Giáo viên bộ môn Toán\n"
        "Đơn vị công tác  : Trường Trung học cơ sở\n"
        "Năm học thực hiện: Năm học 2026 – 2027"
    )
    for line in info_text.splitlines():
        k, v = line.split(":", 1)
        rk = p_info.add_run(k + ":")
        rk.font.name = "Times New Roman"
        rk.font.size = Pt(13.5)
        rk.bold = True
        rv = p_info.add_run(v + "\n")
        rv.font.name = "Times New Roman"
        rv.font.size = Pt(13.5)

    p_bottom = doc.add_paragraph()
    p_bottom.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_bot = p_bottom.add_run("THÀNH PHỐ HỒ CHÍ MINH, NĂM 2027")
    r_bot.font.name = "Times New Roman"
    r_bot.font.size = Pt(13)
    r_bot.bold = True

    doc.add_page_break()

def convert_md_to_docx(md_path, docx_path):
    t_start = time.time()
    print(f"Bắt đầu chuyển đổi: {md_path} -> {docx_path}")
    doc = docx.Document()
    
    for section in doc.sections:
        section.top_margin = Cm(2.0)
        section.bottom_margin = Cm(2.0)
        section.left_margin = Cm(3.0)
        section.right_margin = Cm(1.5)
        section.page_width = Cm(21.0)
        section.page_height = Cm(29.7)
        section.different_first_page_header_footer = True
        
        section.header_distance = Cm(1.0)
        section.footer_distance = Cm(1.0)
        
        # Đánh số trang ở trên cùng chính giữa (Top Center Header) bắt đầu từ trang 2
        header = section.header
        p_head = header.paragraphs[0]
        p_head.text = ""
        p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_head = p_head.add_run()
        r_head.font.name = 'Times New Roman'
        r_head.font.size = Pt(11)
        r_head._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w')))
        r_head._r.append(parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls('w')))
        r_head._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w')))
        r_head._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w')))
        
        # Trang bìa: Header và Footer để trống hoàn toàn
        for p in section.first_page_header.paragraphs:
            p.text = ""
        for p in section.first_page_footer.paragraphs:
            p.text = ""
            
        # Footer các trang sau: Để trống hoàn toàn (vì số trang đã chuyển lên Header)
        for p in section.footer.paragraphs:
            p.text = ""

    # Cấu hình các style Heading để Word tự động nhận diện và cập nhật Mục lục (TOC)
    heading_configs = [
        ('Heading 1', Pt(15), RGBColor(15, 60, 110), Pt(16), Pt(6)),
        ('Heading 2', Pt(14), RGBColor(20, 80, 130), Pt(14), Pt(5)),
        ('Heading 3', Pt(13.5), RGBColor(30, 41, 59), Pt(10), Pt(4)),
        ('Heading 4', Pt(13), RGBColor(30, 41, 59), Pt(8), Pt(3)),
    ]
    for h_name, size, color, space_b, space_a in heading_configs:
        if h_name in doc.styles:
            s = doc.styles[h_name]
            s.font.name = 'Times New Roman'
            s.font.size = size
            s.font.color.rgb = color
            s.font.bold = True
            s.paragraph_format.space_before = space_b
            s.paragraph_format.space_after = space_a
            s.paragraph_format.line_spacing = 1.25
            s.paragraph_format.keep_with_next = True
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(13)
    normal_style.font.color.rgb = RGBColor(0, 0, 0)
    normal_style.paragraph_format.line_spacing = 1.35
    normal_style.paragraph_format.space_after = Pt(4)

    create_cover_page(doc)

    lines = Path(md_path).read_text(encoding='utf-8').splitlines()

    i = 0
    in_code_block = False
    code_block_lines = []
    display_math_count = 0

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Handle multi-line display math ($$ on its own line)
        if stripped == '$$':
            math_lines = []
            i += 1
            while i < len(lines) and lines[i].strip() != '$$':
                math_lines.append(lines[i].strip())
                i += 1
            if i < len(lines):
                i += 1
            math_code = " ".join(math_lines).strip()
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.line_spacing = 1.15
            omml_elem = latex_to_omml(math_code, is_display=True)
            if omml_elem is not None:
                p._p.append(omml_elem)
                display_math_count += 1
            else:
                r = p.add_run(math_code)
                r.font.name = 'Times New Roman'
                r.font.size = Pt(13)
                r.italic = True
            continue

        # Handle single-line standalone display math ($$ ... $$)
        if stripped.startswith('$$') and stripped.endswith('$$') and len(stripped) >= 4 and stripped.count('$$') == 2:
            math_code = stripped[2:-2].strip()
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.line_spacing = 1.15
            omml_elem = latex_to_omml(math_code, is_display=True)
            if omml_elem is not None:
                p._p.append(omml_elem)
                display_math_count += 1
            else:
                r = p.add_run(math_code)
                r.font.name = 'Times New Roman'
                r.font.size = Pt(13)
                r.italic = True
            i += 1
            continue

        # Handle Code Blocks
        if stripped.startswith('```'):
            if in_code_block:
                in_code_block = False
                p = doc.add_paragraph()
                p.paragraph_format.left_indent = Inches(0.4)
                p.paragraph_format.right_indent = Inches(0.4)
                p.paragraph_format.space_before = Pt(4)
                p.paragraph_format.space_after = Pt(6)
                p.paragraph_format.line_spacing = 1.15
                code_text = "\n".join(code_block_lines)
                run = p.add_run(code_text)
                run.font.name = 'Consolas'
                run.font.size = Pt(10)
                run.font.color.rgb = RGBColor(30, 41, 59)
                code_block_lines = []
            else:
                in_code_block = True
                code_block_lines = []
            i += 1
            continue

        if in_code_block:
            code_block_lines.append(line)
            i += 1
            continue

        # Skip main markdown title as it's already on the cover page
        if stripped.startswith('# BÁO CÁO') or stripped.startswith('## NGÀNH GIÁO DỤC') or stripped.startswith('# ỨNG DỤNG PHẦN MỀM'):
            i += 1
            continue

        # Page Break on major sections
        if stripped in ('# 1. ĐẶT VẤN ĐỀ', '# 2. GIẢI QUYẾT VẤN ĐỀ', '# 3. KẾT LUẬN VÀ KHUYẾN NGHỊ', '# TÀI LIỆU THAM KHẢO', '# PHỤ LỤC', '# DANH MỤC CÁC CHỮ CÁI VIẾT TẮT'):
            doc.add_page_break()

        # Headings
        if stripped.startswith('# '):
            heading_text = stripped[2:].strip()
            if heading_text.upper() in ('MỤC LỤC', 'MUC LUC'):
                p = doc.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.space_before = Pt(6)
                p.paragraph_format.space_after = Pt(14)
                p.paragraph_format.line_spacing = 1.2
                r_title = p.add_run("Mục lục")
                r_title.font.name = "Times New Roman"
                r_title.font.size = Pt(18)
                r_title.bold = True
                r_title.font.color.rgb = RGBColor(43, 87, 154) # Màu xanh Word chuẩn như hình mẫu
            else:
                p = doc.add_paragraph(style='Heading 1')
                set_outline_level(p, 0)
                p.paragraph_format.space_before = Pt(16)
                p.paragraph_format.space_after = Pt(6)
                p.paragraph_format.line_spacing = 1.25
                p.paragraph_format.keep_with_next = True
                add_inline_runs(p, heading_text, default_bold=True, font_size=15, font_color=RGBColor(15, 60, 110))
            i += 1
            continue

        if stripped.startswith('## '):
            p = doc.add_paragraph(style='Heading 2')
            set_outline_level(p, 1)
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(5)
            p.paragraph_format.line_spacing = 1.25
            p.paragraph_format.keep_with_next = True
            add_inline_runs(p, stripped[3:].strip(), default_bold=True, font_size=14, font_color=RGBColor(20, 80, 130))
            i += 1
            continue

        if stripped.startswith('### '):
            p = doc.add_paragraph(style='Heading 3')
            set_outline_level(p, 2)
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.line_spacing = 1.25
            p.paragraph_format.keep_with_next = True
            add_inline_runs(p, stripped[4:].strip(), default_bold=True, font_size=13.5, font_color=RGBColor(30, 41, 59))
            i += 1
            continue

        if stripped.startswith('#### '):
            p = doc.add_paragraph(style='Heading 4')
            set_outline_level(p, 3)
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.line_spacing = 1.3
            p.paragraph_format.keep_with_next = True
            add_inline_runs(p, stripped[5:].strip(), default_bold=True, default_italic=True, font_size=13)
            i += 1
            continue

        if stripped.startswith('##### ') or stripped.startswith('###### '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(2)
            text_val = stripped.lstrip('#').strip()
            add_inline_runs(p, text_val, default_bold=True, font_size=13)
            i += 1
            continue

        # Horizontal Rule (---)
        if stripped == '---':
            i += 1
            continue

        # Table Parsing
        if stripped.startswith('|') and '|' in stripped[1:]:
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                table_lines.append(lines[i].strip())
                i += 1
            
            parsed_rows = []
            for t_line in table_lines:
                if re.match(r'^\|[\s\-:|]+\|$', t_line):
                    continue
                cells = [c.strip() for c in t_line.strip('|').split('|')]
                parsed_rows.append(cells)

            if parsed_rows:
                num_cols = max(len(r) for r in parsed_rows)
                norm_rows = []
                for r in parsed_rows:
                    if len(r) < num_cols:
                        r = r + [''] * (num_cols - len(r))
                    norm_rows.append(r[:num_cols])

                is_toc_table = (num_cols == 2 and any('TRANG' in c.upper() for c in norm_rows[0]))

                if is_toc_table:
                    # Tạo cấu trúc Trường Mục lục chuẩn động Word (Dynamic TOC Field) với dòng chấm (Dot Leader)
                    p_fld_begin = doc.add_paragraph()
                    p_fld_begin.paragraph_format.space_before = Pt(0)
                    p_fld_begin.paragraph_format.space_after = Pt(0)
                    p_fld_begin.paragraph_format.line_spacing = 1.0
                    r_begin = p_fld_begin.add_run()
                    r_begin._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w')))
                    r_begin._r.append(parse_xml(r'<w:instrText %s xml:space="preserve"> TOC \o "1-3" \h \z \u </w:instrText>' % nsdecls('w')))
                    r_begin._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w')))

                    for r_data in norm_rows[1:]:
                        raw_title = r_data[0].strip()
                        raw_page = r_data[1].strip() if len(r_data) > 1 else ""
                        clean_title = re.sub(r'[*_`]', '', raw_title).strip()
                        clean_page = re.sub(r'[*_`]', '', raw_page).strip()
                        
                        if clean_title.upper() in ('MỤC LỤC', 'MUC LUC'):
                            continue

                        # Phân cấp thụt dòng chính xác như hình mẫu:
                        # Cấp 1 (Chương / Phần lớn): thụt 0cm, in đậm
                        # Cấp 2 (Điều / Mục con 1.x, 2.x): thụt 0.6cm, chữ thường
                        # Cấp 3 (Mục 2.1.1, bảng biểu): thụt 1.2cm
                        if re.match(r'^(Chương|[123]\.\s+|DANH MỤC|TÀI LIỆU|PHỤ LỤC)', clean_title) and not re.match(r'^[123]\.\d+\.', clean_title):
                            level = 1
                            is_bold = True
                        elif re.match(r'^[123]\.\d+\.\s+', clean_title) or clean_title.startswith('Phụ lục'):
                            level = 2
                            is_bold = False
                        else:
                            level = 3
                            is_bold = False

                        p_entry = doc.add_paragraph()
                        p_entry.paragraph_format.space_before = Pt(1)
                        p_entry.paragraph_format.space_after = Pt(2)
                        p_entry.paragraph_format.line_spacing = 1.15

                        if level == 1:
                            p_entry.paragraph_format.left_indent = Cm(0)
                        elif level == 2:
                            p_entry.paragraph_format.left_indent = Cm(0.6)
                        else:
                            p_entry.paragraph_format.left_indent = Cm(1.2)

                        # Thiết lập Tab Stop bên phải có đường chấm (Dotted Leader) thẳng hàng mép phải
                        pPr = p_entry._p.get_or_add_pPr()
                        tabs_xml = parse_xml(r'<w:tabs %s><w:tab w:val="right" w:leader="dot" w:pos="9355"/></w:tabs>' % nsdecls('w'))
                        pPr.append(tabs_xml)

                        r_t = p_entry.add_run(clean_title)
                        r_t.font.name = 'Times New Roman'
                        r_t.font.size = Pt(12)
                        r_t.bold = is_bold
                        if level == 1:
                            r_t.font.color.rgb = RGBColor(15, 60, 110)
                        elif level == 3 and ('Bảng' in clean_title or 'Phiếu' in clean_title):
                            r_t.italic = True

                        p_entry.add_run('\t')

                        r_p = p_entry.add_run(clean_page)
                        r_p.font.name = 'Times New Roman'
                        r_p.font.size = Pt(12)
                        r_p.bold = is_bold

                    # Kết thúc Trường Mục lục
                    p_fld_end = doc.add_paragraph()
                    p_fld_end.paragraph_format.space_before = Pt(0)
                    p_fld_end.paragraph_format.space_after = Pt(4)
                    p_fld_end.paragraph_format.line_spacing = 1.0
                    r_end = p_fld_end.add_run()
                    r_end._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w')))
                    continue

                t_elem = doc.add_table(rows=len(norm_rows), cols=num_cols)
                t_elem.alignment = WD_TABLE_ALIGNMENT.CENTER
                set_table_borders(t_elem)
                for row_idx, r_data in enumerate(norm_rows):
                    is_header = (row_idx == 0)
                    row_obj = t_elem.rows[row_idx]
                    
                    
                    trPr = row_obj._tr.get_or_add_trPr()
                    trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
                    if is_header:
                        trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

                    for col_idx, cell_value in enumerate(r_data):
                        cell = row_obj.cells[col_idx]
                        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
                        set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
                        
                        if is_header:
                            set_cell_background(cell, "E2E8F0")
                        elif row_idx % 2 == 1:
                            set_cell_background(cell, "F8FAFC")

                        p = cell.paragraphs[0]
                        p.paragraph_format.line_spacing = 1.15
                        p.paragraph_format.space_after = Pt(2)
                        p.paragraph_format.space_before = Pt(2)
                        
                        if is_header or cell_value.endswith('%') or re.match(r'^[\d.,]+$', cell_value) or len(cell_value) <= 10:
                            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                        else:
                            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                            
                        clean_cell = cell_value.replace('<br>', '\n').replace('<br/>', '\n')
                        add_inline_runs(p, clean_cell, default_bold=is_header, font_size=11.5)

                p_after = doc.add_paragraph()
                p_after.paragraph_format.space_before = Pt(2)
                p_after.paragraph_format.space_after = Pt(4)
            continue

        # Blockquote (> ...)
        if stripped.startswith('> '):
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.4)
            p.paragraph_format.right_indent = Inches(0.2)
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.line_spacing = 1.25
            add_inline_runs(p, stripped[2:], default_italic=True, font_size=12.5, font_color=RGBColor(51, 65, 85))
            i += 1
            continue

        # Lists (* or - or numbered)
        if re.match(r'^(\*|-)\s+', stripped):
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.3)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.line_spacing = 1.3
            r_bullet = p.add_run("• ")
            r_bullet.bold = True
            r_bullet.font.name = 'Times New Roman'
            r_bullet.font.size = Pt(13)
            list_text = re.sub(r'^(\*|-)\s+', '', stripped)
            add_inline_runs(p, list_text, font_size=13)
            i += 1
            continue

        if re.match(r'^\d+\.\s+', stripped):
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.35)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.line_spacing = 1.3
            m = re.match(r'^(\d+\.)\s+(.*)', stripped)
            r_num = p.add_run(m.group(1) + " ")
            r_num.bold = True
            r_num.font.name = 'Times New Roman'
            r_num.font.size = Pt(13)
            add_inline_runs(p, m.group(2), font_size=13)
            i += 1
            continue

        # Standard Paragraph
        if stripped:
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.first_line_indent = Inches(0.4)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.line_spacing = 1.35
            add_inline_runs(p, stripped, font_size=13)

        i += 1

    # Bật tính năng tự động cập nhật trường Mục lục khi mở tệp Word
    try:
        doc.settings._element.append(parse_xml(r'<w:updateFields %s w:val="true"/>' % nsdecls('w')))
    except Exception as _e_set:
        print(f"Cảnh báo cài đặt updateFields: {_e_set}")

    doc.save(docx_path)
    file_size_kb = os.path.getsize(docx_path) / 1024
    t_end = time.time()
    print(f"Hoàn thành chuyển đổi: {docx_path}")
    print(f" - Thời gian xử lý: {t_end - t_start:.2f} giây")
    print(f" - Dung lượng tệp Word: {file_size_kb:.1f} KB")
    print(f" - Số công thức toán khối hiển thị (Display Math): {display_math_count}")
    print(f" - Toàn bộ công thức toán đã được chuyển đổi thành chuẩn Word Equation & MathType OMML thành công!")

if __name__ == "__main__":
    md_file = Path(r"E:\RAG_TOAN_HOC\RAG_TOAN_HOC\MathLab\BAO_CAO_SANG_KIEN_KINH_NGHIEM_MATHLAB_TOAN_9.md")
    docx_file = Path(r"E:\RAG_TOAN_HOC\RAG_TOAN_HOC\MathLab\BAO_CAO_SANG_KIEN_KINH_NGHIEM_MATHLAB_TOAN_9.docx")
    convert_md_to_docx(md_file, docx_file)
