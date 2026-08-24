# gh-login.ps1 —— 一键登录 GitHub CLI（浏览器授权，不接触密码）
# 用法：右键"使用 PowerShell 运行"，或在本目录 PowerShell 执行 .\gh-login.ps1
# 前提：已用 winget 安装 gh CLI（C:\Program Files\GitHub CLI\gh.exe）

$ErrorActionPreference = 'Stop'
$gh = 'C:\Program Files\GitHub CLI\gh.exe'
if (-not (Test-Path $gh)) {
    Write-Host "未找到 gh CLI，请先安装：winget install --id GitHub.cli" -ForegroundColor Red
    exit 1
}

Write-Host "正在检查是否已登录……" -ForegroundColor Cyan
& $gh auth status 2>&1 | Out-Host
if ($LASTEXITCODE -eq 0) {
    Write-Host "已登录，无需重复操作。" -ForegroundColor Green
    exit 0
}

Write-Host "`n开始登录 GitHub（请在浏览器完成授权）。" -ForegroundColor Yellow
Write-Host "选项选择：GitHub.com  ->  HTTPS  ->  用浏览器登录" -ForegroundColor Gray
# -h github.com  --git-protocol https  -w 使用浏览器 Web 授权（安全，不输入密码到本机）
& $gh auth login --hostname github.com --git-protocol https --web --scopes repo,workflow

Write-Host "`n登录完成，验证……" -ForegroundColor Cyan
& $gh auth status 2>&1 | Out-Host
Write-Host "`n完成。现在可让 DSH 建 GitHub 仓库并推送。" -ForegroundColor Green
