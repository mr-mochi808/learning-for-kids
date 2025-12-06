@echo off
REM Web Crawler Setup Script for Windows
REM This script helps you get started with the web crawler

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║       Web Crawler - Windows Setup Script                 ║
echo ║       Similar to Google's Crawling Engine                ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js detected: 
node --version

echo.
echo ⏳ Installing dependencies...
call npm install

echo.
echo ✓ Setup complete!
echo.
echo 📚 Next Steps:
echo.
echo 1. Run tests:
echo    node test.js
echo.
echo 2. Start crawling (interactive):
echo    node cli.js crawl
echo.
echo 3. View web dashboard:
echo    Open 'index.html' in your browser
echo.
echo 4. Read documentation:
echo    - QUICKSTART.md (quick guide)
echo    - README.md (full documentation)
echo    - PROJECT_OVERVIEW.md (overview)
echo.
echo 5. Try examples:
echo    node examples.js
echo.
echo 🚀 Happy Crawling!
echo.
pause
