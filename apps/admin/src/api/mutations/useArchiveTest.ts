import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService } from '@/services/test.service';
import { testQueryKeys } from '@/api/query-keys';

export function useArchiveTestMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (testId: string) => testService.archiveTest(testId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: testQueryKeys.list().queryKey,
			});
		},
	});
}
