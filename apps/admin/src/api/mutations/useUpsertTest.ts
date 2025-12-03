import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService, type TestPayload } from '@/services/test.service';
import { testQueryKeys } from '@/api/query-keys';

export function useUpsertTestMutation() {
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
