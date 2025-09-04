import React from 'react';
import { FileUploader } from 'react-file-lift';

/**
 * Custom Styling Example
 * 
 * This example shows how to customize the appearance of the FileUploader
 * components with custom CSS classes and inline styles.
 */
export function CustomStylingExample() {
	return (
		<div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
			<h1>Custom Styled File Uploader</h1>
			<p>Example with custom styling and theming.</p>

			<style>{`
        .custom-uploader {
          --rfl-primary-color: #6f42c1;
          --rfl-success-color: #20c997;
          --rfl-error-color: #e74c3c;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        .custom-dropzone {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 3px dashed rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          color: white;
          min-height: 200px;
          position: relative;
          overflow: hidden;
        }

        .custom-dropzone::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.1);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .custom-dropzone:hover::before {
          opacity: 1;
        }

        .custom-dropzone .rfl-dropzone__content {
          position: relative;
          z-index: 1;
        }

        .custom-dropzone .rfl-dropzone__icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .custom-dropzone .rfl-dropzone__text {
          color: white;
          font-size: 1.125rem;
          font-weight: 500;
        }

        .custom-dropzone .rfl-dropzone__accept {
          color: rgba(255, 255, 255, 0.8);
        }

        .custom-preview {
          background: linear-gradient(145deg, #f8f9fa, #e9ecef);
          border: none;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .custom-preview:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .custom-preview .rfl-file-preview__thumbnail {
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .custom-preview .rfl-file-preview__name {
          color: #2d3748;
          font-weight: 600;
        }

        .custom-preview .rfl-file-preview__progress-fill {
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .custom-preview .rfl-file-preview__button {
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .custom-preview .rfl-file-preview__button:hover {
          transform: scale(1.1);
        }

        .themed-section {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border-radius: 20px;
          padding: 2rem;
          margin: 2rem 0;
          color: white;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          opacity: 0.9;
          font-size: 0.875rem;
        }
      `}</style>

			<div className="themed-section">
				<h2 style={{ margin: '0 0 1rem 0' }}>🎨 Styled Upload Zone</h2>
				<p style={{ margin: '0 0 2rem 0', opacity: 0.9 }}>
					Custom gradient background with hover effects and modern styling.
				</p>

				<FileUploader
					multiple
					accept="image/*,application/pdf"
					maxFiles={8}
					maxSize={25 * 1024 * 1024} // 25MB
					enableCompression
					className="custom-uploader"
					dropzoneClassName="custom-dropzone"
					previewClassName="custom-preview"
					onFilesAdded={(files) => {
						console.log('Custom styled uploader - files added:', files);
					}}
					onUploadComplete={(files) => {
						console.log('Custom styled uploader - upload complete:', files);
					}}
					compressionOptions={{
						maxSizeMB: 3,
						maxWidthOrHeight: 1920,
						useWebWorker: true,
					}}
				/>

				<div className="stats-grid">
					<div className="stat-card">
						<div className="stat-value">✨</div>
						<div className="stat-label">Beautiful Design</div>
					</div>
					<div className="stat-card">
						<div className="stat-value">🚀</div>
						<div className="stat-label">Fast Upload</div>
					</div>
					<div className="stat-card">
						<div className="stat-value">🎯</div>
						<div className="stat-label">Easy to Use</div>
					</div>
					<div className="stat-card">
						<div className="stat-value">📱</div>
						<div className="stat-label">Responsive</div>
					</div>
				</div>
			</div>

			{/* Dark Theme Example */}
			<div style={{
				background: '#1a202c',
				borderRadius: '20px',
				padding: '2rem',
				margin: '2rem 0',
				color: 'white'
			}}>
				<h2 style={{ margin: '0 0 1rem 0' }}>🌙 Dark Theme</h2>
				<p style={{ margin: '0 0 2rem 0', opacity: 0.8 }}>
					Example with dark theme styling.
				</p>

				<style>{`
          .dark-uploader {
            --rfl-primary-color: #4299e1;
            --rfl-success-color: #48bb78;
            --rfl-error-color: #f56565;
          }

          .dark-dropzone {
            background: #2d3748;
            border: 2px dashed #4a5568;
            color: #e2e8f0;
          }

          .dark-dropzone:hover {
            border-color: #4299e1;
            background: #374151;
          }

          .dark-preview {
            background: #374151;
            border: 1px solid #4a5568;
            color: #e2e8f0;
          }
        `}</style>

				<FileUploader
					multiple
					accept="*"
					maxFiles={5}
					className="dark-uploader"
					dropzoneClassName="dark-dropzone"
					previewClassName="dark-preview"
					onFilesAdded={(files) => {
						console.log('Dark theme uploader - files added:', files);
					}}
				/>
			</div>
		</div>
	);
}
