# ============================================================================
# Smart Inventory Management System - Automated DB Setup Script (PowerShell)
# ============================================================================
param (
    [string]$DbUser = "postgres",
    [string]$DbName = "smart_inventory",
    [string]$DbHost = "localhost",
    [string]$DbPort = "5432"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SMART INVENTORY - DBMS EXPERIENTIAL LEARNING SETUP      " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Locate psql executable
$psqlPath = "psql"
if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
    if (Test-Path "C:\Program Files\PostgreSQL\18\bin\psql.exe") {
        $psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
    } elseif (Test-Path "C:\Program Files\PostgreSQL\17\bin\psql.exe") {
        $psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
    } elseif (Test-Path "C:\Program Files\PostgreSQL\16\bin\psql.exe") {
        $psqlPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"
    }
}

Write-Host "[1/5] Creating Database '$DbName'..." -ForegroundColor Yellow
& $psqlPath -U $DbUser -h $DbHost -p $DbPort -d postgres -c "CREATE DATABASE $DbName;" 2>$null

Write-Host "[2/5] Executing 01_schema_ddl.sql..." -ForegroundColor Yellow
& $psqlPath -U $DbUser -h $DbHost -p $DbPort -d $DbName -f "$PSScriptRoot\01_schema_ddl.sql"

Write-Host "[3/5] Executing 02_indexes_and_views.sql..." -ForegroundColor Yellow
& $psqlPath -U $DbUser -h $DbHost -p $DbPort -d $DbName -f "$PSScriptRoot\02_indexes_and_views.sql"

Write-Host "[4/5] Executing 03_triggers_and_procedures.sql..." -ForegroundColor Yellow
& $psqlPath -U $DbUser -h $DbHost -p $DbPort -d $DbName -f "$PSScriptRoot\03_triggers_and_procedures.sql"

Write-Host "[5/5] Executing 04_seed_data.sql..." -ForegroundColor Yellow
& $psqlPath -U $DbUser -h $DbHost -p $DbPort -d $DbName -f "$PSScriptRoot\04_seed_data.sql"

Write-Host ""
Write-Host " Database initialized successfully with all tables, constraints, views, and seed data!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
