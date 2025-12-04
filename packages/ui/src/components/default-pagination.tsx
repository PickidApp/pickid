import { cn } from '@pickid/shared';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from './pagination';

interface DefaultPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
	showPageNumbers?: boolean;
	maxVisiblePages?: number;
}

export function DefaultPagination({
	currentPage,
	totalPages,
	onPageChange,
	className,
	showPageNumbers = true,
	maxVisiblePages = 5,
}: DefaultPaginationProps) {
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const half = Math.floor(maxVisiblePages / 2);

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= half + 1) {
				for (let i = 1; i <= maxVisiblePages - 1; i++) {
					pages.push(i);
				}
				pages.push('...');
				pages.push(totalPages);
			} else if (currentPage >= totalPages - half) {
				pages.push(1);
				pages.push('...');
				for (let i = totalPages - maxVisiblePages + 2; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				pages.push(1);
				pages.push('...');
				for (let i = currentPage - half + 1; i <= currentPage + half - 1; i++) {
					pages.push(i);
				}
				pages.push('...');
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<Pagination className={cn('', className)}>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() => onPageChange(currentPage - 1)}
						className={cn(currentPage <= 1 && 'pointer-events-none opacity-50')}
					/>
				</PaginationItem>

				{showPageNumbers &&
					pageNumbers.map((page, index) => (
						<PaginationItem key={index}>
							{page === '...' ? (
								<PaginationEllipsis />
							) : (
								<PaginationLink
									onClick={() => onPageChange(page as number)}
									isActive={currentPage === page}
									size="default"
									className="cursor-pointer"
								>
									{page}
								</PaginationLink>
							)}
						</PaginationItem>
					))}

				<PaginationItem>
					<PaginationNext
						onClick={() => onPageChange(currentPage + 1)}
						className={cn(currentPage >= totalPages && 'pointer-events-none opacity-50')}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
