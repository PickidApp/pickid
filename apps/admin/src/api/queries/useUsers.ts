import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import type { IFetchUsersOptions } from '@/services/user.service';

export function useUsersQuery(options?: IFetchUsersOptions) {
	return useQuery(queryKeys.user.list(options));
}
