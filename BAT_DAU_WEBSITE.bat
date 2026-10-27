@echo off
chcp 65001 >nul
title Phòng thí nghiệm Hình học động Toán 9
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
    py -3 run_lan_server.py
    goto :end
)

where python >nul 2>nul
if %errorlevel%==0 (
    python run_lan_server.py
    goto :end
)

echo.
echo Không tìm thấy Python trên máy tính.
echo Hãy cài Python 3 từ https://www.python.org/downloads/
echo Khi cài đặt, nhớ chọn "Add Python to PATH".
echo.
pause

:end

