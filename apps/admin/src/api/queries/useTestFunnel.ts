import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

export function useTestFunnel(testId: string | null, from: Date, to: Date) {
	return useQuery({
		...queryKeys.dashboard.testFunnel(testId || '', from, to),
		enabled: !!testId,
	});
}

