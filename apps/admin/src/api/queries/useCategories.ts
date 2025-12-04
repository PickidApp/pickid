import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import type { IFetchCategoriesOptions } from '@/services/category.service';

export function useCategoriesQuery(options?: IFetchCategoriesOptions) {
	return useQuery(queryKeys.category.list(options));
}
