$ErrorActionPreference = "Stop"

$appName = "Birthday Block Mission"
$appDir = Join-Path $env:LOCALAPPDATA "BirthdayBlockMission"
$repoZip = "https://github.com/nenolinkdk/10ygreetwinmc/archive/refs/heads/main.zip"
$tempDir = Join-Path $env:TEMP "BirthdayBlockMissionInstall"
$sourceApp = Join-Path $PSScriptRoot "app"

Write-Host "Installing $appName..."

if (-not (Test-Path (Join-Path $sourceApp "index.html"))) {
    Write-Host "Downloading game files from GitHub..."
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force
    }
    New-Item -ItemType Directory -Path $tempDir | Out-Null

    $zip = Join-Path $tempDir "game.zip"
    Invoke-WebRequest -Uri $repoZip -OutFile $zip
    Expand-Archive -Path $zip -DestinationPath $tempDir -Force

    $sourceApp = Join-Path $tempDir "10ygreetwinmc-main\app"
}

if (-not (Test-Path (Join-Path $sourceApp "index.html"))) {
    throw "Could not find the game files."
}

if (Test-Path $appDir) {
    Remove-Item $appDir -Recurse -Force
}
New-Item -ItemType Directory -Path $appDir | Out-Null
Copy-Item -Path (Join-Path $sourceApp "*") -Destination $appDir -Recurse -Force

$launcher = Join-Path $appDir "Start-BirthdayBlockMission.cmd"
$indexFile = Join-Path $appDir "index.html"
Set-Content -Path $launcher -Encoding ASCII -Value @(
    "@echo off",
    "start """" ""$indexFile"""
)

$uninstaller = Join-Path $appDir "Uninstall-BirthdayBlockMission.cmd"
$desktopShortcut = Join-Path ([Environment]::GetFolderPath("Desktop")) "Birthday Block Mission.lnk"
$startMenuShortcut = Join-Path ([Environment]::GetFolderPath("Programs")) "Birthday Block Mission.lnk"
Set-Content -Path $uninstaller -Encoding ASCII -Value @(
    "@echo off",
    "echo Removing Birthday Block Mission...",
    "powershell -NoProfile -ExecutionPolicy Bypass -Command ""Remove-Item '$appDir' -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item '$desktopShortcut' -Force -ErrorAction SilentlyContinue; Remove-Item '$startMenuShortcut' -Force -ErrorAction SilentlyContinue""",
    "echo Done.",
    "pause"
)

$shell = New-Object -ComObject WScript.Shell
foreach ($target in @($desktopShortcut, $startMenuShortcut)) {
    $shortcut = $shell.CreateShortcut($target)
    $shortcut.TargetPath = $launcher
    $shortcut.WorkingDirectory = $appDir
    $shortcut.Description = $appName
    $shortcut.Save()
}

Write-Host ""
Write-Host "Installed successfully."
Write-Host "Starting $appName..."
Start-Process $indexFile
Write-Host ""
Write-Host "You can now start the game from the Desktop or Start menu."
Read-Host "Press Enter to close"
