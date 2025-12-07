import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import { themeQueryKeys } from '../query-keys';
import type { IFetchThemesOptions } from '@/types/theme';

export function useThemesQuery(options?: IFetchThemesOptions) {
	return useSuspenseQuery(themeQueryKeys.list(options));
}

export function useThemeTestCountQuery(themeId: string) {
	return useSuspenseQuery(themeQueryKeys.testCount(themeId));
}

export function useThemeTestsQuery(themeId: string) {
	return useQuery({
		...themeQueryKeys.tests(themeId),
		enabled: !!themeId,
	});
}
