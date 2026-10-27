# -*- coding: utf-8 -*-
"""
Script to build the full 80+ page SKKN Markdown and convert it to DOCX
"""
import sys
import os

from skkn_builder import ALL_PARTS

def build_markdown(output_path="BAO_CAO_SANG_KIEN_KINH_NGHIEM_MATHLAB_TOAN_9.md"):
    print("[1/2] Assembling comprehensive SKKN document...")
    full_text = "\n\n---\n\n".join(part.strip() for part in ALL_PARTS)
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(full_text)
        f.write("\n")
        
    file_size = os.path.getsize(output_path)
    total_words = len(full_text.split())
    total_lines = len(full_text.splitlines())
    print(f"Assembly complete: {output_path}")
    print(f" - File size: {file_size:,} bytes")
    print(f" - Total words: {total_words:,} words")
    print(f" - Total lines: {total_lines:,} lines")
    return output_path

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    md_file = build_markdown()
