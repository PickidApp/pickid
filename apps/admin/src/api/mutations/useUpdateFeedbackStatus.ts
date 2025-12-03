import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { dashboardQueryKeys } from '@/api/query-keys';

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
			queryClient.invalidateQueries({
				queryKey: dashboardQueryKeys.recentFeedback().queryKey,
			});
		},
	});
}
