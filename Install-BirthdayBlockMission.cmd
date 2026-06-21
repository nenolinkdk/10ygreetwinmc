@echo off
setlocal

set "SCRIPT=%~dp0Install-BirthdayBlockMission.ps1"
set "TEMP_SCRIPT=%TEMP%\Install-BirthdayBlockMission.ps1"

if not exist "%SCRIPT%" (
  echo Downloading installer helper from GitHub...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/nenolinkdk/10ygreetwinmc/main/Install-BirthdayBlockMission.ps1' -OutFile '%TEMP_SCRIPT%'"
  if errorlevel 1 goto failed
  set "SCRIPT=%TEMP_SCRIPT%"
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%"
if errorlevel 1 goto failed
exit /b 0

:failed
echo.
echo Installation failed.
pause
exit /b 1
