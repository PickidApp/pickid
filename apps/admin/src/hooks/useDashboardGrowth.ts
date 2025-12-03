import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';

export function useDailyGrowth(from: Date, to: Date) {
	return useQuery(queryKeys.dashboard.dailyGrowth(from, to));
}

export function useChannelShare(from: Date, to: Date) {
	return useQuery(queryKeys.dashboard.channelShare(from, to));
}
