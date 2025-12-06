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

// 카테고리/시리즈/테마 단위 성과 분석
export function useCategoryPerformanceQuery(params: DateRangeParams) {
	return useQuery({
		...testAnalyticsQueryKeys.categoryPerformance(params),
	});
}

export function useSeriesPerformanceQuery(params: DateRangeParams) {
	return useQuery({
		...testAnalyticsQueryKeys.seriesPerformance(params),
	});
}

export function useSeriesTestsPerformanceQuery(seriesId: string, params: DateRangeParams) {
	return useQuery({
		...testAnalyticsQueryKeys.seriesTestsPerformance(seriesId, params),
		enabled: !!seriesId,
	});
}

export function useSeriesFunnelQuery(seriesId: string, params: DateRangeParams) {
	return useQuery({
		...testAnalyticsQueryKeys.seriesFunnel(seriesId, params),
		enabled: !!seriesId,
	});
}

export function useThemePerformanceQuery(params: DateRangeParams) {
	return useQuery({
		...testAnalyticsQueryKeys.themePerformance(params),
	});
}

export function useThemeDailyTrendQuery(themeId: string, params: DateRangeParams) {
	return useQuery({
		...testAnalyticsQueryKeys.themeDailyTrend(themeId, params),
		enabled: !!themeId,
	});
}
