Set-Location 'C:\Users\USER\OneDrive\Desktop\ktrefill'
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://127.0.0.1:8000/')
$listener.Start()
Write-Host 'Preview server running at http://127.0.0.1:8000/'

$reloadlyClientId = $env:RELOADLY_CLIENT_ID
if (-not $reloadlyClientId) {
    $reloadlyClientId = 'H6KbktQKut6yCIKTApt9LMrxgZuk0GHS'
}
$reloadlyClientSecret = $env:RELOADLY_CLIENT_SECRET
if (-not $reloadlyClientSecret) {
    $reloadlyClientSecret = '0yopzY6UnO-j0ovKpgsEvzjIGOsoOm-LK9fMffQPQ62Hogj0SB5eUbpEXYaiTaM'
}
$reloadlyAudience = $env:RELOADLY_AUDIENCE
if (-not $reloadlyAudience) {
    $reloadlyAudience = 'https://topups.reloadly.com'
}
$reloadlyTokenUrl = $env:RELOADLY_TOKEN_URL
if (-not $reloadlyTokenUrl) {
    $reloadlyTokenUrl = 'https://auth.reloadly.com/oauth/token'
}
$reloadlyApiBase = $env:RELOADLY_API_BASE
if (-not $reloadlyApiBase) {
    $reloadlyApiBase = 'https://topups.reloadly.com'
}

function Write-JsonResponse {
    param(
        [System.Net.HttpListenerContext]$Context,
        [int]$StatusCode,
        $Payload
    )

    $json = $Payload | ConvertTo-Json -Depth 10 -Compress
    $body = [System.Text.Encoding]::UTF8.GetBytes($json)
    $Context.Response.StatusCode = $StatusCode
    $Context.Response.ContentType = 'application/json; charset=utf-8'
    $Context.Response.Headers['Access-Control-Allow-Origin'] = '*'
    $Context.Response.Headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    $Context.Response.Headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,Accept'
    $Context.Response.ContentLength64 = $body.Length
    $Context.Response.OutputStream.Write($body, 0, $body.Length)
}

function Get-ReloadlyToken {
    $body = [pscustomobject]@{
        client_id = $reloadlyClientId
        client_secret = $reloadlyClientSecret
        grant_type = 'client_credentials'
        audience = $reloadlyAudience
    } | ConvertTo-Json -Compress

    try {
        return Invoke-RestMethod -Method Post -Uri $reloadlyTokenUrl -ContentType 'application/json' -Body $body
    }
    catch {
        return $null
    }
}

function Get-LiveIpAddress {
    try {
        $response = Invoke-RestMethod -Method Get -Uri 'https://api.ipify.org?format=json' -ErrorAction Stop
        return $response.ip
    }
    catch {
        return $null
    }
}

function Get-LiveLocationData {
    $ipAddress = Get-LiveIpAddress

    try {
        $locationResponse = Invoke-RestMethod -Method Get -Uri 'https://ipinfo.io/json' -ErrorAction Stop
        return [pscustomobject]@{
            ip = $ipAddress
            city = $locationResponse.city
            region = $locationResponse.region
            country = $locationResponse.country
            country_name = $locationResponse.country
            country_code = $locationResponse.country
            postal = ''
            timezone = $locationResponse.timezone
        }
    }
    catch {
        try {
            $fallbackResponse = Invoke-RestMethod -Method Get -Uri 'https://ipwho.is/' -ErrorAction Stop
            return [pscustomobject]@{
                ip = $ipAddress
                city = $fallbackResponse.city
                region = $fallbackResponse.region
                country = $fallbackResponse.country
                country_name = $fallbackResponse.country
                country_code = $fallbackResponse.country_code
                postal = $fallbackResponse.postal
                timezone = $fallbackResponse.timezone
            }
        }
        catch {
            return [pscustomobject]@{
                ip = $ipAddress
                city = 'Location unavailable'
                region = ''
                country = ''
                country_name = 'Location unavailable'
                country_code = ''
                postal = ''
                timezone = ''
            }
        }
    }
}

function Invoke-ReloadlyProxy {
    param(
        [System.Net.HttpListenerContext]$Context,
        [string]$Route,
        [string]$QueryString = ''
    )

    $tokenData = Get-ReloadlyToken
    if (-not $tokenData) {
        Write-JsonResponse -Context $Context -StatusCode 502 -Payload ([pscustomobject]@{ error = 'Unable to obtain Reloadly token' })
        return
    }

    $token = $tokenData.access_token
    if (-not $token) {
        Write-JsonResponse -Context $Context -StatusCode 502 -Payload ([pscustomobject]@{ error = 'Reloadly token missing' })
        return
    }

    $uri = "${reloadlyApiBase}${Route}${QueryString}"
    try {
        $response = Invoke-RestMethod -Method Get -Uri $uri -Headers @{ Authorization = "Bearer $token" } -ContentType 'application/json'
        Write-JsonResponse -Context $Context -StatusCode 200 -Payload $response
    }
    catch {
        Write-JsonResponse -Context $Context -StatusCode 502 -Payload ([pscustomobject]@{ error = 'Reloadly request failed'; detail = $_.Exception.Message })
    }
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $requestPath = $context.Request.Url.AbsolutePath
    $queryString = $context.Request.Url.Query

    if ($context.Request.HttpMethod -eq 'OPTIONS') {
        Write-JsonResponse -Context $context -StatusCode 204 -Payload ([pscustomobject]@{})
        $context.Response.Close()
        continue
    }

    if ($requestPath -eq '/api/ip' -and $context.Request.HttpMethod -eq 'GET') {
        Write-JsonResponse -Context $context -StatusCode 200 -Payload ([pscustomobject]@{ ip = Get-LiveIpAddress })
        $context.Response.Close()
        continue
    }

    if ($requestPath -eq '/api/location' -and $context.Request.HttpMethod -eq 'GET') {
        Write-JsonResponse -Context $context -StatusCode 200 -Payload (Get-LiveLocationData)
        $context.Response.Close()
        continue
    }

    if ($requestPath -eq '/api/reloadly/token' -and $context.Request.HttpMethod -eq 'POST') {
        $bodyText = [System.IO.StreamReader]::new($context.Request.InputStream, [System.Text.Encoding]::UTF8).ReadToEnd()
        $payload = @{}
        if ($bodyText) {
            try { $payload = $bodyText | ConvertFrom-Json -ErrorAction SilentlyContinue } catch { $payload = @{} }
        }

        if ($payload.audience) {
            $reloadlyAudience = $payload.audience
        }

        $tokenData = Get-ReloadlyToken
        if ($tokenData) {
            Write-JsonResponse -Context $context -StatusCode 200 -Payload $tokenData
        }
        else {
            Write-JsonResponse -Context $context -StatusCode 502 -Payload ([pscustomobject]@{ error = 'Unable to obtain Reloadly token' })
        }

        $context.Response.Close()
        continue
    }

    if ($requestPath -eq '/api/reloadly' -or $requestPath -like '/api/reloadly/*') {
        $route = $requestPath -replace '^/api/reloadly', ''
        if (-not $route -or $route -eq '/') {
            $route = '/'
        }

        Invoke-ReloadlyProxy -Context $context -Route $route -QueryString $queryString
        $context.Response.Close()
        continue
    }

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
