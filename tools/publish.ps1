# publish.ps1 —— 建 GitHub 远程仓库并推送 main（需已登录 gh CLI）
# 用法：.\\publish.ps1  [仓库名]
# 默认仓库名 castorice-site；可传参覆盖。
# 前提：先运行 .\\gh-login.ps1 完成 gh 登录。

$ErrorActionPreference = 'Stop'
param([string]$RepoName)
if (-not $RepoName) { $RepoName = 'castorice-site' }

$gh = 'C:\Program Files\GitHub CLI\gh.exe'
$git = 'C:\Program Files\Git\cmd\git.exe'
$base = Split-Path -Parent $PSScriptRoot   # website-shared
Set-Location $base

# 1) 确认已登录
& $gh auth status 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) {
    Write-Host "未登录，请先运行 .\\tools\\gh-login.ps1 完成登录。" -ForegroundColor Red
    exit 1
}

# 2) 建仓库（私有，避免泄露；如已有则跳过）
Write-Host "检查仓库 $RepoName ……" -ForegroundColor Cyan
$remotes = & $git remote -v 2>&1
if ($remotes -match 'origin') {
    Write-Host "已存在 origin 远程，跳过建仓。" -ForegroundColor Yellow
} else {
    & $gh repo create $RepoName --private --source . --remote origin --push 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) {
        # 仓库可能已存在：只加远程不 create
        & gh repo set-default --host github.com 2>&1 | Out-Null
        Write-Host "尝试仅添加 origin 远程……" -ForegroundColor Cyan
    }
}

# 3) 确保 main 分支并推送
& $git branch --show-current 2>&1 | Out-Host
& $git push -u origin main 2>&1 | Out-Host
Write-Host "`n完成。远程地址：" -ForegroundColor Green
& $git remote -v 2>&1 | Out-Host
