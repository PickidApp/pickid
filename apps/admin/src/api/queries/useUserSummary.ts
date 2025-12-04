import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

export function useUserSummaryQuery() {
	return useQuery(queryKeys.user.summary);
}
