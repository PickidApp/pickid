import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

export function useTestQuestionsQuery(testId: string) {
	return useQuery({
		...queryKeys.test.questions(testId),
		enabled: !!testId,
	});
}
