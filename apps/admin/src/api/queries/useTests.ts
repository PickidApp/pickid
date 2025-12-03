import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import type { IFetchTestsOptions } from '@/services/test.service';

export function useTestsQuery(options?: IFetchTestsOptions) {
	return useQuery(queryKeys.test.list(options));
}
