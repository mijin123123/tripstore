$files = @(
    "C:\Users\hjune\tripstore\src\app\api\notices\[id]\route.js",
    "C:\Users\hjune\tripstore\src\app\api\packages\[id]\route.js",
    "C:\Users\hjune\tripstore\src\app\api\reservations\[id]\route.js"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $content = $content -replace 'checkAdminPermission\(', 'checkAdminPermissionServer('
        Set-Content $file $content -NoNewline
        Write-Host "Updated: $file"
    } else {
        Write-Host "File not found: $file"
    }
}
