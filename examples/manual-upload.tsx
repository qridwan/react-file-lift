import React, { useState } from 'react';
import { FileUploader } from 'react-file-lift';

// Example configuration for Cloudinary (replace with your credentials)
const cloudinaryConfig = {
	provider: 'cloudinary' as const,
	config: {
		cloudName: 'your-cloud-name',
		apiKey: 'your-api-key',
		apiSecret: 'your-api-secret',
		uploadPreset: 'your-upload-preset',
		folder: 'manual-uploads/',
	},
};

export default function ManualUploadExample() {
	const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
	const [pendingFiles, setPendingFiles] = useState<any[]>([]);

	return (
		<div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
			<h1>Manual Upload Example</h1>
			<p>
				This example demonstrates manual upload mode where users can preview files
				before uploading them to the cloud.
			</p>

			<FileUploader
				// Manual upload mode - files won't upload automatically
				autoUpload={false}
				showUploadButton={true}

				// File constraints
				multiple
				accept="image/*,video/*,.pdf,.doc,.docx"
				maxFiles={10}
				maxSize={10 * 1024 * 1024} // 10MB

				// Cloud storage configuration
				storageConfig={cloudinaryConfig}

				// Enable compression for images
				enableCompression
				compressionOptions={{
					maxSizeMB: 2,
					maxWidthOrHeight: 1920,
					initialQuality: 0.8,
				}}

				// Event handlers
				onFilesAdded={(files) => {
					console.log('Files added for preview:', files);
					setPendingFiles(prev => [...prev, ...files]);
				}}

				onUploadComplete={(files) => {
					console.log('Upload complete:', files);
					setUploadedFiles(prev => [...prev, ...files]);
					// Remove uploaded files from pending
					setPendingFiles(prev =>
						prev.filter(file => !files.some(uploaded => uploaded.id === file.id))
					);
				}}

				onFilesRemoved={(files) => {
					console.log('Files removed:', files);
					// Remove from both pending and uploaded lists
					setPendingFiles(prev =>
						prev.filter(file => !files.some(removed => removed.id === file.id))
					);
					setUploadedFiles(prev =>
						prev.filter(file => !files.some(removed => removed.id === file.id))
					);
				}}

				onRemove={(fileId) => {
					console.log('Individual file removed:', fileId);
					// You can perform custom logic here when a file is removed
					// e.g., update analytics, make API calls, etc.
				}}

				onUploadError={(error, file) => {
					console.error('Upload error:', error, file);
					alert(`Upload failed for ${file.name}: ${error}`);
				}}

				onDeleteError={(file, error) => {
					console.error('Delete error:', error, file);
					alert(`Failed to delete ${file.name} from cloud storage: ${error.message}`);
				}}

				// Custom styling
				className="custom-uploader"
				dropzoneClassName="custom-dropzone"
				previewClassName="custom-preview"
			/>

			{/* Status Display */}
			<div style={{ marginTop: '2rem' }}>
				<h3>Status</h3>
				<p>Pending files: {pendingFiles.length}</p>
				<p>Uploaded files: {uploadedFiles.length}</p>
			</div>

			{/* Uploaded Files List */}
			{uploadedFiles.length > 0 && (
				<div style={{ marginTop: '2rem' }}>
					<h3>Successfully Uploaded Files</h3>
					<ul>
						{uploadedFiles.map(file => (
							<li key={file.id}>
								<strong>{file.name}</strong> -
								<a
									href={file.uploadedUrl}
									target="_blank"
									rel="noopener noreferrer"
									style={{ marginLeft: '0.5rem' }}
								>
									View File
								</a>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

// Custom CSS for this example
const styles = `
.custom-uploader {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 1rem;
  background: #fafafa;
}

.custom-dropzone {
  border: 2px dashed #007bff;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: white;
  transition: all 0.3s ease;
}

.custom-dropzone:hover {
  border-color: #0056b3;
  background: #f8f9ff;
}

.custom-preview {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 0.5rem 0;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
`;

// Add styles to document head
if (typeof document !== 'undefined') {
	const styleSheet = document.createElement('style');
	styleSheet.textContent = styles;
	document.head.appendChild(styleSheet);
}
