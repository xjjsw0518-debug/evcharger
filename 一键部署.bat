@echo off
chcp 65001 >nul
echo ========================================
echo   EV Charger 网站一键部署
echo ========================================
echo.
echo 正在启动部署脚本...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"
echo.
pause
