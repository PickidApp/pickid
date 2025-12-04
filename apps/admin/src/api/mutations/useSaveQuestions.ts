import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService } from '@/services/test.service';
import { testQueryKeys } from '@/api/query-keys';

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
