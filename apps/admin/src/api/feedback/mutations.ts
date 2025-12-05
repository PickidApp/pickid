import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService, type FeedbackStatus } from '@/services/feedback.service';
import { feedbackQueryKeys, dashboardQueryKeys } from '@/api/query-keys';

export function useUpdateFeedbackStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, status, adminNote }: { id: string; status: FeedbackStatus; adminNote?: string }) =>
			feedbackService.updateFeedbackStatus(id, status, adminNote),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: feedbackQueryKeys._def });
			queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.recentFeedback().queryKey });
		},
	});
}

export function useDeleteFeedback() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => feedbackService.deleteFeedback(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: feedbackQueryKeys._def });
		},
	});
}
