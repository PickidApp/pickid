import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService } from '@/services/test.service';
import { testQueryKeys } from '@/api/query-keys';

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
