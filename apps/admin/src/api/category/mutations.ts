import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, type CategoryPayload, type CategoryStatus } from '@/services/category.service';
import { categoryQueryKeys } from '../query-keys';

export function useCreateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CategoryPayload) => categoryService.createCategory(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryQueryKeys._def });
		},
	});
}

export function useUpdateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ categoryId, payload }: { categoryId: string; payload: CategoryPayload }) =>
			categoryService.updateCategory(categoryId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryQueryKeys._def });
		},
	});
}

export function useDeleteCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (categoryId: string) => categoryService.deleteCategory(categoryId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryQueryKeys._def });
		},
	});
}

export function useUpdateCategoryStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ categoryId, status }: { categoryId: string; status: CategoryStatus }) =>
			categoryService.updateCategoryStatus(categoryId, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryQueryKeys._def });
		},
	});
}

export function useReorderCategories() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orders: { id: string; sort_order: number }[]) => categoryService.reorderCategories(orders),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryQueryKeys._def });
		},
	});
}
