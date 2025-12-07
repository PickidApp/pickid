import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService } from '@/services/test.service';
import type { TestPayload } from '@/types/test';
import { testQueryKeys } from '@/api/query-keys';

interface DuplicateTestParams {
	testId: string;
	newTitle?: string;
	newSlug?: string;
}

export function useSaveTest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: TestPayload) => testService.upsertTest(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: testQueryKeys.list().queryKey,
			});
		},
	});
}

export function useSaveQuestions() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ testId, questions }: { testId: string; questions: any[] }) =>
			testService.syncQuestions(testId, questions),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: testQueryKeys.detail(variables.testId).queryKey,
			});
			queryClient.invalidateQueries({
				queryKey: testQueryKeys.questions(variables.testId).queryKey,
			});
		},
	});
}

export function useSaveResults() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ testId, results }: { testId: string; results: any[] }) =>
			testService.syncResults(testId, results),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: testQueryKeys.detail(variables.testId).queryKey,
			});
			queryClient.invalidateQueries({
				queryKey: testQueryKeys.results(variables.testId).queryKey,
			});
		},
	});
}

export function useSaveTestCategories() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ testId, categoryIds }: { testId: string; categoryIds: string[] }) =>
			testService.syncTestCategories(testId, categoryIds),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: testQueryKeys._def });
		},
	});
}

export function useDuplicateTest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ testId, newTitle, newSlug }: DuplicateTestParams) =>
			testService.duplicateTest(testId, newTitle, newSlug),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: testQueryKeys.list().queryKey,
			});
		},
	});
}
