@echo off
echo ==========================================================
echo  Deploying Wolfson Friends Medical Center Website to GCP
echo  Project: wolfsonfriends
echo  Region:  europe-west1 (wolfsonfriends.com)
echo ==========================================================

powershell -ExecutionPolicy Bypass -File "%~dp0deploy-gcp.ps1"
pause
