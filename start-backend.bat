@echo off
echo ====================================
echo Starting Backend API Server
echo ====================================
echo.
echo Checking for dataset...
if not exist "data\All_Diets.csv" (
    echo ERROR: Dataset not found!
    echo Please place All_Diets.csv in the data\ folder
    echo.
    pause
    exit /b 1
)

echo Dataset found!
echo.
echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Starting Flask API on http://localhost:5000
echo Press Ctrl+C to stop
echo.
python api_server.py
