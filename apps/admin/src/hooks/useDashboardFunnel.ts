import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';

export function useGlobalFunnel(from: Date, to: Date) {
	return useQuery(queryKeys.dashboard.globalFunnel(from, to));
}

export function useTestFunnel(testId: string | null, from: Date, to: Date) {
	return useQuery({
		...queryKeys.dashboard.testFunnel(testId || '', from, to),
		enabled: !!testId,
	});
}
