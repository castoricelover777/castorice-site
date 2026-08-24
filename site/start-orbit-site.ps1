$ErrorActionPreference = 'Stop'
$siteRoot = 'C:\Users\Admin1\Documents\Codex\2026-08-23\w'
$python = 'C:\Users\Admin1\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'

$portInUse = Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue
if (-not $portInUse) {
  Start-Process -FilePath $python -ArgumentList '-m','http.server','4173','--bind','127.0.0.1' -WorkingDirectory $siteRoot -WindowStyle Hidden
}
