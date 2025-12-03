import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';

export function useAllTests() {
	return useQuery(queryKeys.dashboard.allTests);
}
