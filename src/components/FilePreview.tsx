/* eslint-disable react/prop-types */
import React, { memo, useCallback, useMemo } from 'react';
import { FilePreviewProps } from '../types';
import { formatFileSize, isImageFile } from '../utils/file';

// Status configuration for better maintainability
const STATUS_CONFIG = {
	pending: { icon: '⏳', text: 'Pending', ariaLabel: 'File is pending upload' },
	uploading: { icon: '⬆️', text: 'Uploading...', ariaLabel: 'File is being uploaded' },
	success: { icon: '✅', text: 'Uploaded', ariaLabel: 'File has been successfully uploaded' },
	error: { icon: '❌', text: 'Error', ariaLabel: 'File upload failed' },
	compressed: { icon: '🗜️', text: 'Compressed', ariaLabel: 'File has been compressed' },
} as const;

// File type icons for better visual representation
const FILE_TYPE_ICONS = {
	image: '🖼️',
	pdf: '📄',
	video: '🎥',
	audio: '🎵',
	archive: '📦',
	text: '📝',
	default: '📄',
} as const;

export const FilePreview: React.FC<FilePreviewProps> = memo(({
	file,
	onRemove,
	onRetry,
	onUpload,
	className = 'flex gap-2',
	showProgress = true,
	showUploadButton = false,
	onImageLoad,
	onImageError,
	storageProvider,
	onDeleteError,
}) => {
	// Memoized handlers to prevent unnecessary re-renders
	const handleRemove = useCallback(async () => {
		if (file.uploadedUrl && storageProvider) {
			try {
				// Use the storage provider's delete method directly
				// This avoids the import issue in the built package
				if (typeof storageProvider.deleteFile === 'function') {
					// Extract the appropriate identifier based on storage provider type
					let identifier: string | null = null;

					if ('extractPublicId' in storageProvider) {
						// Cloudinary
						identifier = storageProvider.extractPublicId(file.uploadedUrl);
					} else if ('extractKey' in storageProvider) {
						// AWS S3
						identifier = storageProvider.extractKey(file.uploadedUrl);
					} else if ('extractFilePath' in storageProvider) {
						// Supabase or Firebase
						identifier = storageProvider.extractFilePath(file.uploadedUrl);
					}

					if (identifier) {
						await storageProvider.deleteFile(identifier);
						console.log('Cloud file deletion attempted for:', file.uploadedUrl);
					} else {
						console.warn('Could not extract file identifier from URL:', file.uploadedUrl);
					}
				} else {
					console.warn('Storage provider does not support file deletion');
				}
			} catch (error) {
				// Only call onDeleteError for actual errors, not expected limitations
				const errorMessage = error instanceof Error ? error.message : String(error);
				if (!errorMessage.includes('server-side implementation') &&
					!errorMessage.includes('not supported from client-side')) {
					console.error('Cloud file deletion failed (continuing with local removal):', error);
					if (onDeleteError) {
						onDeleteError(file, error instanceof Error ? error : new Error(String(error)));
					}
				} else {
					// This is expected behavior for Cloudinary, just log info
					console.log('Cloud file deletion not supported (expected for Cloudinary):', errorMessage);
				}
				// Continue with local removal regardless
			}
		}

		// Always remove from local state
		onRemove(file.id);
	}, [onRemove, file, storageProvider, onDeleteError]);

	const handleRetry = useCallback(() => {
		if (onRetry) {
			onRetry(file.id);
		}
	}, [onRetry, file.id]);

	const handleUpload = useCallback(() => {
		if (onUpload) {
			onUpload(file.id);
		}
	}, [onUpload, file.id]);

	const handleImageLoad = useCallback(() => {
		if (onImageLoad) {
			onImageLoad(file);
		}
	}, [onImageLoad, file]);

	const handleImageError = useCallback((error: React.SyntheticEvent<HTMLImageElement, Event>) => {
		// Fallback to file icon if image fails to load
		const target = error.target as HTMLImageElement;
		target.style.display = 'none';
		const parent = target.parentElement;
		if (parent) {
			// Check if fallback already exists
			const existingFallback = parent.querySelector('.rfl-file-preview__file-icon');
			if (!existingFallback) {
				const fallback = document.createElement('div');
				fallback.className = 'rfl-file-preview__file-icon';
				// Use a default icon since fileTypeIcon is not available yet
				fallback.textContent = '📄';
				parent.appendChild(fallback);
			}
		}

		if (onImageError) {
			onImageError(file, new Error('Failed to load image preview'));
		}
	}, [onImageError, file]);

	// Memoized status configuration
	const statusConfig = useMemo(() => {
		return STATUS_CONFIG[file.status] || STATUS_CONFIG.pending;
	}, [file.status]);

	// Memoized file type icon
	const fileTypeIcon = useMemo(() => {
		if (isImageFile(file)) return FILE_TYPE_ICONS.image;

		const extension = file.name.split('.').pop()?.toLowerCase();
		switch (extension) {
			case 'pdf': return FILE_TYPE_ICONS.pdf;
			case 'mp4':
			case 'avi':
			case 'mov':
			case 'wmv':
				return FILE_TYPE_ICONS.video;
			case 'mp3':
			case 'wav':
			case 'flac':
				return FILE_TYPE_ICONS.audio;
			case 'zip':
			case 'rar':
			case '7z':
				return FILE_TYPE_ICONS.archive;
			case 'txt':
			case 'md':
			case 'doc':
			case 'docx':
				return FILE_TYPE_ICONS.text;
			default:
				return FILE_TYPE_ICONS.default;
		}
	}, [file]);

	// Memoized image source with fallback
	const imageSource = useMemo(() => {
		return file.uploadedUrl || file.preview;
	}, [file.uploadedUrl, file.preview]);

	// Memoized compression info
	const compressionInfo = useMemo(() => {
		if (!file.compressedFile) return null;

		const originalSize = file.size;
		const compressedSize = file.compressedFile.size;
		const savings = originalSize - compressedSize;
		const savingsPercentage = ((savings / originalSize) * 100).toFixed(1);

		return {
			originalSize,
			compressedSize,
			savings,
			savingsPercentage,
		};
	}, [file.compressedFile, file.size]);

	return (
		<div
			className={`rfl-file-preview ${className}`}
			role="listitem"
			aria-label={`File: ${file.name}, Status: ${statusConfig.text}`}
		>
			{/* File Thumbnail */}
			<div className="rfl-file-preview__thumbnail" role="img" aria-label={`File thumbnail for ${file.name}`}>
				{isImageFile(file) && imageSource ? (
					<img
						src={imageSource}
						alt={`Preview of ${file.name}`}
						className="rfl-file-preview__image"
						loading="lazy"
						onLoad={handleImageLoad}
						onError={handleImageError}
					/>
				) : (
					<div className="rfl-file-preview__file-icon" aria-hidden="true">
						{fileTypeIcon}
					</div>
				)}
				<div
					className="rfl-file-preview__status-icon"
					aria-label={statusConfig.ariaLabel}
					title={statusConfig.text}
				>
					{statusConfig.icon}
				</div>
			</div>

			{/* File Content */}
			<div className="rfl-file-preview__content">
				{/* File Info */}
				<div className="rfl-file-preview__info">
					<div
						className="rfl-file-preview__name"
						title={file.name}
						aria-label={`File name: ${file.name}`}
					>
						{file.name}
					</div>
					<div className="rfl-file-preview__meta">
						<div
							className="rfl-file-preview__size"
							aria-label={`File size: ${formatFileSize(file.size)}`}
						>
							{formatFileSize(file.size)}
						</div>
						<div
							className={`rfl-file-preview__status rfl-file-preview__status--${file.status}`}
							aria-label={`Upload status: ${statusConfig.text}`}
						>
							{statusConfig.text}
						</div>
					</div>
					{file.error && (
						<div
							className="rfl-file-preview__error"
							title={file.error}
							role="alert"
							aria-label={`Upload error: ${file.error}`}
						>
							{file.error}
						</div>
					)}
				</div>

				{/* Progress Bar */}
				{showProgress && file.status === 'uploading' && typeof file.progress === 'number' && (
					<div
						className="rfl-file-preview__progress"
						role="progressbar"
						aria-valuenow={file.progress}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label={`Upload progress: ${Math.round(file.progress)}%`}
					>
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

			</div>

			{/* Actions */}
			<div className="rfl-file-preview__actions" role="toolbar" aria-label="File actions">
				{file.status === 'error' && onRetry && (
					<button
						className="rfl-file-preview__button rfl-file-preview__button--retry"
						onClick={handleRetry}
						title="Retry upload"
						aria-label="Retry uploading this file"
						type="button"
					>
						<span aria-hidden="true">🔄</span>
						<span className="sr-only">Retry upload</span>
					</button>
				)}
				{file.uploadedUrl && (
					<a
						href={file.uploadedUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="rfl-file-preview__button rfl-file-preview__button--view"
						title="View file"
						aria-label={`View uploaded file: ${file.name}`}
					>
						<span aria-hidden="true">👁️</span>
						<span className="sr-only">View file</span>
					</a>
				)}
				{file.status === 'pending' && showUploadButton && onUpload && (
					<button
						className="rfl-file-preview__button rfl-file-preview__button--upload"
						onClick={handleUpload}
						title="Upload file"
						aria-label={`Upload file: ${file.name}`}
						type="button"
					>
						<span aria-hidden="true">⬆️</span>
						<span className="sr-only">Upload file</span>
					</button>
				)}
				<button
					className="rfl-file-preview__button rfl-file-preview__button--remove"
					onClick={handleRemove}
					title="Remove file"
					aria-label={`Remove file: ${file.name}`}
					type="button"
				>
					<span aria-hidden="true">🗑️</span>
					<span className="sr-only">Remove file</span>
				</button>
			</div>

			{/* Compression Info */}
			{compressionInfo && (
				<div
					className="rfl-file-preview__compression-info"
					aria-label="File compression information"
				>
					<div className="rfl-file-preview__compression-text">
						Compressed: {formatFileSize(compressionInfo.originalSize)} → {formatFileSize(compressionInfo.compressedSize)}
					</div>
					<div className="rfl-file-preview__compression-savings">
						Saved: {formatFileSize(compressionInfo.savings)} ({compressionInfo.savingsPercentage}%)
					</div>
				</div>
			)}
		</div>
	);
});

// Add display name for better debugging
FilePreview.displayName = 'FilePreview';
