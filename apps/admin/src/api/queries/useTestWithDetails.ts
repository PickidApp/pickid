import { useQuery } from '@tanstack/react-query';
import { testService } from '@/services/test.service';

export function useTestWithDetailsQuery(testId: string) {
	return useQuery({
		queryKey: ['test', 'with-details', testId],
		queryFn: () => testService.fetchTestWithDetails(testId),
		enabled: !!testId,
	});
}
