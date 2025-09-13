import React from 'react';
import { FilePreviewProps } from '../types';
import { formatFileSize, isImageFile } from '../utils/file';

export const FilePreview: React.FC<FilePreviewProps> = ({
	file,
	onRemove,
	onRetry,
	className = '',
	showProgress = true,
}) => {
	const handleRemove = () => {
		onRemove(file.id);
	};

	const handleRetry = () => {
		if (onRetry) {
			onRetry(file.id);
		}
	};

	const getStatusIcon = () => {
		switch (file.status) {
			case 'pending':
				return '⏳';
			case 'uploading':
				return '⬆️';
			case 'success':
				return '✅';
			case 'error':
				return '❌';
			case 'compressed':
				return '🗜️';
			default:
				return '📄';
		}
	};

	const getStatusText = () => {
		switch (file.status) {
			case 'pending':
				return 'Pending';
			case 'uploading':
				return 'Uploading...';
			case 'success':
				return 'Uploaded';
			case 'error':
				return 'Error';
			case 'compressed':
				return 'Compressed';
			default:
				return 'Unknown';
		}
	};

	return (
		<div className={`rfl-file-preview ${className}`}>
			<div className="rfl-file-preview__content">
				{/* File Thumbnail */}
				<div className="rfl-file-preview__thumbnail">
					{isImageFile(file) && (file.preview || file.uploadedUrl) ? (
						<img
							src={file.uploadedUrl || file.preview}
							alt={file.name}
							className="rfl-file-preview__image"
						/>
					) : (
						<div className="rfl-file-preview__file-icon">
							📄
						</div>
					)}
					<div className="rfl-file-preview__status-icon">
						{getStatusIcon()}
					</div>
				</div>

				{/* File Info */}
				<div className="rfl-file-preview__info">
					<div className="rfl-file-preview__name" title={file.name}>
						{file.name}
					</div>
					<div className="rfl-file-preview__size">
						{formatFileSize(file.size)}
					</div>
					<div className="rfl-file-preview__status">
						{getStatusText()}
					</div>
					{file.error && (
						<div className="rfl-file-preview__error" title={file.error}>
							{file.error}
						</div>
					)}
				</div>

				{/* Progress Bar */}
				{showProgress && file.status === 'uploading' && typeof file.progress === 'number' && (
					<div className="rfl-file-preview__progress">
						<div className="rfl-file-preview__progress-bar">
							<div
								className="rfl-file-preview__progress-fill"
								style={{ width: `${file.progress}%` }}
							/>
						</div>
						<span className="rfl-file-preview__progress-text">
							{Math.round(file.progress)}%
						</span>
					</div>
				)}

				{/* Actions */}
				<div className="rfl-file-preview__actions">
					{file.status === 'error' && onRetry && (
						<button
							className="rfl-file-preview__button rfl-file-preview__button--retry"
							onClick={handleRetry}
							title="Retry upload"
						>
							🔄
						</button>
					)}
					{file.uploadedUrl && (
						<a
							href={file.uploadedUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="rfl-file-preview__button rfl-file-preview__button--view"
							title="View file"
						>
							👁️
						</a>
					)}
					<button
						className="rfl-file-preview__button rfl-file-preview__button--remove"
						onClick={handleRemove}
						title="Remove file"
					>
						🗑️
					</button>
				</div>
			</div>

			{/* Compression Info */}
			{file.compressedFile && (
				<div className="rfl-file-preview__compression-info">
					<div className="rfl-file-preview__compression-text">
						Compressed: {formatFileSize(file.size)} → {formatFileSize(file.compressedFile.size)}
					</div>
					<div className="rfl-file-preview__compression-savings">
						Saved: {formatFileSize(file.size - file.compressedFile.size)}
					</div>
				</div>
			)}
		</div>
	);
};
