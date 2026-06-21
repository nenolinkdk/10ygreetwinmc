@echo off
echo Removing Birthday Block Mission...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Remove-Item '%LOCALAPPDATA%\BirthdayBlockMission' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '%USERPROFILE%\Desktop\Birthday Block Mission.lnk' -Force -ErrorAction SilentlyContinue; Remove-Item '%APPDATA%\Microsoft\Windows\Start Menu\Programs\Birthday Block Mission.lnk' -Force -ErrorAction SilentlyContinue"
echo Done.
pause
