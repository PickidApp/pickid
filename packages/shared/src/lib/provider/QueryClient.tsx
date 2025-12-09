'use client';

import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider as BaseQueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export function QueryClientProvider({ children }: React.PropsWithChildren) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				queryCache: new QueryCache({
					onError: () => {
						toast.error('데이터를 불러오는데 실패했습니다.');
					},
				}),
				mutationCache: new MutationCache({
					onError: () => {
						toast.error('작업에 실패했습니다.');
					},
					onSuccess: () => {
						toast.success('저장되었습니다.');
					},
				}),
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						retry: false,
						staleTime: 5 * 60 * 1000,
					},
				},
			})
	);

	return <BaseQueryClientProvider client={queryClient}>{children}</BaseQueryClientProvider>;
}
