Set-Location 'C:\Users\USER\OneDrive\Desktop\ktrefill'
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://127.0.0.1:8000/')
$listener.Start()
Write-Host 'Preview server running at http://127.0.0.1:8000/'

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $requestPath = $context.Request.Url.AbsolutePath
    if ($requestPath -eq '/' -or $requestPath -eq '') {
        $requestPath = '/index.html'
    }

    $relativePath = $requestPath.TrimStart('/')
    $filePath = Join-Path (Get-Location) $relativePath

    if (-not (Test-Path $filePath -PathType Leaf)) {
        $filePath = Join-Path (Get-Location) 'index.html'
    }

    if (Test-Path $filePath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $extension = [System.IO.Path]::GetExtension($filePath)
        $mime = switch ($extension) {
            '.html' { 'text/html; charset=utf-8' }
            '.css' { 'text/css; charset=utf-8' }
            '.js' { 'application/javascript; charset=utf-8' }
            '.svg' { 'image/svg+xml' }
            '.png' { 'image/png' }
            '.jpg' { 'image/jpeg' }
            '.jpeg' { 'image/jpeg' }
            default { 'application/octet-stream' }
        }

        $context.Response.ContentType = $mime
        $context.Response.ContentLength64 = $bytes.Length
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    else {
        $body = [System.Text.Encoding]::UTF8.GetBytes('File not found')
        $context.Response.StatusCode = 404
        $context.Response.ContentType = 'text/plain; charset=utf-8'
        $context.Response.ContentLength64 = $body.Length
        $context.Response.OutputStream.Write($body, 0, $body.Length)
    }

    $context.Response.Close()
}
