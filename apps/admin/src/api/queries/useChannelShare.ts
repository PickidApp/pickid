import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

export function useChannelShare(from: Date, to: Date) {
	return useQuery(queryKeys.dashboard.channelShare(from, to));
}


