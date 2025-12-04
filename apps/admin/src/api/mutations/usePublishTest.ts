import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService } from '@/services/test.service';
import { testQueryKeys } from '@/api/query-keys';

interface PublishTestParams {
	testId: string;
	scheduledAt?: string;
}

export function usePublishTest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ testId, scheduledAt }: PublishTestParams) => testService.publishTest(testId, scheduledAt),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: testQueryKeys.list().queryKey,
			});
		},
	});
}
