import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '@/services/feedback.service';
import { feedbackQueryKeys } from '@/api/query-keys';

export function useDeleteFeedback() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => feedbackService.deleteFeedback(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: feedbackQueryKeys._def });
		},
	});
}
