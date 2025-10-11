param(
    [switch]$RecreateVenv
)

$ErrorActionPreference = 'Stop'

Write-Host "==> Starting backend (FastAPI) locally" -ForegroundColor Cyan

# Resolve project root (this script's directory)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

$venvPath = Join-Path $ScriptDir ".venv"
$pythonExe = if (Test-Path (Join-Path $venvPath "Scripts/python.exe")) { 
    Join-Path $venvPath "Scripts/python.exe"
} else {
    "python"
}

if ($RecreateVenv -and (Test-Path $venvPath)) {
    Write-Host "Removing existing venv..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $venvPath
}

if (-not (Test-Path (Join-Path $venvPath "Scripts/Activate.ps1"))) {
    Write-Host "Creating virtual environment at $venvPath" -ForegroundColor Cyan
    & $pythonExe -m venv $venvPath
}

Write-Host "Activating virtual environment" -ForegroundColor Cyan
. "$venvPath\Scripts\Activate.ps1"

Write-Host "Installing dependencies from requirements.txt" -ForegroundColor Cyan
pip install --upgrade pip
pip install -r requirements.txt

Write-Host "Launching Uvicorn: main:app (reload)" -ForegroundColor Green
uvicorn main:app --reload --host 127.0.0.1 --port 8000