import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { seriesQueryKeys } from '../query-keys';
import type { IFetchSeriesOptions } from '@/types/series';

export function useSeriesQuery(options?: IFetchSeriesOptions) {
	return useSuspenseQuery(seriesQueryKeys.list(options));
}

export function useSeriesTestCountQuery(seriesId: string) {
	return useSuspenseQuery(seriesQueryKeys.testCount(seriesId));
}

export function useSeriesTestsQuery(seriesId: string) {
	return useQuery({
		...seriesQueryKeys.tests(seriesId),
		enabled: !!seriesId,
	});
}
