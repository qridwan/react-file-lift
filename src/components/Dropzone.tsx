import React, { useCallback, useState, DragEvent, ChangeEvent } from 'react';
import { DropzoneProps } from '../types';

export const Dropzone: React.FC<DropzoneProps> = ({
	children,
	onDrop,
	accept,
	multiple = true,
	disabled = false,
	className = '',
	activeClassName = '',
}) => {
	const [isDragActive, setIsDragActive] = useState(false);
	const [isDragReject, setIsDragReject] = useState(false);

	const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (disabled) return;

		setIsDragActive(true);

		// Check if dragged files match accept criteria
		if (accept && e.dataTransfer.items) {
			const files = Array.from(e.dataTransfer.items);
			const hasInvalidFile = files.some(item => {
				if (item.kind === 'file') {
					const file = item.getAsFile();
					return file && !isFileAccepted(file, accept);
				}
				return false;
			});
			setIsDragReject(hasInvalidFile);
		}
	}, [accept, disabled]);

	const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		// Only reset if leaving the dropzone entirely
		if (!e.currentTarget.contains(e.relatedTarget as Node)) {
			setIsDragActive(false);
			setIsDragReject(false);
		}
	}, []);

	const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		setIsDragActive(false);
		setIsDragReject(false);

		if (disabled) return;

		const files = Array.from(e.dataTransfer.files);

		// Filter files based on accept criteria
		const acceptedFiles = accept
			? files.filter(file => isFileAccepted(file, accept))
			: files;

		// Limit files if multiple is false
		const finalFiles = multiple ? acceptedFiles : acceptedFiles.slice(0, 1);

		if (finalFiles.length > 0) {
			onDrop(finalFiles);
		}
	}, [onDrop, accept, multiple, disabled]);

	const handleFileInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files ? Array.from(e.target.files) : [];

		if (files.length > 0) {
			onDrop(files);
		}

		// Reset input value to allow selecting the same file again
		e.target.value = '';
	}, [onDrop]);

	const openFileDialog = useCallback(() => {
		if (disabled) return;

		const input = document.createElement('input');
		input.type = 'file';
		input.accept = accept || '';
		input.multiple = multiple;
		input.onchange = handleFileInputChange as any;
		input.click();
	}, [accept, multiple, disabled, handleFileInputChange]);

	const getClassName = useCallback(() => {
		let classes = className;

		if (isDragActive && activeClassName) {
			classes += ` ${activeClassName}`;
		}

		if (isDragActive && !isDragReject) {
			classes += ' rfl-dropzone--active';
		}

		if (isDragReject) {
			classes += ' rfl-dropzone--reject';
		}

		if (disabled) {
			classes += ' rfl-dropzone--disabled';
		}

		return classes.trim();
	}, [className, activeClassName, isDragActive, isDragReject, disabled]);

	return (
		<div
			className={`rfl-dropzone ${getClassName()}`}
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onClick={openFileDialog}
			role="button"
			tabIndex={disabled ? -1 : 0}
			aria-disabled={disabled}
			onKeyDown={(e) => {
				if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
					e.preventDefault();
					openFileDialog();
				}
			}}
		>
			{children || (
				<div className="rfl-dropzone__content">
					<div className="rfl-dropzone__icon">📁</div>
					<div className="rfl-dropzone__text">
						{isDragActive
							? isDragReject
								? 'Some files are not accepted'
								: 'Drop files here'
							: 'Drag & drop files here, or click to select'}
					</div>
					{accept && (
						<div className="rfl-dropzone__accept">
							Accepted types: {accept}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

/**
 * Checks if a file is accepted based on the accept string
 */
function isFileAccepted(file: File, accept: string): boolean {
	const acceptedTypes = accept.split(',').map(type => type.trim());

	return acceptedTypes.some(acceptedType => {
		if (acceptedType.startsWith('.')) {
			// File extension
			return file.name.toLowerCase().endsWith(acceptedType.toLowerCase());
		} else {
			// MIME type
			return file.type.match(new RegExp(acceptedType.replace('*', '.*')));
		}
	});
}
