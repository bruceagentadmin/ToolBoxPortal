$startupFolder = [System.IO.Path]::Combine($env:APPDATA, "Microsoft\Windows\Start Menu\Programs\Startup")
$shortcutPath = [System.IO.Path]::Combine($startupFolder, "ToolBoxPortalDev.lnk")
$targetPath = "d:\Bruce\Coding\Lab\ToolBoxPortal\scripts\dev-startup.bat"
$workingDir = "d:\Bruce\Coding\Lab\ToolBoxPortal"

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetPath
$shortcut.WorkingDirectory = $workingDir
$shortcut.Save()

Write-Host "Shortcut created at: $shortcutPath" -ForegroundColor Green
