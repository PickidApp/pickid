import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import type { IFetchFeedbacksOptions } from '@/services/feedback.service';

export function useFeedbacksQuery(options?: IFetchFeedbacksOptions) {
	return useQuery(queryKeys.feedback.list(options));
}
