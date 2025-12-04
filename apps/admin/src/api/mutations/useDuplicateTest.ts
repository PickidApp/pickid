import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService } from '@/services/test.service';
import { testQueryKeys } from '@/api/query-keys';

interface DuplicateTestParams {
	testId: string;
	newTitle?: string;
	newSlug?: string;
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
