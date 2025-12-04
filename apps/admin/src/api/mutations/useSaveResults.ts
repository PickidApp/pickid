import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService, type SyncResultsPayload } from '@/services/test.service';
import { testQueryKeys } from '@/api/query-keys';

export function useSaveResults() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: SyncResultsPayload) => testService.syncResults(payload),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: testQueryKeys.detail(variables.test_id).queryKey,
			});
			queryClient.invalidateQueries({
				queryKey: testQueryKeys.results(variables.test_id).queryKey,
			});
		},
	});
}
