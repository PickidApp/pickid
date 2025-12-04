import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testService } from '@/services/test.service';

export function useSaveTestCategories() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ testId, categoryIds }: { testId: string; categoryIds: string[] }) =>
			testService.syncTestCategories(testId, categoryIds),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['test'] });
		},
	});
}
