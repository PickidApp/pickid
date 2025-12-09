'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import { authService } from '@/services/auth.service';

export function useAuthQuery() {
	return useQuery({
		queryKey: queryKeys.auth.user(),
		queryFn: () => authService.getUser(),
	});
}

export function useLogoutMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => authService.signOut(),
		onSuccess: () => {
			queryClient.setQueryData(queryKeys.auth.user(), null);
		},
	});
}
