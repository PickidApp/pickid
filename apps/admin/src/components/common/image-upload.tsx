import { uploadFile, type StorageFolder } from '@/lib/storage/upload';
import { cn } from '@pickid/shared';
import { FormField } from '@pickid/ui';
import { Image as ImageIcon, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImageUploadProps {
	label: string;
	value: string | null;
	onChange: (url: string | null) => void;
	folder: StorageFolder;
	maxSizeMB?: number;
	disabled?: boolean;
	className?: string;
}

export function ImageUpload({
	label,
	value,
	onChange,
	folder,
	maxSizeMB = 5,
	disabled = false,
	className,
}: ImageUploadProps) {
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);

		try {
			const result = await uploadFile(file, { folder, maxSizeMB });
			onChange(result.url);
		} catch (err) {
			console.error('Upload error:', err);
			alert(err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.');
		} finally {
			setUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const handleRemove = () => {
		onChange(null);
	};

	const handleClick = () => {
		if (!disabled && !uploading) {
			fileInputRef.current?.click();
		}
	};

	return (
		<FormField label={label} className={className}>
			<div className="space-y-2">
				{value ? (
					<div className="relative inline-block">
						<img src={value} alt={label} className="w-32 h-32 object-cover rounded-md border border-neutral-200" />
						<button
							type="button"
							onClick={handleRemove}
							disabled={disabled || uploading}
							className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							aria-label="이미지 삭제"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				) : (
					<div
						onClick={handleClick}
						className={cn(
							'flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-neutral-300 rounded-md cursor-pointer hover:border-neutral-400 transition-colors',
							(disabled || uploading) && 'opacity-50 cursor-not-allowed'
						)}
					>
						{uploading ? (
							<div className="text-sm text-neutral-500">업로드 중...</div>
						) : (
							<>
								<ImageIcon className="w-8 h-8 text-neutral-400 mb-2" />
								<div className="text-xs text-neutral-500 text-center px-2">이미지 선택</div>
							</>
						)}
					</div>
				)}

				<input
					ref={fileInputRef}
					type="file"
					accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
					onChange={handleFileSelect}
					disabled={disabled || uploading}
					className="hidden"
				/>
			</div>
		</FormField>
	);
}
