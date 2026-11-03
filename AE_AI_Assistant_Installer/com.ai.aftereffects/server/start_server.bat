@echo off
setlocal
cd /d "%~dp0"

set "MODEL_PATH=models\qwen2.5-coder-1.5b-ae-q4_k_m.gguf"

if not exist "%MODEL_PATH%" (
    echo [INFO] Fine-tuned model not found, falling back to base model...
    set "MODEL_PATH=models\qwen2.5-coder-1.5b-instruct-q4_k_m.gguf"
)

if not exist "%MODEL_PATH%" (
    color 0c
    echo [ERROR] No model weights found in "%~dp0models\".
    echo Please ensure a .gguf model file is present.
    pause
    exit /b 1
)

echo ========================================================
echo   Starting Offline AE AI Engine (llama-server)
echo   Model: %MODEL_PATH%
echo   Endpoint: http://127.0.0.1:8080
echo ========================================================

bin\llama-server.exe -m "%MODEL_PATH%" --host 127.0.0.1 --port 8080 -c 2048 -t 6
