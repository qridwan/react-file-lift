# Quick Start Guide 🚀

Get up and running with React File Lift in minutes!

## Installation

```bash
npm install react-file-lift
```

## Basic Usage

### 1. Simple File Uploader

```tsx
import React from "react";
import { FileUploader } from "react-file-lift";

function App() {
  return (
    <FileUploader
      onFilesAdded={(files) => console.log("Files added:", files)}
      onUploadComplete={(files) => console.log("Upload complete:", files)}
    />
  );
}
```

### 2. With Image Compression

```tsx
import { FileUploader } from "react-file-lift";

<FileUploader
  accept="image/*"
  enableCompression
  compressionOptions={{
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
  }}
  onCompressionComplete={(original, compressed) => {
    console.log("Compressed:", original.size, "→", compressed.size);
  }}
/>;
```

### 3. Upload to Cloud Storage

#### AWS S3

```tsx
const awsConfig = {
  provider: "aws",
  config: {
    accessKeyId: "your-key",
    secretAccessKey: "your-secret",
    region: "us-east-1",
    bucket: "your-bucket",
  },
};

<FileUploader storageConfig={awsConfig} />;
```

#### Cloudinary

```tsx
const cloudinaryConfig = {
  provider: "cloudinary",
  config: {
    cloudName: "your-cloud",
    apiKey: "your-key",
    apiSecret: "your-secret",
  },
};

<FileUploader storageConfig={cloudinaryConfig} />;
```

#### Supabase

```tsx
const supabaseConfig = {
  provider: "supabase",
  config: {
    url: "your-supabase-url",
    anonKey: "your-anon-key",
    bucket: "your-bucket",
  },
};

<FileUploader storageConfig={supabaseConfig} />;
```

### 4. Custom Upload Handler

```tsx
const customUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  return result.url;
};

<FileUploader customUploadHandler={customUpload} />;
```

## Common Props

| Prop                  | Type     | Description                   |
| --------------------- | -------- | ----------------------------- |
| `multiple`            | boolean  | Allow multiple files          |
| `accept`              | string   | File types (e.g., "image/\*") |
| `maxFiles`            | number   | Maximum file count            |
| `maxSize`             | number   | Max file size in bytes        |
| `enableCompression`   | boolean  | Enable image compression      |
| `storageConfig`       | object   | Cloud storage config          |
| `customUploadHandler` | function | Custom upload function        |

## Event Handlers

```tsx
<FileUploader
  onFilesAdded={(files) => console.log("Added:", files)}
  onUploadProgress={(progress) => console.log("Progress:", progress)}
  onUploadComplete={(files) => console.log("Complete:", files)}
  onUploadError={(error, file) => console.error("Error:", error)}
/>
```

## Styling

```css
/* Override default styles */
.rfl-dropzone {
  border: 2px dashed #007bff;
  border-radius: 12px;
}

.rfl-file-preview {
  background: #f8f9fa;
  border-radius: 8px;
}
```

## Next Steps

- Check out the [examples](./examples/) folder for more detailed implementations
- Read the full [README.md](./README.md) for comprehensive documentation
- Explore the [TypeScript types](./src/types/index.ts) for advanced usage

Happy uploading! 🎉
