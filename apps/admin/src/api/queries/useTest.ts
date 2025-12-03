import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

export function useTestQuery(testId: string) {
	return useQuery({
		...queryKeys.test.detail(testId),
		enabled: !!testId,
	});
}
