# Cloud Storage Setup Guide

This guide will help you set up credentials for each cloud storage provider supported by React File Lift.

## 🔐 AWS S3 Setup

### 1. Create an AWS Account

- Go to [AWS Console](https://aws.amazon.com/)
- Sign up for a free account (12 months free tier available)

### 2. Create S3 Bucket

- Navigate to S3 service in AWS Console
- Click "Create bucket"
- Choose a unique bucket name
- Select your preferred region
- Configure permissions (public read for demo purposes)

### 3. Create IAM User

- Go to IAM service in AWS Console
- Click "Users" → "Create user"
- Enable "Programmatic access"
- Attach policy: `AmazonS3FullAccess` (or create custom policy)
- Save the Access Key ID and Secret Access Key

### 4. Update .env.local

```env
REACT_APP_AWS_ACCESS_KEY_ID=AKIA...your_access_key
REACT_APP_AWS_SECRET_ACCESS_KEY=your_secret_key
REACT_APP_AWS_REGION=us-east-1
REACT_APP_AWS_BUCKET=your-bucket-name
```

## ☁️ Cloudinary Setup

### 1. Create Cloudinary Account

- Go to [Cloudinary](https://cloudinary.com/)
- Sign up for a free account

### 2. Get API Credentials

- After signup, you'll see your Cloud Name, API Key, and API Secret
- Go to Settings → Upload → Upload presets
- Create a new upload preset (unsigned for demo)

### 3. Update .env.local

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_API_KEY=123456789012345
REACT_APP_CLOUDINARY_API_SECRET=your_api_secret
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 🗄️ Supabase Setup

### 1. Create Supabase Project

- Go to [Supabase](https://supabase.com/)
- Sign up and create a new project
- Wait for project to be ready

### 2. Create Storage Bucket

- Go to Storage in your Supabase dashboard
- Click "New bucket"
- Name it (e.g., "uploads")
- Make it public for demo purposes

### 3. Get API Keys

- Go to Settings → API
- Copy your Project URL and anon/public key

### 4. Update .env.local

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
REACT_APP_SUPABASE_BUCKET=uploads
```

## 🔥 Firebase Setup

### 1. Create Firebase Project

- Go to [Firebase Console](https://console.firebase.google.com/)
- Click "Create a project"
- Follow the setup wizard

### 2. Enable Storage

- Go to Storage in your Firebase project
- Click "Get started"
- Choose "Start in test mode" for demo
- Select your preferred region

### 3. Get Web App Config

- Go to Project Settings → General
- Scroll down to "Your apps"
- Click "Add app" → Web (</>) icon
- Register your app and copy the config

### 4. Update .env.local

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyC...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 🧪 Testing Your Setup

1. **Start the demo:**

   ```bash
   npm start
   ```

2. **Check configuration status:**

   - Each cloud storage section will show ✅ if configured
   - ⚠️ if credentials are missing

3. **Test uploads:**
   - Try uploading a small image file
   - Check your cloud storage dashboard for uploaded files

## 🔒 Security Notes

- **Never commit `.env.local` to version control**
- Use environment-specific credentials for production
- Consider using IAM roles instead of access keys for AWS
- Set up proper CORS policies for your storage buckets
- Use signed URLs for sensitive file access

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors:**

   - Configure CORS policy on your S3 bucket
   - Add your domain to Cloudinary allowed origins

2. **Permission Denied:**

   - Check IAM permissions for AWS
   - Verify bucket policies and ACLs
   - Ensure Firebase Storage rules allow uploads

3. **Invalid Credentials:**
   - Double-check your environment variables
   - Ensure no extra spaces or quotes
   - Restart the development server after changes

### Getting Help

- Check the browser console for detailed error messages
- Verify your credentials in the respective cloud console
- Test with a simple file upload first
