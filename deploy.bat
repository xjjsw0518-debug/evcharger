@echo off
chcp 65001 >nul
echo ========================================
echo   EV Charger - One-Click Deploy
echo ========================================
echo.
echo Starting deployment...
echo.

cd /d "C:\dulizhan\githubclone\evcharger"

echo [1/5] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo DONE
echo.

echo [2/5] Building frontend...
call npm run build
if errorlevel 1 (
    echo ERROR: build failed
    pause
    exit /b 1
)
echo DONE
echo.

echo [3/5] Checking Cloudflare login...
call npx wrangler whoami
echo.

echo [4/5] Creating KV namespace (if not exists)...
call npx wrangler kv namespace create SITE_SETTINGS
echo.

echo [5/5] Deploying to Cloudflare...
call npx wrangler deploy
if errorlevel 1 (
    echo ERROR: deploy failed
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
echo IMPORTANT: After deployment, you need to:
echo 1. Open wrangler.toml
echo 2. Find the KV namespace ID from the output above
echo 3. Replace REPLACE_WITH_YOUR_KV_NAMESPACE_ID with the actual ID
echo 4. Run this script again to redeploy
echo.
pause
