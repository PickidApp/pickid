import { useQuery } from '@tanstack/react-query';
import { dashboardQueryKeys } from './query-keys';

export function useDashboardSummary(from: Date, to: Date) {
	return useQuery(dashboardQueryKeys.summary(from, to));
}

export function useDailyGrowth(from: Date, to: Date) {
	return useQuery(dashboardQueryKeys.dailyGrowth(from, to));
}

export function useChannelShare(from: Date, to: Date) {
	return useQuery(dashboardQueryKeys.channelShare(from, to));
}

export function useGlobalFunnel(from: Date, to: Date) {
	return useQuery(dashboardQueryKeys.globalFunnel(from, to));
}

export function useTestFunnel(testId: string | null, from: Date, to: Date) {
	return useQuery({
		...dashboardQueryKeys.testFunnel(testId || '', from, to),
		enabled: !!testId,
	});
}

export function useRecentFeedback(limit = 10) {
	return useQuery(dashboardQueryKeys.recentFeedback(limit));
}

export function useAllTests() {
	return useQuery(dashboardQueryKeys.allTests);
}
