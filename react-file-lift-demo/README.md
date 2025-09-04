# React File Lift Demo

This is a comprehensive demo application showcasing all the features of the React File Lift package.

## 🚀 Quick Start

1. **Start the demo:**

   ```bash
   npm start
   ```

   Or double-click `start-demo.bat` on Windows.

2. **Open your browser** and go to: http://localhost:3000

## 🎯 Features Demonstrated

### Basic Features

- ✅ **Drag & Drop** file upload
- ✅ **Multiple file** selection
- ✅ **File validation** (type, size)
- ✅ **Progress tracking** in real-time
- ✅ **Error handling** and user feedback

### Advanced Features

- ✅ **Image compression** with configurable options
- ✅ **Cloud storage** integration:
  - AWS S3 with presigned URLs
  - Cloudinary with transformations
  - Supabase Storage
  - Firebase Storage
- ✅ **Custom styling** and theming
- ✅ **TypeScript** support

## 🔧 Configuration

### Quick Setup

Run the setup script to create your environment file:

**Windows (PowerShell):**

```powershell
powershell -ExecutionPolicy Bypass -File setup-env.ps1
```

**Windows (Command Prompt):**

```cmd
setup-env.bat
```

This will create a `.env.local` file with all the required environment variables.

### Manual Setup

To test cloud storage features, create a `.env.local` file in this directory:

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

## 📁 Project Structure

```
react-file-lift-demo/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.tsx          # Main demo component
│   ├── App.css          # Demo styles
│   ├── index.tsx        # React entry point
│   └── index.css        # Global styles
├── node_modules/
│   └── react-file-lift/ # Local copy of the built package
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Customization

The demo app shows how to:

- Import and use React File Lift components
- Configure different cloud storage providers
- Handle upload events and progress
- Style the components to match your design
- Set up TypeScript with proper types

## 🔗 Integration Examples

### Basic Usage

```tsx
import { FileUploader } from "react-file-lift";

<FileUploader
  multiple
  accept="image/*"
  onFilesAdded={(files) => console.log("Files added:", files)}
  onUploadComplete={(files) => console.log("Upload complete:", files)}
/>;
```

### With Cloud Storage

```tsx
import { FileUploader, CloudStorageConfig } from "react-file-lift";

const config: CloudStorageConfig = {
  provider: "aws",
  config: {
    accessKeyId: "your-key",
    secretAccessKey: "your-secret",
    region: "us-east-1",
    bucket: "your-bucket",
  },
};

<FileUploader
  storageConfig={config}
  multiple
  onUploadComplete={(files) => console.log("Uploaded to cloud:", files)}
/>;
```

### With Image Compression

```tsx
<FileUploader
  enableCompression
  compressionOptions={{
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }}
  onCompressionComplete={(original, compressed) => {
    console.log("Compressed:", original.size, "→", compressed.size);
  }}
/>
```

## 🐛 Troubleshooting

1. **Module not found errors**: Make sure the `react-file-lift` package is properly copied to `node_modules/`
2. **Cloud storage not working**: Check your environment variables and credentials
3. **TypeScript errors**: Ensure all dependencies are installed and types are available

## 📚 Learn More

- [React File Lift Documentation](../README.md)
- [API Reference](../src/types/index.ts)
- [Examples](../examples/)
