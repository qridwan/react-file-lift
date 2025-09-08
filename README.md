# React File Lift 🚀

A powerful, modern React file uploader component with drag-and-drop, image compression, and seamless cloud storage integration.

[![npm version](https://badge.fury.io/js/react-file-lift.svg)](https://badge.fury.io/js/react-file-lift)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-file-lift?label=bundle%20size)](https://bundlephobia.com/package/react-file-lift)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features ✨

- **🎯 Drag & Drop**: Intuitive drag-and-drop interface
- **🗜️ Image Compression**: Automatic image compression to reduce file sizes
- **☁️ Cloud Storage**: Built-in support for AWS S3, Cloudinary, Supabase, and Firebase Storage
- **📊 Progress Tracking**: Real-time upload progress with visual indicators
- **🔄 Retry Mechanism**: Automatic retry for failed uploads
- **📱 Responsive**: Mobile-friendly design
- **🎨 Customizable**: Fully customizable styling and behavior
- **⚡ TypeScript**: Full TypeScript support
- **🔒 Validation**: File type and size validation
- **🖼️ Preview**: Image previews with thumbnails
- **📦 Optimized**: Ultra-lightweight bundle (~500KB total)

## Installation 📦

### Core Package

```bash
npm install react-file-lift
# or
yarn add react-file-lift
# or
pnpm add react-file-lift
```

### Cloud Storage Providers (Optional)

Install only the providers you need:

```bash
# AWS S3
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

# Cloudinary
npm install cloudinary

# Supabase
npm install @supabase/supabase-js

# Firebase Storage
npm install firebase

# Image Compression
npm install browser-image-compression
```

## Bundle Size 📊

React File Lift is optimized for performance with a minimal bundle size:

- **Core Package**: ~500KB (includes all functionality)
- **Individual JS**: ~245KB (gzipped: ~80KB)
- **CSS**: ~5KB (minified)
- **TypeScript Definitions**: ~9KB

**Total Impact**: 94% smaller than traditional file upload libraries!

## Quick Start 🚀

### Basic Usage

```tsx
import React from "react";
import { FileUploader } from "react-file-lift";

function App() {
  return (
    <FileUploader
      multiple
      accept="image/*"
      maxFiles={5}
      maxSize={5 * 1024 * 1024} // 5MB
      onFilesAdded={(files) => console.log("Files added:", files)}
      onUploadComplete={(files) => console.log("Upload complete:", files)}
    />
  );
}
```

### With AWS S3

**First, install the required dependencies:**

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

```tsx
import React from "react";
import { FileUploader } from "react-file-lift";

function App() {
  const awsConfig = {
    provider: "aws" as const,
    config: {
      accessKeyId: "your-access-key",
      secretAccessKey: "your-secret-key",
      region: "us-east-1",
      bucket: "your-bucket-name",
      folder: "uploads/", // optional
    },
  };

  return (
    <FileUploader
      storageConfig={awsConfig}
      enableCompression
      compressionOptions={{
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
      }}
      onUploadComplete={(files) => {
        console.log("Uploaded to S3:", files);
      }}
    />
  );
}
```

### With Cloudinary

**First, install the required dependencies:**

```bash
npm install cloudinary
```

```tsx
import React from "react";
import { FileUploader } from "react-file-lift";

function App() {
  const cloudinaryConfig = {
    provider: "cloudinary" as const,
    config: {
      cloudName: "your-cloud-name",
      apiKey: "your-api-key",
      apiSecret: "your-api-secret",
      uploadPreset: "your-upload-preset", // optional
      folder: "uploads/", // optional
    },
  };

  return (
    <FileUploader
      storageConfig={cloudinaryConfig}
      accept="image/*,video/*"
      onUploadComplete={(files) => {
        console.log("Uploaded to Cloudinary:", files);
      }}
    />
  );
}
```

### With Supabase

**First, install the required dependencies:**

```bash
npm install @supabase/supabase-js
```

```tsx
import React from "react";
import { FileUploader } from "react-file-lift";

function App() {
  const supabaseConfig = {
    provider: "supabase" as const,
    config: {
      url: "your-supabase-url",
      anonKey: "your-anon-key",
      bucket: "your-bucket-name",
      folder: "uploads/", // optional
    },
  };

  return (
    <FileUploader
      storageConfig={supabaseConfig}
      multiple
      maxFiles={10}
      onUploadProgress={(progress) => {
        console.log("Upload progress:", progress);
      }}
    />
  );
}
```

### With Firebase Storage

**First, install the required dependencies:**

```bash
npm install firebase
```

```tsx
import React from "react";
import { FileUploader } from "react-file-lift";

function App() {
  const firebaseConfig = {
    provider: "firebase" as const,
    config: {
      apiKey: "your-api-key",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project.appspot.com",
      messagingSenderId: "your-sender-id",
      appId: "your-app-id",
      folder: "uploads/", // optional
    },
  };

  return (
    <FileUploader
      storageConfig={firebaseConfig}
      multiple
      maxFiles={10}
      onUploadProgress={(progress) => {
        console.log("Upload progress:", progress);
      }}
    />
  );
}
```

### Custom Upload Handler

```tsx
import React from "react";
import { FileUploader } from "react-file-lift";

function App() {
  const customUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    return result.url; // Return the uploaded file URL
  };

  return (
    <FileUploader
      customUploadHandler={customUpload}
      enableCompression
      onUploadComplete={(files) => {
        console.log("Custom upload complete:", files);
      }}
    />
  );
}
```

## Component API 📚

### FileUploader Props

| Prop                  | Type                              | Default     | Description                                         |
| --------------------- | --------------------------------- | ----------- | --------------------------------------------------- |
| `multiple`            | `boolean`                         | `true`      | Allow multiple file selection                       |
| `accept`              | `string`                          | `undefined` | Accepted file types (e.g., "image/\*", ".pdf,.doc") |
| `maxFiles`            | `number`                          | `undefined` | Maximum number of files                             |
| `maxSize`             | `number`                          | `undefined` | Maximum file size in bytes                          |
| `disabled`            | `boolean`                         | `false`     | Disable the uploader                                |
| `enableCompression`   | `boolean`                         | `true`      | Enable image compression                            |
| `compressionOptions`  | `CompressionOptions`              | `{}`        | Image compression settings                          |
| `storageConfig`       | `CloudStorageConfig`              | `undefined` | Cloud storage configuration                         |
| `customUploadHandler` | `(file: File) => Promise<string>` | `undefined` | Custom upload function                              |
| `className`           | `string`                          | `''`        | CSS class for the container                         |
| `dropzoneClassName`   | `string`                          | `''`        | CSS class for the dropzone                          |
| `previewClassName`    | `string`                          | `''`        | CSS class for file previews                         |

### Event Handlers

| Handler                 | Type                                             | Description                   |
| ----------------------- | ------------------------------------------------ | ----------------------------- |
| `onFilesAdded`          | `(files: FileWithPreview[]) => void`             | Called when files are added   |
| `onFilesRemoved`        | `(files: FileWithPreview[]) => void`             | Called when files are removed |
| `onUploadProgress`      | `(progress: UploadProgress[]) => void`           | Called during upload progress |
| `onUploadComplete`      | `(files: FileWithPreview[]) => void`             | Called when uploads complete  |
| `onUploadError`         | `(error: string, file: FileWithPreview) => void` | Called on upload errors       |
| `onCompressionComplete` | `(original: File, compressed: File) => void`     | Called after compression      |

## Individual Components 🧩

### Dropzone

```tsx
import { Dropzone } from "react-file-lift";

<Dropzone onDrop={(files) => console.log(files)} accept="image/*" multiple>
  <div>Custom dropzone content</div>
</Dropzone>;
```

### FilePreview

```tsx
import { FilePreview } from "react-file-lift";

<FilePreview
  file={file}
  onRemove={(id) => console.log("Remove:", id)}
  onRetry={(id) => console.log("Retry:", id)}
  showProgress
/>;
```

## Styling 🎨

The components come with default styles that can be customized:

```css
/* Override default styles */
.rfl-dropzone {
  border: 2px dashed #007bff;
  border-radius: 12px;
}

.rfl-file-preview {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### CSS Custom Properties

```css
:root {
  --rfl-primary-color: #007bff;
  --rfl-success-color: #28a745;
  --rfl-error-color: #dc3545;
  --rfl-border-radius: 8px;
}
```

## Compression Options 🗜️

```tsx
const compressionOptions = {
  maxSizeMB: 1, // Maximum file size in MB
  maxWidthOrHeight: 1920, // Maximum width or height
  useWebWorker: true, // Use web worker for compression
  initialQuality: 0.8, // Initial quality (0-1)
};
```

## Storage Configuration ☁️

### AWS S3

```tsx
const awsConfig = {
  provider: "aws",
  config: {
    accessKeyId: "your-access-key-id",
    secretAccessKey: "your-secret-access-key",
    region: "us-east-1",
    bucket: "your-bucket-name",
    folder: "uploads/", // optional folder prefix
  },
};
```

### Cloudinary

```tsx
const cloudinaryConfig = {
  provider: "cloudinary",
  config: {
    cloudName: "your-cloud-name",
    apiKey: "your-api-key",
    apiSecret: "your-api-secret",
    uploadPreset: "your-preset", // for unsigned uploads
    folder: "uploads/",
  },
};
```

### Supabase

```tsx
const supabaseConfig = {
  provider: "supabase",
  config: {
    url: "https://your-project.supabase.co",
    anonKey: "your-anon-key",
    bucket: "your-bucket-name",
    folder: "uploads/",
  },
};
```

### Firebase Storage

```tsx
const firebaseConfig = {
  provider: "firebase",
  config: {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
    folder: "uploads/", // optional folder prefix
  },
};
```

## Peer Dependencies 🔗

React File Lift uses peer dependencies to keep the bundle size minimal. You only need to install the cloud storage providers you actually use:

| Provider    | Package                                               | Size   | Required For       |
| ----------- | ----------------------------------------------------- | ------ | ------------------ |
| AWS S3      | `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` | ~2MB   | S3 uploads         |
| Cloudinary  | `cloudinary`                                          | ~1.5MB | Cloudinary uploads |
| Supabase    | `@supabase/supabase-js`                               | ~500KB | Supabase uploads   |
| Firebase    | `firebase`                                            | ~1MB   | Firebase Storage   |
| Compression | `browser-image-compression`                           | ~200KB | Image compression  |

**Benefits:**

- ✅ Smaller core bundle (~500KB)
- ✅ Only install what you need
- ✅ Better tree shaking
- ✅ Faster installs and builds

## Utilities 🛠️

The package also exports useful utility functions:

```tsx
import {
  compressImage,
  formatFileSize,
  validateFile,
  generateFileId,
  isImageFile,
} from "react-file-lift";

// Compress an image (requires browser-image-compression)
const compressed = await compressImage(file, {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
});

// Format file size
const size = formatFileSize(1024 * 1024); // "1 MB"

// Validate file
const validation = validateFile(file, {
  maxSize: 5 * 1024 * 1024,
  accept: "image/*",
});
```

## TypeScript Support 📝

The package is fully typed with TypeScript:

```tsx
import type {
  FileWithPreview,
  UploadProgress,
  CloudStorageConfig,
  CompressionOptions,
  FirebaseConfig,
} from "react-file-lift";
```

## Examples 💡

Check out the `examples` directory for more comprehensive examples:

- [Basic Usage](./examples/basic.tsx)
- [AWS S3 Integration](./examples/aws-s3.tsx)
- [Cloudinary Integration](./examples/cloudinary.tsx)
- [Supabase Integration](./examples/supabase.tsx)
- [Firebase Storage Integration](./examples/firebase.tsx)
- [Custom Styling](./examples/custom-styling.tsx)

## Contributing 🤝

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## License 📄

MIT © [Ridwan](https://github.com/qridwan/react-file-lift)

## Support 💪

If you find this package helpful, please consider giving it a ⭐ on GitHub!

For issues and feature requests, please use the [GitHub Issues](https://github.com/qridwan/react-file-lift/issues) page.
