import { supabase } from '@/lib/supabase/client';

export type StorageFolder = 'thumbnails' | 'questions' | 'results/thumbnails' | 'results/backgrounds';

interface UploadOptions {
	folder: StorageFolder;
	maxSizeMB?: number;
}

const BUCKET = 'tests';
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export async function uploadFile(file: File, options: UploadOptions): Promise<{ url: string }> {
	const { folder, maxSizeMB = 5 } = options;

	// 유효성 검사
	if (!ALLOWED_TYPES.includes(file.type)) {
		throw new Error('허용되지 않는 파일 형식입니다.');
	}
	if (file.size > maxSizeMB * 1024 * 1024) {
		throw new Error(`파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`);
	}

	// 파일명 생성 (timestamp로 유니크하게)
	const ext = file.name.split('.').pop() || 'jpg';
	const fileName = `${Date.now()}.${ext}`;
	const filePath = `${folder}/${fileName}`;

	const { data, error } = await supabase.storage.from(BUCKET).upload(filePath, file, {
		cacheControl: '3600',
		upsert: false,
	});

	if (error) {
		throw new Error(`파일 업로드 실패: ${error.message}`);
	}

	const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

	return { url: publicUrl };
}
