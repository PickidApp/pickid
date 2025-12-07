import type { BadgeProps } from '@pickid/ui';

type BadgeVariant = BadgeProps['variant'];

// AdminTestSession의 status, device_type은 string 타입으로 반환됨
export function getResponseStatusLabel(status: string): string {
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

export function getResponseStatusVariant(status: string): BadgeVariant {
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

export function getDeviceTypeLabel(deviceType: string): string {
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

export function getDeviceTypeVariant(deviceType: string): BadgeVariant {
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

export function getShareChannelLabel(channel: string | null): string {
	if (!channel) return '-';

	const labels: Record<string, string> = {
		instagram: '인스타그램',
		kakao: '카카오톡',
		link_copy: '링크 복사',
		twitter: '트위터/X',
		facebook: '페이스북',
		other: '기타',
	};

	return labels[channel] || channel;
}

export function getShareChannelVariant(channel: string | null): BadgeVariant {
	if (!channel) return 'gray';

	const variants: Record<string, BadgeVariant> = {
		instagram: 'pink',
		kakao: 'amber',
		link_copy: 'blue',
		twitter: 'blue',
		facebook: 'blue',
		other: 'gray',
	};

	return variants[channel] || 'gray';
}
