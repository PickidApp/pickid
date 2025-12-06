import { useQuery, useQueries } from '@tanstack/react-query';
import { testAnalyticsQueryKeys } from './query-keys';
import type { DateRangeParams } from '@/types/analytics';
import type { IFetchTestPerformanceOptions } from '@/types/test-analytics';

export function useTestPerformanceSummaryQuery(params: DateRangeParams) {
	return useQuery({
		...testAnalyticsQueryKeys.summary(params),
	});
}

export function useTestPerformanceListQuery(params: DateRangeParams, options?: IFetchTestPerformanceOptions) {
	return useQuery({
		...testAnalyticsQueryKeys.list(params, options),
	});
}

export function useTestDetailMetricsQuery(testId: string, params: DateRangeParams) {
	return useQuery({
		...testAnalyticsQueryKeys.detailMetrics(testId, params),
		enabled: !!testId,
	});
}

export function useDeviceDistributionQuery(testId: string, params: DateRangeParams) {
	return useQuery({
		...testAnalyticsQueryKeys.deviceDistribution(testId, params),
		enabled: !!testId,
	});
}

export function useResultDistributionQuery(testId: string, params: DateRangeParams) {
	return useQuery({
		...testAnalyticsQueryKeys.resultDistribution(testId, params),
		enabled: !!testId,
	});
}

export function useDailyTrendQuery(testId: string, params: DateRangeParams) {
	return useQuery({
		...testAnalyticsQueryKeys.dailyTrend(testId, params),
		enabled: !!testId,
	});
}

export function useQuestionMetricsQuery(testId: string, params: DateRangeParams) {
	return useQuery({
		...testAnalyticsQueryKeys.questionMetrics(testId, params),
		enabled: !!testId,
	});
}

export function useTestInfoQuery(testId: string) {
	return useQuery({
		...testAnalyticsQueryKeys.testInfo(testId),
		enabled: !!testId,
	});
}

export function useTestsComparisonMetrics(testIds: string[], params: DateRangeParams) {
	return useQueries({
		queries: testIds.map((testId) => ({
			...testAnalyticsQueryKeys.detailMetrics(testId, params),
			enabled: testIds.length >= 2,
		})),
	});
}

export function useTestsComparisonInfo(testIds: string[]) {
	return useQueries({
		queries: testIds.map((testId) => ({
			...testAnalyticsQueryKeys.testInfo(testId),
			enabled: testIds.length >= 2,
		})),
	});
}

export function useTestsComparisonDailyTrend(testIds: string[], params: DateRangeParams) {
	return useQueries({
		queries: testIds.map((testId) => ({
			...testAnalyticsQueryKeys.dailyTrend(testId, params),
			enabled: testIds.length >= 2,
		})),
	});
}
