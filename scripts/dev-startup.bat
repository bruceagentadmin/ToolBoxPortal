@echo off
title ToolBoxPortal-Dev-AutoLaunch
cd /d "%~dp0.."
echo [Startup] Launching ToolBoxPortal in development mode...
npm run dev
pause
