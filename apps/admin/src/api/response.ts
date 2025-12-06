import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { responseQueryKeys } from './query-keys';
import type { IFetchResponsesOptions } from '@/types/response';

export function useResponsesQuery(options?: IFetchResponsesOptions) {
	return useSuspenseQuery(responseQueryKeys.list(options));
}

export function useResponseStatsQuery(options?: Omit<IFetchResponsesOptions, 'page' | 'pageSize'>) {
	return useSuspenseQuery(responseQueryKeys.stats(options));
}

export function useResponseDetailQuery(responseId: string) {
	return useQuery({
		...responseQueryKeys.detail(responseId),
		enabled: !!responseId,
	});
}
