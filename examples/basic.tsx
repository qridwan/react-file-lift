import React from 'react';
import { FileUploader } from 'react-file-lift';

/**
 * Basic File Uploader Example
 * 
 * This example shows the most basic usage of the FileUploader component
 * with simple event handlers and file validation.
 */
export function BasicExample() {
	const handleFilesAdded = (files: any[]) => {
		console.log('Files added:', files);
	};

	const handleUploadProgress = (progress: any[]) => {
		console.log('Upload progress:', progress);
	};

	const handleUploadComplete = (files: any[]) => {
		console.log('Upload completed:', files);
		alert(`Successfully uploaded ${files.length} files!`);
	};

	const handleUploadError = (error: string, file: any) => {
		console.error('Upload error:', error, file);
		alert(`Upload failed: ${error}`);
	};

	return (
		<div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
			<h1>Basic File Uploader</h1>
			<p>Drag and drop files or click to select. No cloud storage configured.</p>

			<FileUploader
				multiple
				accept="image/*,.pdf,.doc,.docx"
				maxFiles={5}
				maxSize={10 * 1024 * 1024} // 10MB
				enableCompression
				compressionOptions={{
					maxSizeMB: 2,
					maxWidthOrHeight: 1920,
					useWebWorker: true,
				}}
				onFilesAdded={handleFilesAdded}
				onUploadProgress={handleUploadProgress}
				onUploadComplete={handleUploadComplete}
				onUploadError={handleUploadError}
				onCompressionComplete={(original, compressed) => {
					console.log('Compression complete:', {
						originalSize: original.size,
						compressedSize: compressed.size,
						savings: ((original.size - compressed.size) / original.size * 100).toFixed(1) + '%'
					});
				}}
			/>
		</div>
	);
}
