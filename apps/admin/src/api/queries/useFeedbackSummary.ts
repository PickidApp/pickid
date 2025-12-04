import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

export function useFeedbackSummaryQuery() {
	return useQuery(queryKeys.feedback.summary);
}
