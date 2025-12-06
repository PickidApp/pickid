import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { dashboardQueryKeys } from './query-keys';
import type { DateRangeParams } from '@/types/analytics';

export function useDashboardSummary(params: DateRangeParams) {
	return useSuspenseQuery(dashboardQueryKeys.summary(params));
}

export function useDailyGrowth(params: DateRangeParams) {
	return useSuspenseQuery(dashboardQueryKeys.dailyGrowth(params));
}

export function useChannelShare(params: DateRangeParams) {
	return useSuspenseQuery(dashboardQueryKeys.channelShare(params));
}

export function useGlobalFunnel(params: DateRangeParams) {
	return useSuspenseQuery(dashboardQueryKeys.globalFunnel(params));
}

export function useTestFunnel(testId: string | null, params: DateRangeParams) {
	return useQuery({
		...dashboardQueryKeys.testFunnel(testId || '', params),
		enabled: !!testId,
	});
}

export function useRecentFeedback(limit = 10) {
	return useSuspenseQuery(dashboardQueryKeys.recentFeedback(limit));
}

export function useAllTests() {
	return useSuspenseQuery(dashboardQueryKeys.allTests);
}

export function useFeaturedTest() {
	return useSuspenseQuery(dashboardQueryKeys.featuredTest);
}

export function useCurrentTheme() {
	return useSuspenseQuery(dashboardQueryKeys.currentTheme);
}

export function useThemeTests(themeId: string | null, limit?: number) {
	return useQuery({
		...dashboardQueryKeys.themeTests(themeId || '', limit),
		enabled: !!themeId,
	});
}
