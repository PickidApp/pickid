import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

export function useDashboardSummary(from: Date, to: Date) {
	return useQuery(queryKeys.dashboard.summary(from, to));
}


