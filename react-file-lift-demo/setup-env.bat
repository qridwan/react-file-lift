@echo off
echo Setting up React File Lift Demo Environment Variables...
echo.

REM Check if .env.local already exists
if exist .env.local (
    echo .env.local already exists!
    echo Do you want to overwrite it? (y/n)
    set /p choice=
    if /i "%choice%" neq "y" (
        echo Setup cancelled.
        pause
        exit /b
    )
)

REM Copy the example file to .env.local
copy env.example .env.local >nul

echo.
echo ✅ Environment file created: .env.local
echo.
echo 📝 Next steps:
echo 1. Open .env.local in your text editor
echo 2. Replace the placeholder values with your actual credentials
echo 3. Save the file
echo 4. Run 'npm start' to start the demo
echo.
echo 🔧 Cloud Storage Setup Guides:
echo   • AWS S3: https://docs.aws.amazon.com/s3/
echo   • Cloudinary: https://cloudinary.com/documentation
echo   • Supabase: https://supabase.com/docs/guides/storage
echo   • Firebase: https://firebase.google.com/docs/storage
echo.
pause
