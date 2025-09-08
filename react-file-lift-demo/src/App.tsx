import React, { useState } from 'react';
import { FileUploader, CloudStorageConfig, FileWithPreview, AWSConfig, CloudinaryConfig, SupabaseConfig, FirebaseConfig } from 'react-file-lift';
import './App.css';

function App() {
	const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	// AWS S3 Configuration
	const awsConfig: CloudStorageConfig = {
		provider: 'aws',
		config: {
			accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || '',
			secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || '',
			region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
			bucket: process.env.REACT_APP_AWS_BUCKET || '',
			folder: 'react-file-lift-demo/',
		},
	};

	// Cloudinary Configuration
	const cloudinaryConfig: CloudStorageConfig = {
		provider: 'cloudinary',
		config: {
			cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '',
			apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY || '',
			apiSecret: process.env.REACT_APP_CLOUDINARY_API_SECRET || '',
			uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset',
			folder: 'react-file-lift-demo/',
		},
	};

	// Supabase Configuration
	const supabaseConfig: CloudStorageConfig = {
		provider: 'supabase',
		config: {
			url: process.env.REACT_APP_SUPABASE_URL || '',
			anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
			bucket: process.env.REACT_APP_SUPABASE_BUCKET || '',
			folder: 'react-file-lift-demo/',
		},
	};

	// Firebase Configuration
	const firebaseConfig: CloudStorageConfig = {
		provider: 'firebase',
		config: {
			apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
			authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
			projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
			storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
			messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
			appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
			folder: 'react-file-lift-demo/',
		},
	};

	const handleFilesAdded = (files: FileWithPreview[]) => {
		setUploadedFiles(prev => [...prev, ...files]);
		setIsUploading(true);
	};

	const handleUploadComplete = (files: FileWithPreview[]) => {
		setIsUploading(false);
		const successCount = files.filter(f => f.status === 'success').length;
		if (successCount > 0) {
			alert(`Successfully processed ${successCount} files!`);
		}
	};

	const handleUploadError = (error: string, file: FileWithPreview) => {
		console.error('Upload error:', error, file);
		alert(`Upload failed for ${file.name}: ${error}`);
	};

	const handleCompressionComplete = (originalFile: File, compressedFile: File) => {
		const compressionRatio = ((originalFile.size - compressedFile.size) / originalFile.size * 100).toFixed(1);
		console.log(`Compressed ${originalFile.name}: ${originalFile.size} → ${compressedFile.size} bytes (${compressionRatio}% reduction)`);
	};

	const clearUploadedFiles = () => {
		setUploadedFiles([]);
	};

	const isCloudConfigured = (config: CloudStorageConfig) => {
		switch (config.provider) {
			case 'aws': {
				const awsConfig = config.config as AWSConfig;
				return !!(awsConfig.accessKeyId && awsConfig.secretAccessKey && awsConfig.bucket);
			}
			case 'cloudinary': {
				const cloudinaryConfig = config.config as CloudinaryConfig;
				return !!(cloudinaryConfig.cloudName && cloudinaryConfig.apiKey);
			}
			case 'supabase': {
				const supabaseConfig = config.config as SupabaseConfig;
				return !!(supabaseConfig.url && supabaseConfig.anonKey && supabaseConfig.bucket);
			}
			case 'firebase':
				const firebaseConfig = config.config as FirebaseConfig;
				return !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);
			default:
				return false;
		}
	};

	return (
		<div className="App">
			<header className="App-header">
				<h1>🚀 React File Lift Demo</h1>
				<p>A powerful React file uploader with drag-and-drop, image compression, and cloud storage integration</p>
			</header>

			<main className="App-main">
				{/* Basic Upload Demo */}
				<section className="demo-section">
					<h2>📁 Basic File Upload</h2>
					<p>Drag and drop files or click to select. Supports multiple files and file validation.</p>
					<FileUploader
						multiple
						accept="image/*,application/pdf,.doc,.docx,.txt"
						maxFiles={10}
						maxSize={10 * 1024 * 1024} // 10MB
						onFilesAdded={handleFilesAdded}
						onUploadComplete={handleUploadComplete}
						onUploadError={handleUploadError}
						className="basic-uploader"
					/>
				</section>

				{/* Image Compression Demo */}
				<section className="demo-section">
					<h2>🖼️ Image Compression Demo</h2>
					<p>Upload images to see automatic compression with configurable options.</p>
					<FileUploader
						multiple
						accept="image/*"
						maxFiles={8}
						maxSize={20 * 1024 * 1024} // 20MB
						enableCompression
						compressionOptions={{
							maxSizeMB: 2,
							maxWidthOrHeight: 1920,
							useWebWorker: true,
							initialQuality: 0.8,
						}}
						onFilesAdded={handleFilesAdded}
						onCompressionComplete={handleCompressionComplete}
						onUploadComplete={handleUploadComplete}
						onUploadError={handleUploadError}
						className="compression-uploader"
					/>
				</section>

				{/* AWS S3 Demo */}
				<section className="demo-section">
					<h2>☁️ AWS S3 Cloud Storage</h2>
					<div className={`config-status ${isCloudConfigured(awsConfig) ? 'success' : 'warning'}`}>
						{isCloudConfigured(awsConfig)
							? '✅ AWS S3 credentials configured'
							: '⚠️ AWS S3 requires configuration. Set REACT_APP_AWS_ACCESS_KEY_ID, REACT_APP_AWS_SECRET_ACCESS_KEY, and REACT_APP_AWS_BUCKET environment variables.'
						}
					</div>
					<FileUploader
						storageConfig={awsConfig}
						multiple
						accept="image/*,application/pdf"
						maxFiles={5}
						maxSize={50 * 1024 * 1024} // 50MB
						onFilesAdded={handleFilesAdded}
						onUploadComplete={handleUploadComplete}
						onUploadError={handleUploadError}
						disabled={!isCloudConfigured(awsConfig) || isUploading}
						className="aws-uploader"
					/>
				</section>

				{/* Cloudinary Demo */}
				<section className="demo-section">
					<h2>☁️ Cloudinary Storage</h2>
					<div className={`config-status ${isCloudConfigured(cloudinaryConfig) ? 'success' : 'warning'}`}>
						{isCloudConfigured(cloudinaryConfig)
							? '✅ Cloudinary credentials configured'
							: '⚠️ Cloudinary requires configuration. Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_API_KEY environment variables.'
						}
					</div>
					<FileUploader
						storageConfig={cloudinaryConfig}
						multiple
						accept="image/*"
						maxFiles={5}
						maxSize={50 * 1024 * 1024} // 50MB
						onFilesAdded={handleFilesAdded}
						onUploadComplete={handleUploadComplete}
						onUploadError={handleUploadError}
						disabled={!isCloudConfigured(cloudinaryConfig) || isUploading}
						className="cloudinary-uploader"
					/>
				</section>

				{/* Supabase Demo */}
				<section className="demo-section">
					<h2>☁️ Supabase Storage</h2>
					<div className={`config-status ${isCloudConfigured(supabaseConfig) ? 'success' : 'warning'}`}>
						{isCloudConfigured(supabaseConfig)
							? '✅ Supabase credentials configured'
							: '⚠️ Supabase requires configuration. Set REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY, and REACT_APP_SUPABASE_BUCKET environment variables.'
						}
					</div>
					<FileUploader
						storageConfig={supabaseConfig}
						multiple
						accept="image/*,application/pdf"
						maxFiles={5}
						maxSize={50 * 1024 * 1024} // 50MB
						onFilesAdded={handleFilesAdded}
						onUploadComplete={handleUploadComplete}
						onUploadError={handleUploadError}
						disabled={!isCloudConfigured(supabaseConfig) || isUploading}
						className="supabase-uploader"
					/>
				</section>

				{/* Firebase Demo */}
				<section className="demo-section">
					<h2>☁️ Firebase Storage</h2>
					<div className={`config-status ${isCloudConfigured(firebaseConfig) ? 'success' : 'warning'}`}>
						{isCloudConfigured(firebaseConfig)
							? '✅ Firebase credentials configured'
							: '⚠️ Firebase requires configuration. Set REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_AUTH_DOMAIN, and REACT_APP_FIREBASE_PROJECT_ID environment variables.'
						}
					</div>
					<FileUploader
						storageConfig={firebaseConfig}
						multiple
						accept="image/*,application/pdf"
						maxFiles={5}
						maxSize={50 * 1024 * 1024} // 50MB
						onFilesAdded={handleFilesAdded}
						onUploadComplete={handleUploadComplete}
						onUploadError={handleUploadError}
						disabled={!isCloudConfigured(firebaseConfig) || isUploading}
						className="firebase-uploader"
					/>
				</section>

				{/* Uploaded Files Display */}
				<section className="demo-section">
					<h2>📋 Uploaded Files ({uploadedFiles.length})</h2>
					<button
						className="clear-btn"
						onClick={clearUploadedFiles}
						disabled={uploadedFiles.length === 0}
					>
						Clear All Files
					</button>
					<div className="uploaded-files">
						{uploadedFiles.length === 0 ? (
							<p className="no-files">No files uploaded yet</p>
						) : (
							uploadedFiles.map((file, index) => (
								<div key={file.id || index} className="file-card">
									<div className="file-name">{file.name}</div>
									<div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
									<div className="file-status">Status: {file.status}</div>
									{file.uploadedUrl && (
										<a
											href={file.uploadedUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="file-url"
										>
											View File
										</a>
									)}
								</div>
							))
						)}
					</div>
				</section>

				{/* Configuration Instructions */}
				<section className="demo-section instructions">
					<h2>🔧 Configuration Instructions</h2>
					<p>To test cloud storage features, create a <code>.env</code> file in the demo directory with your credentials:</p>
					<pre className="env-example">
						{`# AWS S3 Configuration
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
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id`}
					</pre>
				</section>
			</main>
		</div>
	);
}

export default App;
