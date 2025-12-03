import dayjs from 'dayjs';
import 'dayjs/locale/ko';

export function formatDateKorean(date: string | Date): string {
	return dayjs(date).locale('ko').format('YYYY년 M월 D일');
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
