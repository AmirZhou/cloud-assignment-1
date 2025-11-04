@echo off
echo ====================================
echo Starting Frontend Dashboard
echo ====================================
echo.
cd frontend

if not exist "node_modules" (
    echo Installing npm dependencies...
    echo This may take a few minutes...
    call npm install
    echo.
)

echo Starting React dev server on http://localhost:3000
echo Press Ctrl+C to stop
echo.
call npm run dev
