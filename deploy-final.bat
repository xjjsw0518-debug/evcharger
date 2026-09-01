@echo off
echo ========================================
echo   EV Charger - Deploy to Cloudflare
echo ========================================
echo.

cd /d "C:\dulizhan\githubclone\evcharger"

echo [1/3] Installing dependencies...
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: npm install failed
    echo Please check your internet connection
    pause
    exit /b 1
)
echo DONE
echo.

echo [2/3] Building frontend...
call npm run build
if errorlevel 1 (
    echo.
    echo ERROR: Build failed
    echo Please check the error messages above
    pause
    exit /b 1
)
echo DONE
echo.

echo [3/3] Deploying to Cloudflare...
echo.
echo NOTE: If this is your first time deploying,
echo a browser window will open for you to login to Cloudflare.
echo Please login and authorize wrangler.
echo.
call npx wrangler deploy
if errorlevel 1 (
    echo.
    echo ERROR: Deploy failed
    echo Please check the error messages above
    pause
    exit /b 1
)
echo.

echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Website: https://evcharger.xjjsw0518.workers.dev
echo Admin:   https://evcharger.xjjsw0518.workers.dev/XUEJIAN-manage
echo.
echo ========================================
echo   VERIFICATION STEPS
echo ========================================
echo.
echo 1. Open the website URL above
echo 2. Login to admin panel (username: XUEJIAN, password: XueJian0812511)
echo 3. Go to "Logo & Brand Settings"
echo 4. Change the brand name to "Test Brand" and save
echo 5. Open the website on ANOTHER computer or browser
echo 6. Press Ctrl+F5 to force refresh
echo 7. You should see "Test Brand" in the navigation bar!
echo.
echo If you see "Test Brand", global sync is working!
echo.
pause
