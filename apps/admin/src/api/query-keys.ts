import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory';
import { dashboardService } from '@/services/dashboard.service';
import { testService } from '@/services/test.service';
import { categoryService } from '@/services/category.service';
import { userService } from '@/services/user.service';
import { feedbackService } from '@/services/feedback.service';
import { responseService } from '@/services/response.service';
import { growthService } from '@/services/growth.service';
import { testAnalyticsService } from '@/services/test-analytics.service';
import type { DateRangeParams } from '@/types/analytics';
import type { IFetchTestsOptions } from '@/types/test';
import type { IFetchCategoriesOptions } from '@/types/category';
import type { IFetchUsersOptions } from '@/types/user';
import type { IFetchFeedbacksOptions } from '@/types/feedback';
import type { IFetchResponsesOptions } from '@/types/response';
import type { IFetchTestPerformanceOptions } from '@/types/test-analytics';
import type { IFetchSeriesOptions } from '@/types/series';
import type { IFetchThemesOptions } from '@/types/theme';
import { seriesService } from '@/services/series.service';
import { themeService } from '@/services/theme.service';

export const dashboardQueryKeys = createQueryKeys('dashboard', {
	summary: (params: DateRangeParams) => ({
		queryKey: [params.from, params.to],
		queryFn: () => dashboardService.fetchDashboardSummary(params),
	}),

	dailyGrowth: (params: DateRangeParams) => ({
		queryKey: [params.from, params.to],
		queryFn: () => dashboardService.fetchDailyGrowth(params),
	}),

	channelShare: (params: DateRangeParams) => ({
		queryKey: [params.from, params.to],
		queryFn: () => dashboardService.fetchChannelShare(params),
	}),

	globalFunnel: (params: DateRangeParams) => ({
		queryKey: [params.from, params.to],
		queryFn: () => dashboardService.fetchGlobalFunnel(params),
	}),

	testFunnel: (testId: string, params: DateRangeParams) => ({
		queryKey: [testId, params.from, params.to],
		queryFn: () =>
			dashboardService.fetchTestFunnel({
				testId,
				...params,
			}),
	}),

	recentFeedback: (limit = 10) => ({
		queryKey: [limit],
		queryFn: () => dashboardService.fetchRecentFeedback(limit),
	}),

	allTests: {
		queryKey: null,
		queryFn: () => dashboardService.fetchAllTests(),
	},

	featuredTest: {
		queryKey: null,
		queryFn: () => dashboardService.fetchFeaturedTest(),
	},

	currentTheme: {
		queryKey: null,
		queryFn: () => dashboardService.fetchCurrentTheme(),
	},

	themeTests: (themeId: string, limit?: number) => ({
		queryKey: [themeId, limit],
		queryFn: () => dashboardService.fetchThemeTests(themeId, limit),
	}),
});

// =========================== 테스트 ===========================
export const testQueryKeys = createQueryKeys('test', {
	list: (options?: IFetchTestsOptions) => ({
		queryKey: [options],
		queryFn: () => testService.fetchTests(options),
	}),

	detail: (testId: string) => ({
		queryKey: [testId],
		queryFn: () => testService.fetchTest(testId),
	}),

	withDetails: (testId: string) => ({
		queryKey: [testId, 'with-details'],
		queryFn: () => testService.fetchTestWithDetails(testId),
	}),

	questions: (testId: string) => ({
		queryKey: [testId, 'questions'],
		queryFn: () => testService.fetchTestQuestions(testId),
	}),

	results: (testId: string) => ({
		queryKey: [testId, 'results'],
		queryFn: () => testService.fetchTestResults(testId),
	}),

	categoryIds: (testId: string) => ({
		queryKey: [testId, 'category-ids'],
		queryFn: () => testService.fetchTestCategoryIds(testId),
	}),

	recentResponses: (testId: string, limit?: number) => ({
		queryKey: [testId, 'recent-responses', limit],
		queryFn: () => testService.fetchTestRecentResponses(testId, limit),
	}),

	seriesList: {
		queryKey: ['series-list'],
		queryFn: () => testService.fetchSeriesList(),
	},

	themesList: {
		queryKey: ['themes-list'],
		queryFn: () => testService.fetchThemesList(),
	},
});

// =========================== 카테고리 ===========================
export const categoryQueryKeys = createQueryKeys('category', {
	list: (options?: IFetchCategoriesOptions) => ({
		queryKey: [options],
		queryFn: () => categoryService.fetchCategories(options),
	}),
});

// =========================== 시리즈 ===========================
export const seriesQueryKeys = createQueryKeys('series', {
	list: (options?: IFetchSeriesOptions) => ({
		queryKey: [options],
		queryFn: () => seriesService.fetchSeries(options),
	}),

	testCount: (seriesId: string) => ({
		queryKey: [seriesId, 'test-count'],
		queryFn: () => seriesService.getSeriesTestCount(seriesId),
	}),

	tests: (seriesId: string) => ({
		queryKey: [seriesId, 'tests'],
		queryFn: () => seriesService.fetchSeriesTests(seriesId),
	}),
});

// =========================== 테마 ===========================
export const themeQueryKeys = createQueryKeys('theme', {
	list: (options?: IFetchThemesOptions) => ({
		queryKey: [options],
		queryFn: () => themeService.fetchThemes(options),
	}),

	testCount: (themeId: string) => ({
		queryKey: [themeId, 'test-count'],
		queryFn: () => themeService.getThemeTestCount(themeId),
	}),

	tests: (themeId: string) => ({
		queryKey: [themeId, 'tests'],
		queryFn: () => themeService.fetchThemeTests(themeId),
	}),
});

// =========================== 유저 ===========================
export const userQueryKeys = createQueryKeys('user', {
	list: (options?: IFetchUsersOptions) => ({
		queryKey: [options],
		queryFn: () => userService.fetchUsers(options),
	}),

	summary: {
		queryKey: null,
		queryFn: () => userService.fetchUserSummary(),
	},

	detail: (userId: string) => ({
		queryKey: [userId],
		queryFn: () => userService.fetchUser(userId),
	}),

	responses: (userId: string, limit?: number) => ({
		queryKey: [userId, 'responses', limit],
		queryFn: () => userService.fetchUserResponses(userId, limit),
	}),

	stats: (userId: string) => ({
		queryKey: [userId, 'stats'],
		queryFn: () => userService.fetchUserStats(userId),
	}),
});

// =========================== 피드백 ===========================
export const feedbackQueryKeys = createQueryKeys('feedback', {
	list: (options?: IFetchFeedbacksOptions) => ({
		queryKey: [options],
		queryFn: () => feedbackService.fetchFeedbacks(options),
	}),

	summary: {
		queryKey: null,
		queryFn: () => feedbackService.fetchFeedbackSummary(),
	},
});

// =========================== 응답 ===========================
export const responseQueryKeys = createQueryKeys('response', {
	list: (options?: IFetchResponsesOptions) => ({
		queryKey: [options],
		queryFn: () => responseService.fetchResponses(options),
	}),

	stats: (options?: Omit<IFetchResponsesOptions, 'page' | 'pageSize'>) => ({
		queryKey: ['stats', options],
		queryFn: () => responseService.fetchResponseStats(options),
	}),

	detail: (responseId: string) => ({
		queryKey: [responseId],
		queryFn: () => responseService.fetchResponseDetail(responseId),
	}),
});

// =========================== 성장 분석 ===========================
export const growthQueryKeys = createQueryKeys('growth', {
	summary: (params: DateRangeParams) => ({
		queryKey: [params.from, params.to],
		queryFn: () => growthService.fetchGrowthSummary(params),
	}),

	dailyGrowth: (params: DateRangeParams) => ({
		queryKey: [params.from, params.to],
		queryFn: () => growthService.fetchDailyGrowth(params),
	}),

	funnel: (params: DateRangeParams) => ({
		queryKey: [params.from, params.to],
		queryFn: () => growthService.fetchFunnelAnalysis(params),
	}),

	channel: (params: DateRangeParams) => ({
		queryKey: [params.from, params.to],
		queryFn: () => growthService.fetchChannelAnalysis(params),
	}),

	landingPage: (params: DateRangeParams) => ({
		queryKey: [params.from, params.to],
		queryFn: () => growthService.fetchLandingPageAnalysis(params),
	}),

	cohort: (weeks: number) => ({
		queryKey: [weeks],
		queryFn: () => growthService.fetchCohortAnalysis(weeks),
	}),

	// 바이럴 분석
	viralMetrics: (params: DateRangeParams) => ({
		queryKey: ['viral', params.from, params.to],
		queryFn: () => growthService.fetchViralMetrics(params),
	}),

	shareChannelStats: (params: DateRangeParams) => ({
		queryKey: ['share-channel', params.from, params.to],
		queryFn: () => growthService.fetchShareChannelStats(params),
	}),

	shareBasedSessions: (params: DateRangeParams) => ({
		queryKey: ['share-sessions', params.from, params.to],
		queryFn: () => growthService.fetchShareBasedSessions(params),
	}),
});

// =========================== 테스트 분석 ===========================
export const testAnalyticsQueryKeys = createQueryKeys('test-analytics', {
	summary: (params: DateRangeParams) => ({
		queryKey: [params],
		queryFn: () => testAnalyticsService.fetchTestPerformanceSummary(params),
	}),

	list: (params: DateRangeParams, options?: IFetchTestPerformanceOptions) => ({
		queryKey: [params, options],
		queryFn: () => testAnalyticsService.fetchTestPerformanceList(params, options),
	}),

	detailMetrics: (testId: string, params: DateRangeParams) => ({
		queryKey: [testId, 'metrics', params],
		queryFn: () => testAnalyticsService.fetchTestDetailMetrics(testId, params),
	}),

	deviceDistribution: (testId: string, params: DateRangeParams) => ({
		queryKey: [testId, 'device', params],
		queryFn: () => testAnalyticsService.fetchDeviceDistribution(testId, params),
	}),

	resultDistribution: (testId: string, params: DateRangeParams) => ({
		queryKey: [testId, 'result', params],
		queryFn: () => testAnalyticsService.fetchResultDistribution(testId, params),
	}),

	dailyTrend: (testId: string, params: DateRangeParams) => ({
		queryKey: [testId, 'daily', params],
		queryFn: () => testAnalyticsService.fetchDailyTrend(testId, params),
	}),

	questionMetrics: (testId: string, params: DateRangeParams) => ({
		queryKey: [testId, 'questions', params],
		queryFn: () => testAnalyticsService.fetchQuestionMetrics(testId, params),
	}),

	testInfo: (testId: string) => ({
		queryKey: [testId, 'info'],
		queryFn: () => testAnalyticsService.fetchTestInfo(testId),
	}),

	// 카테고리/시리즈/테마 단위 성과 분석
	categoryPerformance: (params: DateRangeParams) => ({
		queryKey: ['category', params],
		queryFn: () => testAnalyticsService.fetchCategoryPerformance(params),
	}),

	seriesPerformance: (params: DateRangeParams) => ({
		queryKey: ['series', params],
		queryFn: () => testAnalyticsService.fetchSeriesPerformance(params),
	}),

	seriesTestsPerformance: (seriesId: string, params: DateRangeParams) => ({
		queryKey: ['series', seriesId, 'tests', params],
		queryFn: () => testAnalyticsService.fetchSeriesTestsPerformance(seriesId, params),
	}),

	seriesFunnel: (seriesId: string, params: DateRangeParams) => ({
		queryKey: ['series', seriesId, 'funnel', params],
		queryFn: () => testAnalyticsService.fetchSeriesFunnel(seriesId, params),
	}),

	themePerformance: (params: DateRangeParams) => ({
		queryKey: ['theme', params],
		queryFn: () => testAnalyticsService.fetchThemePerformance(params),
	}),

	themeDailyTrend: (themeId: string, params: DateRangeParams) => ({
		queryKey: ['theme', themeId, 'daily', params],
		queryFn: () => testAnalyticsService.fetchThemeDailyTrend(themeId, params),
	}),
});

export const queryKeys = mergeQueryKeys(
	dashboardQueryKeys,
	testQueryKeys,
	categoryQueryKeys,
	seriesQueryKeys,
	themeQueryKeys,
	userQueryKeys,
	feedbackQueryKeys,
	responseQueryKeys,
	growthQueryKeys,
	testAnalyticsQueryKeys
);
