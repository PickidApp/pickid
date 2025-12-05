import { useSuspenseQuery } from '@tanstack/react-query';
import { feedbackQueryKeys } from '../query-keys';
import type { IFetchFeedbacksOptions } from '@/services/feedback.service';

export function useFeedbacksQuery(options?: IFetchFeedbacksOptions) {
	return useSuspenseQuery(feedbackQueryKeys.list(options));
}

export function useFeedbackSummaryQuery() {
	return useSuspenseQuery(feedbackQueryKeys.summary);
}
