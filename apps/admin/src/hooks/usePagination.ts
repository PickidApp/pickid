import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

interface UsePaginationProps {
	totalCount?: number;
	perPage?: number;
}

export function usePagination({ totalCount = 0, perPage = 20 }: UsePaginationProps = {}) {
	const [searchParams, setSearchParams] = useSearchParams();
	const currentPage = Number(searchParams.get('page')) || 1;
	const totalPages = Math.ceil(totalCount / perPage);

	const handlePageChange = useCallback(
		(page: number) => {
			setSearchParams((prev) => {
				prev.set('page', page.toString());
				return prev;
			});
			window.scrollTo({ top: 0, behavior: 'smooth' });
		},
		[setSearchParams]
	);

	return {
		currentPage,
		totalPages,
		perPage,
		handlePageChange,
	};
}
