import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

export function useTestResultsQuery(testId: string) {
	return useQuery({
		...queryKeys.test.results(testId),
		enabled: !!testId,
	});
}
