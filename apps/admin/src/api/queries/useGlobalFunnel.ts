import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

export function useGlobalFunnel(from: Date, to: Date) {
	return useQuery(queryKeys.dashboard.globalFunnel(from, to));
}

