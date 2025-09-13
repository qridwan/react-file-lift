# React File Lift Demo

This is a comprehensive demo application showcasing the `react-file-lift` package with all its features including cloud storage integrations and image compression.

## Features Demonstrated

- **Basic File Upload**: Drag-and-drop file upload with validation
- **Image Compression**: Automatic image compression with configurable options
- **Cloud Storage Integration**:
  - AWS S3
  - Cloudinary
  - Supabase Storage
  - Firebase Storage
- **Peer Dependency Management**: Dynamic loading of optional dependencies
- **Real-time Status**: Live status indicators for all features

## Quick Start

### Option 1: Use the batch script (Windows)

```bash
install-peer-deps.bat
npm start
```

### Option 2: Use npm scripts

```bash
# Install all dependencies including peer dependencies
npm run setup

# Start the demo
npm start
```

### Option 3: Manual installation

```bash
# Install basic dependencies
npm install

# Install peer dependencies
npm run install:peer-deps

# Start the demo
npm start
```

## Configuration

To test cloud storage features, create a `.env` file in this directory with your credentials:

```env
# AWS S3 Configuration
REACT_APP_AWS_ACCESS_KEY_ID=your_aws_access_key_id
REACT_APP_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
REACT_APP_AWS_REGION=us-east-1
REACT_APP_AWS_BUCKET=your-s3-bucket-name

# Cloudinary Configuration
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_API_KEY=your_api_key
REACT_APP_CLOUDINARY_API_SECRET=your_api_secret
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_SUPABASE_BUCKET=your-storage-bucket

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

## Dependencies

This demo uses peer dependencies that need to be installed separately:

- `@aws-sdk/client-s3` & `@aws-sdk/s3-request-presigner` - AWS S3 support
- `cloudinary` - Cloudinary integration
- `@supabase/supabase-js` - Supabase Storage support
- `firebase` - Firebase Storage support
- `browser-image-compression` - Image compression functionality

**Note**: The demo app will work without these dependencies, but cloud storage and compression features will be disabled. Install them to test all features.

## What You'll See

1. **Peer Dependencies Status**: Real-time status of all optional dependencies
2. **Basic Upload**: Test basic file upload functionality
3. **Image Compression**: Upload images to see compression in action
4. **Cloud Storage Demos**: Test each cloud provider (requires configuration)
5. **Uploaded Files**: View all uploaded files with their status and URLs

## Troubleshooting

- If a cloud storage provider shows as "not installed", the peer dependency is missing
- If configuration shows as "not configured", check your `.env` file
- All features work independently - you can test basic upload without any cloud configuration

## Development

This demo app uses Create React App and includes:

- TypeScript support
- Modern React hooks
- Responsive design
- Real-time status updates
- Error handling and user feedback
