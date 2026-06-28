@echo off
setlocal EnableExtensions
title AI Figma UI/UX Platform

cd /d "%~dp0"

echo ============================================
echo   AI Figma UI/UX Design Generator Platform
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or not in PATH.
  echo Install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

if not exist "server\.env" (
  echo [ERROR] Missing server\.env file.
  echo Copy server\.env.example to server\.env and fill your values.
  pause
  exit /b 1
)

if not exist ".env" (
  echo [WARN] Missing root .env file. Creating from .env.example...
  if exist ".env.example" (
    copy /Y ".env.example" ".env" >nul
  ) else (
    echo VITE_API_URL=http://localhost:4000/api> ".env"
  )
)

if not exist "node_modules\" (
  echo Installing frontend dependencies...
  call npm install
  if errorlevel 1 (
    echo [ERROR] Frontend npm install failed.
    pause
    exit /b 1
  )
)

if not exist "server\node_modules\" (
  echo Installing backend dependencies...
  pushd server
  call npm install
  if errorlevel 1 (
    echo [ERROR] Backend npm install failed.
    popd
    pause
    exit /b 1
  )
  popd
)

echo Starting backend API on http://localhost:4000 ...
start "Backend API (Port 4000)" cmd /k "cd /d "%~dp0server" && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting frontend on http://localhost:5173 ...
start "Frontend (Port 5173)" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo Project started in separate windows.
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:4000
echo   API base: http://localhost:4000/api
echo.
echo Make sure PostgreSQL is running and migrations are applied:
echo   cd server
echo   npx prisma migrate dev
echo   npm run prisma:seed
echo.
pause
