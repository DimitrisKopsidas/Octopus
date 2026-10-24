# Seeding script for Windows PowerShell
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sqlFile = Join-Path $scriptDir "seed-test-data.sql"

Write-Host "Seeding Octopus database in Docker container 'octopus-dev-db-1'..." -ForegroundColor Cyan

if (-not (Test-Path $sqlFile)) {
    Write-Error "Could not find $sqlFile"
    exit 1
}

# Copy SQL file into postgres container to preserve UTF-8 encoding
docker cp $sqlFile octopus-dev-db-1:/tmp/seed-test-data.sql
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to copy seed SQL into docker container"
    exit 1
}

# Execute SQL in postgres
docker exec octopus-dev-db-1 psql -U postgres -d postgres -f /tmp/seed-test-data.sql
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to execute seed SQL"
    exit 1
}

Write-Host "`nSeeding completed successfully!" -ForegroundColor Green
Write-Host "10 Users created (all with password: password123)" -ForegroundColor Yellow
Write-Host "  - 2 Admins:   admin_alex, admin_eleni"
Write-Host "  - 3 Helpers:  helper_nikos, helper_maria, helper_kostas"
Write-Host "  - 5 Students: student_giannis, student_dimitra, student_petros, student_sofia, student_giorgos"
Write-Host "Each user has 5 completed tests (50 total bundles) across courses."
