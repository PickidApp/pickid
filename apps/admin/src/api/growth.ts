import { useSuspenseQuery } from '@tanstack/react-query';
import { analyticsQueryKeys } from './query-keys';
import type { DateRangeParams } from '@/services/analytics.service';

export function useGrowthSummaryQuery(params: DateRangeParams) {
	return useSuspenseQuery({
		...analyticsQueryKeys.growthSummary(params),
	});
}

export function useAnalyticsDailyGrowthQuery(params: DateRangeParams) {
	return useSuspenseQuery({
		...analyticsQueryKeys.dailyGrowth(params),
	});
}

export function useFunnelAnalysisQuery(params: DateRangeParams) {
	return useSuspenseQuery({
		...analyticsQueryKeys.funnel(params),
	});
}

export function useChannelAnalysisQuery(params: DateRangeParams) {
	return useSuspenseQuery({
		...analyticsQueryKeys.channel(params),
	});
}

export function useLandingPageAnalysisQuery(params: DateRangeParams) {
	return useSuspenseQuery({
		...analyticsQueryKeys.landingPage(params),
	});
}

export function useCohortAnalysisQuery(weeks: number = 8) {
	return useSuspenseQuery({
		...analyticsQueryKeys.cohort(weeks),
	});
}
