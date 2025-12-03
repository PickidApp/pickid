import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { queryKeys } from '../query-keys';

const updateFeedbackStatus = (params: {
	id: string;
	status: 'new' | 'in_progress' | 'resolved' | 'rejected';
	adminNote?: string;
}) => dashboardService.updateFeedbackStatus(params);

export function useUpdateFeedbackStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateFeedbackStatus,
		onSuccess: () => {
			// 모든 recentFeedback 쿼리 invalidate
			queryClient.invalidateQueries({
				queryKey: ['dashboard', 'recentFeedback'],
			});
		},
	});
}

