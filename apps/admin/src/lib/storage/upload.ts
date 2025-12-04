import { supabase } from '@/lib/supabase/client';

export interface UploadOptions {
	bucket: 'test-images' | 'test-thumbnails' | 'test-results';
	folder?: string;
	maxSizeMB?: number;
}

export interface UploadResult {
	url: string;
	path: string;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

function sanitizeFileName(fileName: string): string {
	const ext = fileName.split('.').pop() || '';
	const nameWithoutExt = fileName.replace(`.${ext}`, '');
	const sanitized = nameWithoutExt
		.replace(/[^a-zA-Z0-9-_]/g, '-')
		.replace(/-+/g, '-')
		.toLowerCase();
	const timestamp = Date.now();
	return `${sanitized}-${timestamp}.${ext}`;
}

function validateFile(file: File, maxSizeMB: number = 5): void {
	if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
		throw new Error(`허용되지 않는 파일 형식입니다. (허용: ${ALLOWED_IMAGE_TYPES.join(', ')})`);
	}

	const maxSizeBytes = maxSizeMB * 1024 * 1024;
	if (file.size > maxSizeBytes) {
		throw new Error(`파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`);
	}
}

export async function uploadFile(file: File, options: UploadOptions): Promise<UploadResult> {
	const { bucket, folder, maxSizeMB = 5 } = options;

	validateFile(file, maxSizeMB);

	const fileName = sanitizeFileName(file.name);
	const filePath = folder ? `${folder}/${fileName}` : fileName;

	const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
		cacheControl: '3600',
		upsert: false,
	});

	if (error) {
		console.error('Upload error:', error);
		throw new Error(`파일 업로드 실패: ${error.message}`);
	}

	const {
		data: { publicUrl },
	} = supabase.storage.from(bucket).getPublicUrl(data.path);

	return {
		url: publicUrl,
		path: data.path,
	};
}

export async function uploadFiles(files: File[], options: UploadOptions): Promise<UploadResult[]> {
	const uploadPromises = files.map((file) => uploadFile(file, options));
	return Promise.all(uploadPromises);
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
	const { error } = await supabase.storage.from(bucket).remove([path]);

	if (error) {
		console.error('Delete error:', error);
		throw new Error(`파일 삭제 실패: ${error.message}`);
	}
}

export function extractPathFromUrl(url: string, bucket: string): string | null {
	try {
		const urlObj = new URL(url);
		const pathMatch = urlObj.pathname.match(new RegExp(`${bucket}/(.+)`));
		return pathMatch ? pathMatch[1] : null;
	} catch {
		return null;
	}
}
