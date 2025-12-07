import { useQuery } from '@tanstack/react-query';
import { categoryQueryKeys } from '../query-keys';
import type { IFetchCategoriesOptions } from '@/types/category';

export function useCategoriesQuery(options?: IFetchCategoriesOptions) {
	return useQuery(categoryQueryKeys.list(options));
}
