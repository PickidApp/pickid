import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

export function useDailyGrowth(from: Date, to: Date) {
	return useQuery(queryKeys.dashboard.dailyGrowth(from, to));
}

