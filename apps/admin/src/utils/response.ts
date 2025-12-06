import type { BadgeProps } from '@pickid/ui';
import type { TestSessionStatus, DeviceType } from '@pickid/supabase';

type BadgeVariant = BadgeProps['variant'];

export function getResponseStatusLabel(status: TestSessionStatus): string {
	switch (status) {
		case 'completed':
			return '완료';
		case 'in_progress':
			return '진행중';
		case 'abandoned':
			return '이탈';
		default:
			return status;
	}
}

export function getResponseStatusVariant(status: TestSessionStatus): BadgeVariant {
	switch (status) {
		case 'completed':
			return 'green';
		case 'in_progress':
			return 'blue';
		case 'abandoned':
			return 'gray';
		default:
			return 'gray';
	}
}

export function getDeviceTypeLabel(deviceType: DeviceType): string {
	switch (deviceType) {
		case 'mobile':
			return '모바일';
		case 'desktop':
			return '데스크톱';
		case 'tablet':
			return '태블릿';
		default:
			return deviceType;
	}
}

export function getDeviceTypeVariant(deviceType: DeviceType): BadgeVariant {
	switch (deviceType) {
		case 'mobile':
			return 'purple';
		case 'desktop':
			return 'blue';
		case 'tablet':
			return 'teal';
		default:
			return 'gray';
	}
}

export function formatCompletionTime(seconds: number | null): string {
	if (!seconds) return '-';

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	if (minutes > 0) {
		return `${minutes}분 ${remainingSeconds}초`;
	}
	return `${remainingSeconds}초`;
}
