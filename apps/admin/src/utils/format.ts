import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { DateRangeParams } from '@/types/analytics';

export function getDateRangeParams(dateRange: string): DateRangeParams {
	const to = dayjs().endOf('day');
	const days = parseInt(dateRange);
	const from = to.subtract(days, 'day').startOf('day');
	return {
		from: from.toISOString(),
		to: to.toISOString(),
	};
}

export function formatDate(date: string | Date): string {
	return dayjs(date).locale('ko').format('YYYY-MM-DD');
}

export function formatTime(seconds: number | null): string {
	if (!seconds) return '-';
	const minutes = Math.floor(seconds / 60);
	const secs = seconds % 60;
	if (minutes > 0) {
		return `${minutes}분 ${secs}초`;
	}
	return `${secs}초`;
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
