$ErrorActionPreference = 'Stop'

$settings = @{}
$ErrorActionPreference = 'Continue'
npx supabase status -o env 2>$null | ForEach-Object {
  if ($_ -match '^([^=]+)=(.*)$') {
    $settings[$matches[1].Trim()] = $matches[2].Trim().Trim('"').Trim("'")
  }
}
$ErrorActionPreference = 'Stop'

if (-not $settings['API_URL'] -or -not $settings['ANON_KEY']) {
  throw 'Supabase local no está iniciado. Ejecutá: npx supabase start'
}

$env:NEXT_PUBLIC_SUPABASE_URL = $settings['API_URL']
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY = $settings['ANON_KEY']

Write-Host "Iniciando Next.js contra Supabase local ($($settings['API_URL']))"
npx next dev --webpack
