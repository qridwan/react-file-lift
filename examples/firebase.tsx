import React, { useState } from "react";
import { FileUploader, CloudStorageConfig } from "react-file-lift";

/**
 * Firebase Storage Integration Example
 * 
 * This example demonstrates how to upload files directly to Firebase Storage
 * with progress tracking and error handling.
 */
export function FirebaseExample() {
	const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	// Firebase configuration
	const storageConfig: CloudStorageConfig = {
		provider: "firebase",
		config: {
			apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
			authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
			projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
			storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
			messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
			appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
			folder: "react-file-lift-uploads/",
		},
	};

	const handleUploadStart = () => {
		setIsUploading(true);
	};

	const handleUploadComplete = (files: any[]) => {
		setIsUploading(false);
		setUploadedFiles(prev => [...prev, ...files]);

		const successCount = files.filter(f => f.status === "success").length;
		if (successCount > 0) {
			alert(`Successfully uploaded ${successCount} files to Firebase Storage!`);
		}
	};

	const handleUploadError = (error: string, file: any) => {
		console.error("Firebase upload error:", error, file);
		alert(`Failed to upload ${file.name} to Firebase: ${error}`);
	};

	const clearUploaded = () => {
		setUploadedFiles([]);
	};

	return (
		<div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
			<h1>Firebase Storage File Upload</h1>
			<p>Upload files directly to Firebase Storage with automatic compression.</p>

			{/* Configuration Status */}
			<div style={{
				padding: "1rem",
				marginBottom: "1rem",
				backgroundColor: storageConfig.config.apiKey ? "#d4edda" : "#f8d7da",
				border: `1px solid ${storageConfig.config.apiKey ? "#c3e6cb" : "#f5c6cb"}`,
				borderRadius: "4px"
			}}>
				<strong>Configuration Status:</strong> {
					storageConfig.config.apiKey
						? "✅ Firebase credentials configured"
						: "❌ Please set Firebase environment variables"
				}
				{!storageConfig.config.apiKey && (
					<div style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
						Set REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_AUTH_DOMAIN,
						REACT_APP_FIREBASE_PROJECT_ID, REACT_APP_FIREBASE_STORAGE_BUCKET,
						REACT_APP_FIREBASE_MESSAGING_SENDER_ID, and REACT_APP_FIREBASE_APP_ID in your .env file
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
				disabled={!storageConfig.config.apiKey || isUploading}
				onFilesAdded={handleUploadStart}
				onUploadComplete={handleUploadComplete}
				onUploadError={handleUploadError}
				onUploadProgress={(progress) => {
					console.log("Firebase upload progress:", progress);
				}}
				className="firebase-uploader"
			/>

			{/* Uploaded Files Gallery */}
			{uploadedFiles.length > 0 && (
				<div style={{ marginTop: "2rem" }}>
					<div style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "1rem"
					}}>
						<h2>Uploaded Files ({uploadedFiles.length})</h2>
						<button
							onClick={clearUploaded}
							style={{
								padding: "0.5rem 1rem",
								backgroundColor: "#dc3545",
								color: "white",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer"
							}}
						>
							Clear All
						</button>
					</div>

					<div style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
						gap: "1rem"
					}}>
						{uploadedFiles.map((file, index) => (
							<div
								key={index}
								style={{
									border: "1px solid #ddd",
									borderRadius: "8px",
									padding: "1rem",
									backgroundColor: "white"
								}}
							>
								<div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
									{file.name}
								</div>
								<div style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.5rem" }}>
									Size: {(file.size / 1024 / 1024).toFixed(2)} MB
								</div>
								{file.uploadedUrl && (
									<a
										href={file.uploadedUrl}
										target="_blank"
										rel="noopener noreferrer"
										style={{
											display: "inline-block",
											padding: "0.25rem 0.5rem",
											backgroundColor: "#007bff",
											color: "white",
											textDecoration: "none",
											borderRadius: "4px",
											fontSize: "0.875rem"
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

			{/* Firebase Setup Instructions */}
			<div style={{
				marginTop: "2rem",
				padding: "1.5rem",
				backgroundColor: "#f8f9fa",
				borderRadius: "8px",
				border: "1px solid #e9ecef"
			}}>
				<h3>Firebase Setup Instructions</h3>
				<ol style={{ marginLeft: "1.5rem" }}>
					<li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
					<li>Create a new project or select an existing one</li>
					<li>Enable Firebase Storage in the project</li>
					<li>Go to Project Settings → General → Your apps</li>
					<li>Add a web app and copy the configuration</li>
					<li>Set the environment variables in your .env file:</li>
				</ol>
				<pre style={{
					backgroundColor: "#e9ecef",
					padding: "1rem",
					borderRadius: "4px",
					fontSize: "0.875rem",
					overflow: "auto"
				}}>
					{`REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id`}
				</pre>
			</div>
		</div>
	);
}