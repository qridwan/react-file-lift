import React, { useState, useCallback, useEffect } from 'react';
import { FileUploaderProps, FileWithPreview, UploadProgress } from '../types';
import { Dropzone } from './Dropzone';
import { FilePreview } from './FilePreview';
import { createFileWithPreview, validateFile, revokeObjectURL } from '../utils/file';
import { compressImage, shouldCompressFile } from '../utils/compression';
import { createStorageProvider, uploadFile } from '../storage';

export const FileUploader: React.FC<FileUploaderProps> = ({
	multiple = true,
	accept,
	maxFiles,
	maxSize,
	className = '',
	dropzoneClassName = '',
	previewClassName = '',
	disabled = false,
	enableCompression = true,
	compressionOptions = {},
	storageConfig,
	onFilesAdded,
	onFilesRemoved,
	onUploadProgress,
	onUploadComplete,
	onUploadError,
	onCompressionComplete,
	customUploadHandler,
}) => {
	const [files, setFiles] = useState<FileWithPreview[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	// Cleanup object URLs on unmount
	useEffect(() => {
		return () => {
			files.forEach(revokeObjectURL);
		};
	}, []);

	const handleFilesAdded = useCallback((newFiles: File[]) => {
		if (disabled) return;

		const validatedFiles: FileWithPreview[] = [];
		const errors: string[] = [];

		for (const file of newFiles) {
			// Check if file limit would be exceeded
			if (maxFiles && files.length + validatedFiles.length >= maxFiles) {
				errors.push(`Maximum ${maxFiles} files allowed`);
				break;
			}

			// Validate file
			const validation = validateFile(file, { maxSize, accept });
			if (!validation.valid) {
				errors.push(`${file.name}: ${validation.error}`);
				continue;
			}

			// Check for duplicates
			const isDuplicate = files.some(existingFile =>
				existingFile.name === file.name &&
				existingFile.size === file.size &&
				existingFile.lastModified === file.lastModified
			);

			if (isDuplicate) {
				errors.push(`${file.name}: File already added`);
				continue;
			}

			validatedFiles.push(createFileWithPreview(file));
		}

		if (validatedFiles.length > 0) {
			const updatedFiles = multiple ? [...files, ...validatedFiles] : validatedFiles;
			setFiles(updatedFiles);
			onFilesAdded?.(validatedFiles);

			// Auto-start compression and upload if enabled
			if (enableCompression || storageConfig || customUploadHandler) {
				processFiles(validatedFiles);
			}
		}

		// Show errors
		if (errors.length > 0) {
			console.warn('File validation errors:', errors);
		}
	}, [files, disabled, maxFiles, maxSize, accept, multiple, enableCompression, storageConfig, customUploadHandler, onFilesAdded]);

	const processFiles = useCallback(async (filesToProcess: FileWithPreview[]) => {
		setIsUploading(true);

		for (const file of filesToProcess) {
			try {
				// Update file status
				updateFileStatus(file.id, 'uploading', 0);

				let fileToUpload = file as File;

				// Compress if enabled and applicable
				if (enableCompression && shouldCompressFile(file, compressionOptions.maxSizeMB)) {
					updateFileStatus(file.id, 'compressed');

					const compressedFile = await compressImage(file, compressionOptions);

					// Update file with compressed version
					setFiles(prevFiles =>
						prevFiles.map(f =>
							f.id === file.id
								? { ...f, compressedFile, status: 'uploading' as const }
								: f
						)
					);

					fileToUpload = compressedFile;
					onCompressionComplete?.(file, compressedFile);
				}

				// Upload file
				let uploadedUrl: string;

				if (customUploadHandler) {
					uploadedUrl = await customUploadHandler(fileToUpload);
				} else if (storageConfig) {
					const storageProvider = createStorageProvider(storageConfig);
					uploadedUrl = await uploadFile(
						storageProvider,
						fileToUpload,
						undefined,
						(progress) => updateFileStatus(file.id, 'uploading', progress)
					);
				} else {
					throw new Error('No upload handler or storage config provided');
				}

				// Update file with success status and URL
				setFiles(prevFiles =>
					prevFiles.map(f =>
						f.id === file.id
							? { ...f, status: 'success' as const, uploadedUrl, progress: 100 }
							: f
					)
				);

			} catch (error) {
				console.error('File processing error:', error);
				const errorMessage = error instanceof Error ? error.message : 'Upload failed';

				updateFileStatus(file.id, 'error', undefined, errorMessage);
				onUploadError?.(errorMessage, file);
			}
		}

		setIsUploading(false);

		// Notify completion
		const successfulFiles = files.filter(f => f.status === 'success');
		if (successfulFiles.length > 0) {
			onUploadComplete?.(successfulFiles);
		}
	}, [enableCompression, compressionOptions, storageConfig, customUploadHandler, onCompressionComplete, onUploadError, onUploadComplete, files]);

	const updateFileStatus = useCallback((
		fileId: string,
		status: FileWithPreview['status'],
		progress?: number,
		error?: string
	) => {
		setFiles(prevFiles => {
			const updatedFiles = prevFiles.map(file =>
				file.id === fileId
					? { ...file, status, progress, error }
					: file
			);

			// Notify progress change
			const progressData: UploadProgress[] = updatedFiles.map(file => ({
				fileId: file.id,
				progress: file.progress || 0,
				status: file.status,
				error: file.error,
			}));

			onUploadProgress?.(progressData);

			return updatedFiles;
		});
	}, [onUploadProgress]);

	const handleFileRemove = useCallback((fileId: string) => {
		const fileToRemove = files.find(f => f.id === fileId);
		if (fileToRemove) {
			revokeObjectURL(fileToRemove);

			const updatedFiles = files.filter(f => f.id !== fileId);
			setFiles(updatedFiles);
			onFilesRemoved?.([fileToRemove]);
		}
	}, [files, onFilesRemoved]);

	const handleFileRetry = useCallback((fileId: string) => {
		const fileToRetry = files.find(f => f.id === fileId);
		if (fileToRetry) {
			processFiles([fileToRetry]);
		}
	}, [files, processFiles]);

	const clearAllFiles = useCallback(() => {
		files.forEach(revokeObjectURL);
		setFiles([]);
		onFilesRemoved?.(files);
	}, [files, onFilesRemoved]);

	return (
		<div className={`rfl-file-uploader ${className}`}>
			<Dropzone
				onDrop={handleFilesAdded}
				accept={accept}
				multiple={multiple}
				disabled={disabled || isUploading}
				className={dropzoneClassName}
				activeClassName="rfl-dropzone--active"
			/>

			{files.length > 0 && (
				<div className="rfl-file-uploader__files">
					<div className="rfl-file-uploader__header">
						<h3 className="rfl-file-uploader__title">
							Files ({files.length}{maxFiles && `/${maxFiles}`})
						</h3>
						<button
							className="rfl-file-uploader__clear-all"
							onClick={clearAllFiles}
							disabled={isUploading}
						>
							Clear All
						</button>
					</div>

					<div className="rfl-file-uploader__previews">
						{files.map(file => (
							<FilePreview
								key={file.id}
								file={file}
								onRemove={handleFileRemove}
								onRetry={handleFileRetry}
								className={previewClassName}
								showProgress={true}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
