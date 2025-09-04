import React, { useState } from 'react';
import { FileUploader, CloudStorageConfig } from 'react-file-lift';

/**
 * AWS S3 Integration Example
 * 
 * This example demonstrates how to upload files directly to AWS S3
 * with progress tracking and error handling.
 */
export function AWSS3Example() {
	const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	// AWS S3 configuration
	const storageConfig: CloudStorageConfig = {
		provider: 'aws',
		config: {
			accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || '',
			secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || '',
			region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
			bucket: process.env.REACT_APP_AWS_BUCKET || '',
			folder: 'react-file-lift-uploads/',
		},
	};

	const handleUploadStart = () => {
		setIsUploading(true);
	};

	const handleUploadComplete = (files: any[]) => {
		setIsUploading(false);
		setUploadedFiles(prev => [...prev, ...files]);

		const successCount = files.filter(f => f.status === 'success').length;
		if (successCount > 0) {
			alert(`Successfully uploaded ${successCount} files to S3!`);
		}
	};

	const handleUploadError = (error: string, file: any) => {
		console.error('S3 upload error:', error, file);
		alert(`Failed to upload ${file.name} to S3: ${error}`);
	};

	const clearUploaded = () => {
		setUploadedFiles([]);
	};

	return (
		<div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
			<h1>AWS S3 File Upload</h1>
			<p>Upload files directly to Amazon S3 with automatic compression.</p>

			{/* Configuration Status */}
			<div style={{
				padding: '1rem',
				marginBottom: '1rem',
				backgroundColor: storageConfig.config.accessKeyId ? '#d4edda' : '#f8d7da',
				border: `1px solid ${storageConfig.config.accessKeyId ? '#c3e6cb' : '#f5c6cb'}`,
				borderRadius: '4px'
			}}>
				<strong>Configuration Status:</strong> {
					storageConfig.config.accessKeyId
						? '✅ AWS credentials configured'
						: '❌ Please set AWS environment variables'
				}
				{!storageConfig.config.accessKeyId && (
					<div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
						Set REACT_APP_AWS_ACCESS_KEY_ID, REACT_APP_AWS_SECRET_ACCESS_KEY,
						REACT_APP_AWS_REGION, and REACT_APP_AWS_BUCKET in your .env file
					</div>
				)}
			</div>

			<FileUploader
				storageConfig={storageConfig}
				multiple
				accept="image/*,application/pdf,.doc,.docx"
				maxFiles={10}
				maxSize={50 * 1024 * 1024} // 50MB
				enableCompression
				compressionOptions={{
					maxSizeMB: 5,
					maxWidthOrHeight: 2048,
					useWebWorker: true,
					initialQuality: 0.9,
				}}
				disabled={!storageConfig.config.accessKeyId || isUploading}
				onFilesAdded={handleUploadStart}
				onUploadComplete={handleUploadComplete}
				onUploadError={handleUploadError}
				onUploadProgress={(progress) => {
					console.log('S3 upload progress:', progress);
				}}
				className="aws-uploader"
			/>

			{/* Uploaded Files Gallery */}
			{uploadedFiles.length > 0 && (
				<div style={{ marginTop: '2rem' }}>
					<div style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: '1rem'
					}}>
						<h2>Uploaded Files ({uploadedFiles.length})</h2>
						<button
							onClick={clearUploaded}
							style={{
								padding: '0.5rem 1rem',
								backgroundColor: '#dc3545',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer'
							}}
						>
							Clear All
						</button>
					</div>

					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
						gap: '1rem'
					}}>
						{uploadedFiles.map((file, index) => (
							<div
								key={index}
								style={{
									border: '1px solid #ddd',
									borderRadius: '8px',
									padding: '1rem',
									backgroundColor: 'white'
								}}
							>
								<div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
									{file.name}
								</div>
								<div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
									Size: {(file.size / 1024 / 1024).toFixed(2)} MB
								</div>
								{file.uploadedUrl && (
									<a
										href={file.uploadedUrl}
										target="_blank"
										rel="noopener noreferrer"
										style={{
											display: 'inline-block',
											padding: '0.25rem 0.5rem',
											backgroundColor: '#007bff',
											color: 'white',
											textDecoration: 'none',
											borderRadius: '4px',
											fontSize: '0.875rem'
										}}
									>
										View File
									</a>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
