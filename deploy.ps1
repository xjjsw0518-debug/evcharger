# 网站一键部署脚本
# 用法：右键 -> 使用 PowerShell 运行

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EV Charger 网站一键部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 切换到项目目录
$projectDir = "C:\dulizhan\githubclone\evcharger"
Set-Location $projectDir
Write-Host "当前目录: $projectDir" -ForegroundColor Green
Write-Host ""

# 步骤1：检查 Node.js 和 npm
Write-Host "[步骤 1/7] 检查环境..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js 未安装，请先安装 Node.js" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "  ✓ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ npm 未安装" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host ""

# 步骤2：检查 wrangler 是否已登录
Write-Host "[步骤 2/7] 检查 Cloudflare 登录状态..." -ForegroundColor Yellow
$wranglerPath = "node_modules\.bin\wrangler.cmd"
if (-not (Test-Path $wranglerPath)) {
    Write-Host "  正在安装 wrangler..." -ForegroundColor Gray
    npm install wrangler --save-dev
}

try {
    $whoami = & npx wrangler whoami 2>&1
    if ($whoami -match "You are not logged in") {
        Write-Host "  ⚠ wrangler 未登录" -ForegroundColor Yellow
        Write-Host "  正在打开浏览器登录 Cloudflare..." -ForegroundColor Gray
        Write-Host "  请在浏览器中完成登录后回到这里" -ForegroundColor Gray
        & npx wrangler login
    } else {
        Write-Host "  ✓ 已登录 Cloudflare" -ForegroundColor Green
    }
} catch {
    Write-Host "  ⚠ 无法检查登录状态，尝试登录..." -ForegroundColor Yellow
    & npx wrangler login
}
Write-Host ""

# 步骤3：创建 KV 命名空间
Write-Host "[步骤 3/7] 创建/检查 KV 命名空间..." -ForegroundColor Yellow
$kvName = "SITE_SETTINGS"
$kvList = & npx wrangler kv namespace list 2>&1 | ConvertFrom-Json
$existingKv = $kvList | Where-Object { $_.title -eq $kvName }

if ($existingKv) {
    $kvId = $existingKv.id
    Write-Host "  ✓ KV 命名空间已存在: $kvName" -ForegroundColor Green
    Write-Host "  ID: $kvId" -ForegroundColor Gray
} else {
    Write-Host "  正在创建 KV 命名空间: $kvName..." -ForegroundColor Gray
    $createResult = & npx wrangler kv namespace create $kvName 2>&1
    if ($createResult -match "id = \"([a-f0-9]+)\"") {
        $kvId = $Matches[1]
        Write-Host "  ✓ KV 命名空间创建成功" -ForegroundColor Green
        Write-Host "  ID: $kvId" -ForegroundColor Gray
    } else {
        Write-Host "  ✗ 创建失败，请手动创建" -ForegroundColor Red
        Write-Host "  错误信息: $createResult" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
}
Write-Host ""

# 步骤4：更新 wrangler.toml
Write-Host "[步骤 4/7] 更新 wrangler.toml 配置..." -ForegroundColor Yellow
$wranglerPath = "wrangler.toml"
$wranglerContent = Get-Content $wranglerPath -Raw
$wranglerContent = $wranglerContent -replace 'REPLACE_WITH_YOUR_KV_NAMESPACE_ID', $kvId
Set-Content -Path $wranglerPath -Value $wranglerContent -Encoding UTF8
Write-Host "  ✓ wrangler.toml 已更新" -ForegroundColor Green
Write-Host ""

# 步骤5：安装依赖
Write-Host "[步骤 5/7] 安装项目依赖..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ 依赖安装成功" -ForegroundColor Green
} else {
    Write-Host "  ✗ 依赖安装失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host ""

# 步骤6：构建前端
Write-Host "[步骤 6/7] 构建前端..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ 前端构建成功" -ForegroundColor Green
} else {
    Write-Host "  ✗ 前端构建失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host ""

# 步骤7：部署到 Cloudflare
Write-Host "[步骤 7/7] 部署到 Cloudflare Workers..." -ForegroundColor Yellow
& npx wrangler deploy
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ 部署成功！" -ForegroundColor Green
} else {
    Write-Host "  ✗ 部署失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host ""

# 完成
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🎉 部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "网站地址: https://evcharger.xjjsw0518.workers.dev" -ForegroundColor White
Write-Host "后台地址: https://evcharger.xjjsw0518.workers.dev/XUEJIAN-manage" -ForegroundColor White
Write-Host ""
Write-Host "验证步骤：" -ForegroundColor Yellow
Write-Host "  1. 打开网站，确认能正常访问" -ForegroundColor White
Write-Host "  2. 登录后台，修改一个设置（如品牌名称）" -ForegroundColor White
Write-Host "  3. 在另一台电脑或浏览器中打开网站" -ForegroundColor White
Write-Host "  4. 强制刷新（Ctrl+F5），确认修改已同步" -ForegroundColor White
Write-Host ""
Read-Host "按回车键退出"
