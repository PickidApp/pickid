import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, type CategoryPayload } from '@/services/category.service';
import { queryKeys } from '../query-keys';

export function useCreateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CategoryPayload) => categoryService.createCategory(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.category._def });
		},
	});
}
