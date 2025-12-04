import { USER_STATUSES, USER_PROVIDERS } from '@/constants/user';
import type { BadgeProps } from '@pickid/ui';

export { USER_STATUSES, USER_PROVIDERS };

export function getUserStatusLabel(status: string): string {
	return USER_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getUserProviderLabel(provider: string): string {
	return USER_PROVIDERS.find((p) => p.value === provider)?.label ?? provider;
}

export function getUserStatusVariant(status: string): BadgeProps['variant'] {
	switch (status) {
		case 'active':
			return 'green';
		case 'inactive':
			return 'gray';
		case 'deleted':
			return 'red';
		default:
			return 'outline';
	}
}

export function getUserProviderVariant(provider: string): BadgeProps['variant'] {
	switch (provider) {
		case 'google':
			return 'blue';
		case 'kakao':
			return 'amber';
		case 'apple':
		case 'email':
		default:
			return 'gray';
	}
}
