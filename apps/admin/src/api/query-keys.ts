import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory';
import { dashboardService } from '@/services/dashboard.service';
import { testService, type IFetchTestsOptions } from '@/services/test.service';
import { categoryService, type IFetchCategoriesOptions } from '@/services/category.service';
import { userService, type IFetchUsersOptions } from '@/services/user.service';
import { feedbackService, type IFetchFeedbacksOptions } from '@/services/feedback.service';

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

	detail: (categoryId: string) => ({
		queryKey: [categoryId],
		queryFn: () => categoryService.fetchCategory(categoryId),
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

	detail: (feedbackId: string) => ({
		queryKey: [feedbackId],
		queryFn: () => feedbackService.fetchFeedback(feedbackId),
	}),
});

export const queryKeys = mergeQueryKeys(dashboardQueryKeys, testQueryKeys, categoryQueryKeys, userQueryKeys, feedbackQueryKeys);
