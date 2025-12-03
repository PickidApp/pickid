import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory';
import { dashboardService } from '@/services/dashboard.service';
import { testService, type IFetchTestsOptions } from '@/services/test.service';

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

	questions: (testId: string) => ({
		queryKey: [testId, 'questions'],
		queryFn: () => testService.fetchTestQuestions(testId),
	}),

	results: (testId: string) => ({
		queryKey: [testId, 'results'],
		queryFn: () => testService.fetchTestResults(testId),
	}),
});

export const queryKeys = mergeQueryKeys(dashboardQueryKeys, testQueryKeys);
