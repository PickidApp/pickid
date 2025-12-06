import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { testQueryKeys } from '../query-keys';
import type { IFetchTestsOptions } from '@/types/test';

export function useTestsQuery(options?: IFetchTestsOptions) {
	return useSuspenseQuery(testQueryKeys.list(options));
}

// enabled 옵션이 필요한 쿼리들은 useQuery 유지
export function useTestQuery(testId: string) {
	return useQuery({
		...testQueryKeys.detail(testId),
		enabled: !!testId,
	});
}

export function useTestQuestionsQuery(testId: string) {
	return useQuery({
		...testQueryKeys.questions(testId),
		enabled: !!testId,
	});
}

export function useTestResultsQuery(testId: string) {
	return useQuery({
		...testQueryKeys.results(testId),
		enabled: !!testId,
	});
}

export function useTestWithDetailsQuery(testId: string) {
	return useQuery({
		...testQueryKeys.withDetails(testId),
		enabled: !!testId,
	});
}

export function useTestCategoryIdsQuery(testId: string) {
	return useQuery({
		...testQueryKeys.categoryIds(testId),
		enabled: !!testId,
	});
}

export function useTestRecentResponsesQuery(testId: string, limit?: number) {
	return useQuery({
		...testQueryKeys.recentResponses(testId, limit),
		enabled: !!testId,
	});
}
