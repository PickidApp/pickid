import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, type CategoryPayload } from '@/services/category.service';
import { queryKeys } from '../query-keys';

export function useUpdateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ categoryId, payload }: { categoryId: string; payload: CategoryPayload }) =>
			categoryService.updateCategory(categoryId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.category._def });
		},
	});
}
