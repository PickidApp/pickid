import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { queryKeys } from '../query-keys';

export function useReorderCategories() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orders: { id: string; sort_order: number }[]) => categoryService.reorderCategories(orders),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.category._def });
		},
	});
}
