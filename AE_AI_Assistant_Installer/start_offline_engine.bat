@echo off
title Starting Offline AE AI Assistant Engine...
color 0b
echo ========================================================
echo     AE AI Assistant - Local Offline Inference Engine
echo ========================================================
echo.
cd /d "%~dp0com.ai.aftereffects\server"
call start_server.bat
