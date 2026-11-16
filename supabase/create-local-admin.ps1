$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $projectRoot '.env.local'
$defaultEmail = 'admin.local@generalpaz.test'

$envLines = [System.Collections.Generic.List[string]]::new()
if (Test-Path -LiteralPath $envPath) {
  $envLines.AddRange([string[]](Get-Content -LiteralPath $envPath))
}

$localValues = @{}
foreach ($line in $envLines) {
  if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
    $localValues[$matches[1]] = $matches[2].Trim().Trim('"').Trim("'")
  }
}

$adminEmail = if ($localValues['LOCAL_ADMIN_EMAIL']) {
  $localValues['LOCAL_ADMIN_EMAIL']
} else {
  $defaultEmail
}

$adminPassword = if ($localValues['LOCAL_ADMIN_PASSWORD']) {
  $localValues['LOCAL_ADMIN_PASSWORD']
} else {
  $randomBytes = New-Object byte[] 24
  $randomGenerator = [Security.Cryptography.RandomNumberGenerator]::Create()
  try {
    $randomGenerator.GetBytes($randomBytes)
  } finally {
    $randomGenerator.Dispose()
  }
  ([BitConverter]::ToString($randomBytes)).Replace('-', '')
}

$updates = [ordered]@{
  LOCAL_ADMIN_EMAIL = $adminEmail
  LOCAL_ADMIN_PASSWORD = $adminPassword
}

$seen = @{}
for ($index = 0; $index -lt $envLines.Count; $index++) {
  foreach ($key in $updates.Keys) {
    if ($envLines[$index] -match "^\s*$key\s*=") {
      $envLines[$index] = "$key=$($updates[$key])"
      $seen[$key] = $true
      break
    }
  }
}

foreach ($key in $updates.Keys) {
  if (-not $seen[$key]) {
    $envLines.Add("$key=$($updates[$key])")
  }
}

[IO.File]::WriteAllLines(
  $envPath,
  $envLines,
  [Text.UTF8Encoding]::new($false)
)

$settings = @{}
$previousErrorActionPreference = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
$statusLines = & npx supabase status -o env 2>$null
$statusExitCode = $LASTEXITCODE
$ErrorActionPreference = $previousErrorActionPreference
if ($statusExitCode -ne 0) {
  throw 'Supabase local no esta iniciado. Ejecuta: npx supabase start'
}

foreach ($line in $statusLines) {
  if ($line -match '^([^=]+)=(.*)$') {
    $settings[$matches[1].Trim()] = $matches[2].Trim().Trim('"').Trim("'")
  }
}

if (-not $settings['API_URL'] -or -not $settings['ANON_KEY'] -or -not $settings['SERVICE_ROLE_KEY']) {
  throw 'No se pudieron obtener las credenciales del stack local de Supabase.'
}

$apiUri = [Uri]$settings['API_URL']
if ($apiUri.Scheme -ne 'http' -or $apiUri.Host -notin @('127.0.0.1', 'localhost', '::1')) {
  throw "Operacion cancelada: API_URL no es local ($($apiUri.GetLeftPart([UriPartial]::Authority)))."
}

$adminHeaders = @{
  apikey = $settings['SERVICE_ROLE_KEY']
  Authorization = "Bearer $($settings['SERVICE_ROLE_KEY'])"
  'Content-Type' = 'application/json'
}

$usersResponse = Invoke-RestMethod `
  -Method Get `
  -Uri "$($settings['API_URL'])/auth/v1/admin/users?page=1&per_page=1000" `
  -Headers $adminHeaders

$existingUser = $usersResponse.users | Where-Object { $_.email -eq $adminEmail } | Select-Object -First 1
$userPayload = @{
  email = $adminEmail
  password = $adminPassword
  email_confirm = $true
  user_metadata = @{ role = 'admin' }
  app_metadata = @{ role = 'admin' }
} | ConvertTo-Json -Depth 5

if ($existingUser) {
  $null = Invoke-RestMethod `
    -Method Patch `
    -Uri "$($settings['API_URL'])/auth/v1/admin/users/$($existingUser.id)" `
    -Headers $adminHeaders `
    -Body $userPayload
} else {
  $null = Invoke-RestMethod `
    -Method Post `
    -Uri "$($settings['API_URL'])/auth/v1/admin/users" `
    -Headers $adminHeaders `
    -Body $userPayload
}

$loginHeaders = @{
  apikey = $settings['ANON_KEY']
  'Content-Type' = 'application/json'
}
$loginPayload = @{
  email = $adminEmail
  password = $adminPassword
} | ConvertTo-Json

$session = Invoke-RestMethod `
  -Method Post `
  -Uri "$($settings['API_URL'])/auth/v1/token?grant_type=password" `
  -Headers $loginHeaders `
  -Body $loginPayload

if (-not $session.access_token) {
  throw 'El usuario fue creado, pero no se pudo verificar el inicio de sesion local.'
}

$adminCheck = Invoke-RestMethod `
  -Method Post `
  -Uri "$($settings['API_URL'])/rest/v1/rpc/is_admin" `
  -Headers @{
    apikey = $settings['ANON_KEY']
    Authorization = "Bearer $($session.access_token)"
    'Content-Type' = 'application/json'
  } `
  -Body '{}'

if ($adminCheck -ne $true) {
  throw 'El usuario inicia sesion, pero las politicas locales no lo reconocen como administrador.'
}

Write-Host 'Usuario administrador local creado o actualizado y verificado.'
Write-Host 'Credenciales guardadas en LOCAL_ADMIN_EMAIL y LOCAL_ADMIN_PASSWORD dentro de .env.local.'
Write-Host 'Para recrearlo luego de un reset local: npm run admin:local'
