$ErrorActionPreference = 'Stop'

$projectEnv = @{}
Get-Content -LiteralPath '.env.local' | ForEach-Object {
  if ($_ -match '^([^#=]+)=(.*)$') {
    $projectEnv[$matches[1].Trim()] = $matches[2].Trim().Trim('"').Trim("'")
  }
}

$localEnv = @{}
$ErrorActionPreference = 'Continue'
npx supabase status -o env 2>$null | ForEach-Object {
  if ($_ -match '^([^=]+)=(.*)$') {
    $localEnv[$matches[1].Trim()] = $matches[2].Trim().Trim('"').Trim("'")
  }
}
$ErrorActionPreference = 'Stop'

$sourceUrl = $projectEnv['NEXT_PUBLIC_SUPABASE_URL'].TrimEnd('/')
$sourceKey = $projectEnv['NEXT_PUBLIC_SUPABASE_ANON_KEY']
$localUrl = $localEnv['API_URL'].TrimEnd('/')
$localKey = $localEnv['SERVICE_ROLE_KEY']

if (-not $sourceUrl -or -not $sourceKey -or -not $localUrl -or -not $localKey) {
  throw 'No se pudieron resolver las credenciales públicas de origen o las credenciales del stack local.'
}

$readHeaders = @{ apikey = $sourceKey; Authorization = "Bearer $sourceKey" }
$writeHeaders = @{
  apikey = $localKey
  Authorization = "Bearer $localKey"
  Prefer = 'resolution=merge-duplicates,return=minimal'
}

$tables = @(
  'news',
  'news_attachments',
  'authorities',
  'services',
  'regulations',
  'contact_info',
  'site_settings',
  'public_works',
  'tramites',
  'area_resenas',
  'events'
)

foreach ($table in $tables) {
  $rows = Invoke-RestMethod -Uri "$sourceUrl/rest/v1/$table`?select=*" -Headers $readHeaders -Method Get
  $count = @($rows).Count
  if ($count -gt 0) {
    $body = @($rows) | ConvertTo-Json -Depth 20 -Compress
    $target = "$localUrl/rest/v1/$table"
    if ($table -eq 'site_settings') {
      $target += '?on_conflict=key'
    }
    Invoke-RestMethod -Uri $target -Headers $writeHeaders -Method Post -ContentType 'application/json' -Body $body | Out-Null
  }
  Write-Host "$table=$count"
}

Write-Host 'Sincronización finalizada. El origen se consultó únicamente con la clave pública anónima.'
