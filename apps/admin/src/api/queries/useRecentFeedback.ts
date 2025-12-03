import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

export function useRecentFeedback(limit = 10) {
	return useQuery(queryKeys.dashboard.recentFeedback(limit));
}


