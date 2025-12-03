import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

export function useAllTests() {
	return useQuery(queryKeys.dashboard.allTests);
}

