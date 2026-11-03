@echo off
title Uninstalling AE Gemini AI Assistant...
color 0e

echo ========================================================
echo        AE Gemini AI Assistant - Uninstaller
echo ========================================================
echo.

set "TARGET_DIR=%APPDATA%\Adobe\CEP\extensions\com.ai.aftereffects"

if exist "%TARGET_DIR%" (
    rmdir /s /q "%TARGET_DIR%" >nul 2>&1
    echo Extension removed from %TARGET_DIR%
    echo Uninstallation complete!
) else (
    echo Extension is not installed.
)

echo.
pause
