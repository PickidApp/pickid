import { useSuspenseQuery } from '@tanstack/react-query';
import { growthQueryKeys } from './query-keys';
import type { DateRangeParams } from '@/types/analytics';

export function useGrowthSummaryQuery(params: DateRangeParams) {
	return useSuspenseQuery({
		...growthQueryKeys.summary(params),
	});
}

export function useDailyGrowthQuery(params: DateRangeParams) {
	return useSuspenseQuery({
		...growthQueryKeys.dailyGrowth(params),
	});
}

export function useFunnelAnalysisQuery(params: DateRangeParams) {
	return useSuspenseQuery({
		...growthQueryKeys.funnel(params),
	});
}

export function useChannelAnalysisQuery(params: DateRangeParams) {
	return useSuspenseQuery({
		...growthQueryKeys.channel(params),
	});
}

export function useLandingPageAnalysisQuery(params: DateRangeParams) {
	return useSuspenseQuery({
		...growthQueryKeys.landingPage(params),
	});
}

export function useCohortAnalysisQuery(weeks: number = 8) {
	return useSuspenseQuery({
		...growthQueryKeys.cohort(weeks),
	});
}

export function useViralMetricsQuery(params: DateRangeParams) {
	return useSuspenseQuery({
		...growthQueryKeys.viralMetrics(params),
	});
}

export function useShareChannelStatsQuery(params: DateRangeParams) {
	return useSuspenseQuery({
		...growthQueryKeys.shareChannelStats(params),
	});
}

export function useShareBasedSessionsQuery(params: DateRangeParams) {
	return useSuspenseQuery({
		...growthQueryKeys.shareBasedSessions(params),
	});
}
