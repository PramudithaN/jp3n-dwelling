@echo off
title Antigravity Local Bridge Server
color 0a

echo ========================================================
echo        Antigravity Local Bridge Server for AE
echo ========================================================
echo.
echo Starting bridge on http://127.0.0.1:4000 ...
echo Keep this window open while using After Effects with Antigravity.
echo.

node "%~dp0bridge\server.js"
if %ERRORLEVEL% NEQ 0 (
    color 0c
    echo.
    echo [ERROR] Failed to start Node.js server. Please ensure Node.js is installed.
    pause
)
