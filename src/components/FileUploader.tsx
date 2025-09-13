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
		const successfulFiles: FileWithPreview[] = [];

		for (const file of filesToProcess) {
			try {
				// Update file status
				updateFileStatus(file.id, 'uploading', 0);

				console.log('Processing file:', file.name, {
					fileType: typeof file,
					isFile: file instanceof File,
					constructor: file.constructor.name,
					fileObject: file
				});

				// Get the actual File object - either the original file or compressed file
				let fileToUpload: File;

				// Check if we have a compressed file already
				if (file.compressedFile) {
					fileToUpload = file.compressedFile;
					console.log('Using existing compressed file');
				} else {
					// Use the original file - we need to get it from the FileWithPreview
					// Since FileWithPreview extends File, we can use it directly
					fileToUpload = file;
				}

				// Compress if enabled and applicable
				if (enableCompression && shouldCompressFile(file, compressionOptions.maxSizeMB) && !file.compressedFile) {
					updateFileStatus(file.id, 'compressed');

					const compressedFile = await compressImage(file, compressionOptions);

					// Update file with compressed version
					setFiles(prevFiles =>
						prevFiles.map(f =>
							f.id === file.id
								? Object.assign(f, { compressedFile, status: 'uploading' as const })
								: f
						)
					);

					fileToUpload = compressedFile;
					onCompressionComplete?.(file, compressedFile);
				}

				// Upload file
				let uploadedUrl: string;

				console.log('Starting upload for file:', fileToUpload.name, {
					fileType: typeof fileToUpload,
					fileSize: fileToUpload.size,
					hasCustomHandler: !!customUploadHandler,
					hasStorageConfig: !!storageConfig,
					storageProvider: storageConfig?.provider,
					isFile: fileToUpload instanceof File,
					constructor: fileToUpload.constructor.name,
					fileObject: fileToUpload
				});

				if (customUploadHandler) {
					console.log('Using custom upload handler');
					uploadedUrl = await customUploadHandler(fileToUpload);
				} else if (storageConfig) {
					console.log('Using storage config:', storageConfig.provider);
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

				console.log('Upload successful for file:', fileToUpload.name, 'URL:', uploadedUrl);

				// Update file with success status and URL
				// Create a new FileWithPreview that preserves File properties
				const updatedFile = Object.assign(file, {
					status: 'success' as const,
					uploadedUrl,
					progress: 100
				});
				successfulFiles.push(updatedFile);

				console.log('Updating file after successful upload:', {
					fileName: file.name,
					uploadedUrl,
					hasPreview: !!file.preview,
					updatedFile: updatedFile,
					updatedFileType: updatedFile.type,
					updatedFileName: updatedFile.name
				});

				setFiles(prevFiles =>
					prevFiles.map(f =>
						f.id === file.id
							? updatedFile
							: f
					)
				);

			} catch (error) {
				console.error('File processing error for file:', file.name, error);
				console.error('Error details:', {
					error: error,
					errorType: typeof error,
					errorMessage: error instanceof Error ? error.message : String(error),
					errorStack: error instanceof Error ? error.stack : undefined
				});

				const errorMessage = error instanceof Error ? error.message : 'Upload failed';

				updateFileStatus(file.id, 'error', undefined, errorMessage);
				onUploadError?.(errorMessage, file);
			}
		}

		setIsUploading(false);


		// Notify completion with successful files
		if (successfulFiles.length > 0) {
			onUploadComplete?.(successfulFiles);
		}
	}, [enableCompression, compressionOptions, storageConfig, customUploadHandler, onCompressionComplete, onUploadError, onUploadComplete]);

	const updateFileStatus = useCallback((
		fileId: string,
		status: FileWithPreview['status'],
		progress?: number,
		error?: string
	) => {
		setFiles(prevFiles => {
			const updatedFiles = prevFiles.map(file =>
				file.id === fileId
					? Object.assign(file, { status, progress, error })
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
