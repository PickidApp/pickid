import { USER_STATUSES, USER_PROVIDERS } from '@/constants/user';

export { USER_STATUSES, USER_PROVIDERS };

export function getUserStatusLabel(status: string): string {
	return USER_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getUserProviderLabel(provider: string): string {
	return USER_PROVIDERS.find((p) => p.value === provider)?.label ?? provider;
}
