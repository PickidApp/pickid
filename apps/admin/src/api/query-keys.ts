import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory';
import { dashboardService } from '@/services/dashboard.service';
import { testService, type IFetchTestsOptions } from '@/services/test.service';
import { categoryService, type IFetchCategoriesOptions } from '@/services/category.service';
import { userService, type IFetchUsersOptions } from '@/services/user.service';
import { feedbackService, type IFetchFeedbacksOptions } from '@/services/feedback.service';
import { responseService, type IFetchResponsesOptions } from '@/services/response.service';
import { analyticsService, type DateRangeParams } from '@/services/analytics.service';
import {
	testAnalyticsService,
	type DateRangeParams as TestAnalyticsDateRangeParams,
	type IFetchTestPerformanceOptions,
} from '@/services/test-analytics.service';

export const dashboardQueryKeys = createQueryKeys('dashboard', {
	summary: (from: Date, to: Date) => ({
		queryKey: [from.toISOString(), to.toISOString()],
		queryFn: () =>
			dashboardService.fetchDashboardSummary({
				from: from.toISOString(),
				to: to.toISOString(),
			}),
	}),

	dailyGrowth: (from: Date, to: Date) => ({
		queryKey: [from.toISOString(), to.toISOString()],
		queryFn: () =>
			dashboardService.fetchDailyGrowth({
				from: from.toISOString(),
				to: to.toISOString(),
			}),
	}),

	channelShare: (from: Date, to: Date) => ({
		queryKey: [from.toISOString(), to.toISOString()],
		queryFn: () =>
			dashboardService.fetchChannelShare({
				from: from.toISOString(),
				to: to.toISOString(),
			}),
	}),

	globalFunnel: (from: Date, to: Date) => ({
		queryKey: [from.toISOString(), to.toISOString()],
		queryFn: () =>
			dashboardService.fetchGlobalFunnel({
				from: from.toISOString(),
				to: to.toISOString(),
			}),
	}),

	testFunnel: (testId: string, from: Date, to: Date) => ({
		queryKey: [testId, from.toISOString(), to.toISOString()],
		queryFn: () =>
			dashboardService.fetchTestFunnel({
				testId,
				from: from.toISOString(),
				to: to.toISOString(),
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
});

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

	recentSessions: (testId: string, limit?: number) => ({
		queryKey: [testId, 'recent-sessions', limit],
		queryFn: () => testService.fetchTestRecentSessions(testId, limit),
	}),
});

export const categoryQueryKeys = createQueryKeys('category', {
	list: (options?: IFetchCategoriesOptions) => ({
		queryKey: [options],
		queryFn: () => categoryService.fetchCategories(options),
	}),
});

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

	sessions: (userId: string, limit?: number) => ({
		queryKey: [userId, 'sessions', limit],
		queryFn: () => userService.fetchUserSessions(userId, limit),
	}),

	stats: (userId: string) => ({
		queryKey: [userId, 'stats'],
		queryFn: () => userService.fetchUserStats(userId),
	}),
});

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

export const analyticsQueryKeys = createQueryKeys('analytics', {
	growthSummary: (params: DateRangeParams) => ({
		queryKey: [params.from, params.to],
		queryFn: () => analyticsService.fetchGrowthSummary(params),
	}),

	dailyGrowth: (params: DateRangeParams) => ({
		queryKey: [params.from, params.to],
		queryFn: () => analyticsService.fetchDailyGrowth(params),
	}),

	funnel: (params: DateRangeParams) => ({
		queryKey: [params.from, params.to],
		queryFn: () => analyticsService.fetchFunnelAnalysis(params),
	}),

	channel: (params: DateRangeParams) => ({
		queryKey: [params.from, params.to],
		queryFn: () => analyticsService.fetchChannelAnalysis(params),
	}),

	landingPage: (params: DateRangeParams) => ({
		queryKey: [params.from, params.to],
		queryFn: () => analyticsService.fetchLandingPageAnalysis(params),
	}),

	cohort: (weeks: number) => ({
		queryKey: [weeks],
		queryFn: () => analyticsService.fetchCohortAnalysis(weeks),
	}),
});

export const testAnalyticsQueryKeys = createQueryKeys('test-analytics', {
	summary: (params: TestAnalyticsDateRangeParams) => ({
		queryKey: [params],
		queryFn: () => testAnalyticsService.fetchTestPerformanceSummary(params),
	}),

	list: (params: TestAnalyticsDateRangeParams, options?: IFetchTestPerformanceOptions) => ({
		queryKey: [params, options],
		queryFn: () => testAnalyticsService.fetchTestPerformanceList(params, options),
	}),

	detailMetrics: (testId: string, params: TestAnalyticsDateRangeParams) => ({
		queryKey: [testId, 'metrics', params],
		queryFn: () => testAnalyticsService.fetchTestDetailMetrics(testId, params),
	}),

	deviceDistribution: (testId: string, params: TestAnalyticsDateRangeParams) => ({
		queryKey: [testId, 'device', params],
		queryFn: () => testAnalyticsService.fetchDeviceDistribution(testId, params),
	}),

	resultDistribution: (testId: string, params: TestAnalyticsDateRangeParams) => ({
		queryKey: [testId, 'result', params],
		queryFn: () => testAnalyticsService.fetchResultDistribution(testId, params),
	}),

	dailyTrend: (testId: string, params: TestAnalyticsDateRangeParams) => ({
		queryKey: [testId, 'daily', params],
		queryFn: () => testAnalyticsService.fetchDailyTrend(testId, params),
	}),

	questionMetrics: (testId: string, params: TestAnalyticsDateRangeParams) => ({
		queryKey: [testId, 'questions', params],
		queryFn: () => testAnalyticsService.fetchQuestionMetrics(testId, params),
	}),

	testInfo: (testId: string) => ({
		queryKey: [testId, 'info'],
		queryFn: () => testAnalyticsService.fetchTestInfo(testId),
	}),
});

export const queryKeys = mergeQueryKeys(
	dashboardQueryKeys,
	testQueryKeys,
	categoryQueryKeys,
	userQueryKeys,
	feedbackQueryKeys,
	responseQueryKeys,
	analyticsQueryKeys,
	testAnalyticsQueryKeys
);
