import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, type CategoryStatus } from '@/services/category.service';
import { queryKeys } from '../query-keys';

export function useUpdateCategoryStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ categoryId, status }: { categoryId: string; status: CategoryStatus }) =>
			categoryService.updateCategoryStatus(categoryId, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.category._def });
		},
	});
}
