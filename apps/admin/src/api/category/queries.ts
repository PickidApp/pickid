import { useSuspenseQuery } from '@tanstack/react-query';
import { categoryQueryKeys } from '../query-keys';
import type { IFetchCategoriesOptions } from '@/services/category.service';

export function useCategoriesQuery(options?: IFetchCategoriesOptions) {
	return useSuspenseQuery(categoryQueryKeys.list(options));
}
