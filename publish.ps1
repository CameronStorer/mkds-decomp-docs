param([string]$SourceDirectory = (Split-Path $PSScriptRoot -Parent))
$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    python sync.py --source $SourceDirectory
    if ($LASTEXITCODE -ne 0) { throw 'Documentation sync failed.' }
    $pythonExe = Join-Path $PSScriptRoot '.venv/Scripts/python.exe'
    if (!(Test-Path $pythonExe)) { $pythonExe = 'python' }
    & $pythonExe build.py
    if ($LASTEXITCODE -ne 0) { throw 'Site validation failed.' }
    git add -- content
    git diff --cached --quiet
    if ($LASTEXITCODE -eq 0) { Write-Output 'No documentation changes.'; return }
    git commit -m 'Update decompilation documentation snapshot'
    if ($LASTEXITCODE -ne 0) { throw 'Commit failed.' }
    git push
    if ($LASTEXITCODE -ne 0) { throw 'Push failed.' }
} finally { Pop-Location }
