import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';

export function useTestCategoryIdsQuery(testId: string) {
	return useQuery({
		...queryKeys.test.categoryIds(testId),
		enabled: !!testId,
	});
}
