import dayjs from 'dayjs';
import 'dayjs/locale/ko';

export function formatDate(date: string | Date): string {
	return dayjs(date).locale('ko').format('YYYY-MM-DD');
}

export function formatDateTimeKorean(date: string | Date): string {
	return dayjs(date).locale('ko').format('YYYY년 M월 D일 HH:mm:ss');
}

export function formatDateShort(date: string | Date): string {
	return dayjs(date).format('MM/DD');
}

export function formatNumber(value: number): string {
	return value.toLocaleString();
}

export function formatPercentage(value: number, total: number, decimals = 1): string {
	if (total === 0) return '0';
	return ((value / total) * 100).toFixed(decimals);
}

/**
 * 텍스트를 URL-safe slug로 변환
 * @param text 변환할 텍스트
 * @param suffix 선택적 접미사 (중복 방지용)
 */
export function generateSlug(text: string, suffix?: string): string {
	const baseSlug = text
		.toLowerCase()
		.replace(/[^a-z0-9가-힣\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.substring(0, 30);

	if (suffix) {
		return baseSlug ? `${baseSlug}-${suffix}` : `item-${suffix}`;
	}

	return baseSlug || 'item';
}
