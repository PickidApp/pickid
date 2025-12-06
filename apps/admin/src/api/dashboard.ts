import { useQuery } from '@tanstack/react-query';
import { dashboardQueryKeys } from './query-keys';
import type { DateRangeParams } from '@/types/analytics';

export function useDashboardSummary(params: DateRangeParams) {
	return useQuery(dashboardQueryKeys.summary(params));
}

export function useDailyGrowth(params: DateRangeParams) {
	return useQuery(dashboardQueryKeys.dailyGrowth(params));
}

export function useChannelShare(params: DateRangeParams) {
	return useQuery(dashboardQueryKeys.channelShare(params));
}

export function useGlobalFunnel(params: DateRangeParams) {
	return useQuery(dashboardQueryKeys.globalFunnel(params));
}

export function useTestFunnel(testId: string | null, params: DateRangeParams) {
	return useQuery({
		...dashboardQueryKeys.testFunnel(testId || '', params),
		enabled: !!testId,
	});
}

export function useRecentFeedback(limit = 10) {
	return useQuery(dashboardQueryKeys.recentFeedback(limit));
}

export function useAllTests() {
	return useQuery(dashboardQueryKeys.allTests);
}
