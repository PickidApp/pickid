import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { queryKeys } from '../query-keys';

export function useDeleteCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (categoryId: string) => categoryService.deleteCategory(categoryId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.category._def });
		},
	});
}
