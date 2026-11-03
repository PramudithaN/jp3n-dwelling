@echo off
title Installing AE AI Assistant...
color 0b

echo ========================================================
echo        AE AI Assistant - 1-Click Installer
echo ========================================================
echo.

:: Check if After Effects is currently running
tasklist /FI "IMAGENAME eq AfterFX.exe" 2>NUL | find /I /N "AfterFX.exe">NUL
if "%ERRORLEVEL%"=="0" (
    color 0e
    echo [WARNING] Adobe After Effects is currently running!
    echo Please save your work and close After Effects so the extension can be detected.
    echo.
    pause
)

:: 1. Enable Adobe CEP PlayerDebugMode in Windows Registry (All versions CSXS 6 to 16)
echo [1/3] Enabling Adobe Developer Mode (PlayerDebugMode)...
for /L %%V in (6,1,16) do (
    reg add "HKCU\Software\Adobe\CSXS.%%V" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
    reg add "HKLM\SOFTWARE\Adobe\CSXS.%%V" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
    reg add "HKLM\SOFTWARE\WOW6432Node\Adobe\CSXS.%%V" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
)
echo       Done!

:: 2. Target Directory (User AppData)
echo.
echo [2/3] Setting up Adobe Extensions folder...
set "TARGET_USER=%APPDATA%\Adobe\CEP\extensions\com.ai.aftereffects"
set "TARGET_COMMON=%CommonProgramFiles(x86)%\Adobe\CEP\extensions\com.ai.aftereffects"

if not exist "%APPDATA%\Adobe\CEP\extensions" (
    mkdir "%APPDATA%\Adobe\CEP\extensions" >nul 2>&1
)

:: 3. Copy Files to User Directory
echo.
echo [3/3] Copying extension files...
if exist "%TARGET_USER%" (
    rmdir /s /q "%TARGET_USER%" >nul 2>&1
)
xcopy /E /I /Y "%~dp0com.ai.aftereffects" "%TARGET_USER%" >nul
set "COPY_STATUS=%ERRORLEVEL%"

:: Also copy to Common Files if directory or permissions exist
if exist "%CommonProgramFiles(x86)%\Adobe\CEP\extensions" (
    xcopy /E /I /Y "%~dp0com.ai.aftereffects" "%TARGET_COMMON%" >nul 2>&1
)

if %COPY_STATUS% EQU 0 (
    color 0a
    echo.
    echo ========================================================
    echo             INSTALLATION SUCCESSFUL!
    echo ========================================================
    echo.
    echo Next Steps:
    echo  1. Double-click "start_offline_engine.bat" to boot the AI.
    echo  2. Open Adobe After Effects.
    echo  3. In top menu: Window ^> Extensions ^> AI Assistant.
    echo.
) else (
    color 0c
    echo.
    echo [ERROR] Could not copy files. Try right-clicking "install.bat" and selecting "Run as administrator".
)

echo.
pause
