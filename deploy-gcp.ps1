# Google Cloud Run Deployment Script for FWMC Website
# Project: oia-anti (or customized)
# Region: europe-west1 (Primary production mapped to wolfsonfriends.com)

param (
    [string]$ProjectId = "wolfsonfriends",
    [string]$ServiceName = "fwmc-friends-site",
    [string]$Region = "europe-west1"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Deploying Wolfson Friends Medical Center Website to GCP  " -ForegroundColor Green
Write-Host " Project:     $ProjectId" -ForegroundColor Yellow
Write-Host " Service:     $ServiceName" -ForegroundColor Yellow
Write-Host " Region:      $Region (europe-west1 - wolfsonfriends.com)" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Set active project
Write-Host "`n[1/3] Configuring Google Cloud project..." -ForegroundColor Cyan
gcloud config set project $ProjectId

# Enable Cloud Run & Cloud Build APIs if needed
Write-Host "`n[2/3] Ensuring required GCP APIs are enabled..." -ForegroundColor Cyan
gcloud services enable run.googleapis.com cloudbuild.googleapis.com --project $ProjectId

# Deploy to Cloud Run from source
Write-Host "`n[3/3] Building and deploying container to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $ServiceName `
    --source . `
    --platform managed `
    --region $Region `
    --allow-unauthenticated `
    --project $ProjectId

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n==========================================================" -ForegroundColor Green
    Write-Host " DEPLOYMENT SUCCESSFUL! " -ForegroundColor Green
    Write-Host " Your site is live on Google Cloud with HTTPS!" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
} else {
    Write-Host "`nDeployment encountered an error. Please check the logs above." -ForegroundColor Red
}
