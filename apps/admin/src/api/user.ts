import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { userQueryKeys } from './query-keys';
import type { IFetchUsersOptions } from '@/services/user.service';

export function useUsersQuery(options?: IFetchUsersOptions) {
	return useSuspenseQuery(userQueryKeys.list(options));
}

export function useUserSummaryQuery() {
	return useSuspenseQuery(userQueryKeys.summary);
}

export function useUserDetailQuery(userId: string) {
	return useQuery({
		...userQueryKeys.detail(userId),
		enabled: !!userId,
	});
}

export function useUserSessionsQuery(userId: string, limit?: number) {
	return useQuery({
		...userQueryKeys.sessions(userId, limit),
		enabled: !!userId,
	});
}

export function useUserStatsQuery(userId: string) {
	return useQuery({
		...userQueryKeys.stats(userId),
		enabled: !!userId,
	});
}
