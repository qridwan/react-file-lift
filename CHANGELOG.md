# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added

- Initial release of React File Lift
- Drag and drop file uploader component
- Support for multiple cloud storage providers:
  - AWS S3
  - Cloudinary
  - Supabase Storage
- Automatic image compression with configurable options
- Real-time upload progress tracking
- File preview with thumbnails for images
- Retry mechanism for failed uploads
- File validation (type, size, count)
- TypeScript support with full type definitions
- Responsive design with mobile support
- Dark mode support
- Customizable styling with CSS custom properties
- Comprehensive examples and documentation

### Features

- **FileUploader**: Main component with full functionality
- **Dropzone**: Standalone drag-and-drop component
- **FilePreview**: Individual file preview component
- **Storage Providers**: Pluggable storage system
- **Compression Utilities**: Image compression helpers
- **File Utilities**: Validation, formatting, and file helpers

### Cloud Storage Support

- **AWS S3**: Direct upload with presigned URLs
- **Cloudinary**: Upload with transformation support
- **Supabase**: Storage integration with signed URLs

### Developer Experience

- Full TypeScript support
- Comprehensive test suite
- ESLint configuration
- Rollup build system
- Jest testing framework
- Example implementations
- Detailed documentation
