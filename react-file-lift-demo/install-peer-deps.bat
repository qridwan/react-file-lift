@echo off
echo Installing peer dependencies for React File Lift Demo...
echo.

echo Installing AWS SDK...
call npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
if %errorlevel% neq 0 (
    echo Failed to install AWS SDK
    pause
    exit /b 1
)

echo Installing Cloudinary...
call npm install cloudinary
if %errorlevel% neq 0 (
    echo Failed to install Cloudinary
    pause
    exit /b 1
)

echo Installing Supabase...
call npm install @supabase/supabase-js
if %errorlevel% neq 0 (
    echo Failed to install Supabase
    pause
    exit /b 1
)

echo Installing Firebase...
call npm install firebase
if %errorlevel% neq 0 (
    echo Failed to install Firebase
    pause
    exit /b 1
)

echo Installing Image Compression...
call npm install browser-image-compression
if %errorlevel% neq 0 (
    echo Failed to install browser-image-compression
    pause
    exit /b 1
)

echo.
echo All peer dependencies installed successfully!
echo You can now run: npm start
pause
