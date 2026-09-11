@echo off
echo ==========================================================
echo  Deploying Wolfson Friends Medical Center Website to GCP
echo  Project: wolfsonfriends
echo  Region:  me-west1 (Tel Aviv)
echo ==========================================================

powershell -ExecutionPolicy Bypass -File "%~dp0deploy-gcp.ps1"
pause
