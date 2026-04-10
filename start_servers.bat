@echo off
echo Cleaning up existing processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM python.exe /T 2>nul
taskkill /F /IM py.exe /T 2>nul

echo Starting Gala Crafters Servers...

start cmd /k "cd backend && py -u main.py"
start cmd /k "cd gala-crafters && npm run dev"

echo Servers are starting in separate windows.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
pause
