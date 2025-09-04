Write-Host "Setting up React File Lift Demo Environment Variables..." -ForegroundColor Green
Write-Host ""

# Check if .env.local already exists
if (Test-Path ".env.local") {
    Write-Host ".env.local already exists!" -ForegroundColor Yellow
    $choice = Read-Host "Do you want to overwrite it? (y/n)"
    if ($choice -ne "y" -and $choice -ne "Y") {
        Write-Host "Setup cancelled." -ForegroundColor Red
        exit
    }
}

# Copy the example file to .env.local
Copy-Item "env.example" ".env.local" -Force

Write-Host ""
Write-Host "✅ Environment file created: .env.local" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Open .env.local in your text editor"
Write-Host "2. Replace the placeholder values with your actual credentials"
Write-Host "3. Save the file"
Write-Host "4. Run 'npm start' to start the demo"
Write-Host ""
Write-Host "🔧 Cloud Storage Setup Guides:" -ForegroundColor Cyan
Write-Host "  • AWS S3: https://docs.aws.amazon.com/s3/"
Write-Host "  • Cloudinary: https://cloudinary.com/documentation"
Write-Host "  • Supabase: https://supabase.com/docs/guides/storage"
Write-Host "  • Firebase: https://firebase.google.com/docs/storage"
Write-Host ""
Read-Host "Press Enter to continue"
