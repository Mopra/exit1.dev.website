# Order a DigiCert Common Mark Certificate (CMC) for exit1.dev BIMI.
# Docs: https://dev.digicert.com/certcentral-apis/services-api/orders/order-common-mark-certificate-cmc.html
#
# Prerequisites:
#   1. DigiCert CertCentral account with API key (Settings > Account > API Keys).
#   2. A VALIDATED organization in CertCentral (you need its numeric Organization ID).
#   3. The logo must have been publicly displayed on a website for 12+ months (CMC prior-use rule).
#   4. CMC product enabled on the account + sufficient balance.
#
# Usage:
#   $env:DIGICERT_API_KEY = "<your-key>"
#   .\scripts\order-cmc.ps1 -OrgId 12345 -FirstName Morten -LastName Pradsgaard `
#       -Email mpg@optipeople.dk -Telephone "+45..." -JobTitle "Owner" -DryRun

param(
  [Parameter(Mandatory = $true)][int]$OrgId,
  [Parameter(Mandatory = $true)][string]$FirstName,
  [Parameter(Mandatory = $true)][string]$LastName,
  [Parameter(Mandatory = $true)][string]$Email,
  [Parameter(Mandatory = $true)][string]$Telephone,
  [string]$JobTitle = "Owner",
  [int]$Years = 1,
  [string]$LogoPath = "$PSScriptRoot\..\public\.well-known\bimi\logo.svg",
  [switch]$EnableHosting,   # let DigiCert host the .pem (recommended if you don't want to host it yourself)
  [switch]$DryRun           # print the request body and exit without calling the API
)

$ErrorActionPreference = "Stop"

if (-not $env:DIGICERT_API_KEY -and -not $DryRun) {
  throw "Set `$env:DIGICERT_API_KEY before running (or use -DryRun)."
}

# --- Encode the logo: gzip then base64 (the format the vmc.logo field requires) ---
$svgBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $LogoPath))
$ms = New-Object System.IO.MemoryStream
$gz = New-Object System.IO.Compression.GZipStream($ms, [System.IO.Compression.CompressionLevel]::Optimal)
$gz.Write($svgBytes, 0, $svgBytes.Length)
$gz.Close()
$logoB64 = [System.Convert]::ToBase64String($ms.ToArray())
Write-Host "Logo encoded: $($svgBytes.Length) raw bytes -> $($logoB64.Length) base64 chars"

# --- Build the order body ---
$body = @{
  certificate    = @{ dns_names = @("exit1.dev") }
  vmc            = @{
    logo           = $logoB64
    enable_hosting = if ($EnableHosting) { 1 } else { 0 }
  }
  organization   = @{
    id       = $OrgId
    contacts = @(
      @{
        contact_type = "verified_contact"
        first_name   = $FirstName
        last_name    = $LastName
        email        = $Email
        telephone    = $Telephone
        job_title    = $JobTitle
      }
    )
  }
  order_validity = @{ years = $Years }
  payment_method = "balance"
}

$json = $body | ConvertTo-Json -Depth 10

if ($DryRun) {
  Write-Host "`n--- DRY RUN: request body (logo truncated) ---"
  ($body.Clone()) | Out-Null
  $preview = $body | ConvertTo-Json -Depth 10
  Write-Host ($preview -replace [regex]::Escape($logoB64), ("{0}...[{1} chars]" -f $logoB64.Substring(0,24), $logoB64.Length))
  Write-Host "`n--- DRY RUN: no API call made. Re-run without -DryRun to submit. ---"
  return
}

# --- Submit ---
$resp = Invoke-RestMethod -Method Post `
  -Uri "https://www.digicert.com/services/v2/order/certificate/mark_certificate" `
  -Headers @{ "X-DC-DEVKEY" = $env:DIGICERT_API_KEY; "Content-Type" = "application/json" } `
  -Body $json

Write-Host "`n--- Order submitted ---"
$resp | ConvertTo-Json -Depth 10
