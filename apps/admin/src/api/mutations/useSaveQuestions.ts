import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService, type SyncQuestionsPayload } from '@/services/test.service';
import { testQueryKeys } from '@/api/query-keys';

export function useSaveQuestions() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: SyncQuestionsPayload) => testService.syncQuestions(payload),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: testQueryKeys.detail(variables.test_id).queryKey,
			});
			queryClient.invalidateQueries({
				queryKey: testQueryKeys.questions(variables.test_id).queryKey,
			});
		},
	});
}
