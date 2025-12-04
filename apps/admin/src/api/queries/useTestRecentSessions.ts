import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

export function useTestRecentSessionsQuery(testId: string, limit?: number) {
	return useQuery({
		...queryKeys.test.recentSessions(testId, limit),
		enabled: !!testId,
	});
}
