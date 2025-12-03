import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-keys';
import { dashboardService } from '@/services/dashboard.service';

export function useRecentFeedback(limit = 10) {
	return useQuery(queryKeys.dashboard.recentFeedback(limit));
}

export function useUpdateFeedbackStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: { id: string; status: 'new' | 'in_progress' | 'resolved' | 'rejected'; adminNote?: string }) =>
			dashboardService.updateFeedbackStatus(params),
		onSuccess: () => {
			// 모든 recentFeedback 쿼리 invalidate
			queryClient.invalidateQueries({
				queryKey: ['dashboard', 'recentFeedback'],
			});
		},
	});
}
