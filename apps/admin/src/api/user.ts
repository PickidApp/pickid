import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { userQueryKeys } from './query-keys';
import type { IFetchUsersOptions } from '@/types/user';

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

export function useUserResponsesQuery(userId: string, limit?: number) {
	return useQuery({
		...userQueryKeys.responses(userId, limit),
		enabled: !!userId,
	});
}

export function useUserStatsQuery(userId: string) {
	return useQuery({
		...userQueryKeys.stats(userId),
		enabled: !!userId,
	});
}
