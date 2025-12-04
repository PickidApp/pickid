import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Eye, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
import { useTestListFilters } from '@/hooks/useTestListFilters';
import { usePagination } from '@/hooks';
import { useTestsQuery } from '@/api/queries';
import { TestListFilters } from '@/components/tests/test-list-filters';
import { TestDetailModal } from '@/components/tests/test-detail-modal';
import { BaseTable, Badge, DefaultPagination, IconButton, type Column } from '@pickid/ui';
import { PATH, HREF } from '@/constants/routes';
import { formatDate } from '@/utils';
import { getTestTypeLabel, getTestStatusLabel, getTestStatusVariant } from '@/utils/test';
import type { Test } from '@pickid/supabase';

export function TestListPage() {
	const navigate = useNavigate();
	const { filters, setFilters, setSearch } = useTestListFilters();
	const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

	const [searchParams] = useSearchParams();
	const currentPage = Number(searchParams.get('page')) || 1;

	const { data, isLoading } = useTestsQuery({
		...filters,
		page: currentPage,
		pageSize: 20,
	});

	const tests = data?.tests ?? [];
	const totalCount = data?.count ?? 0;

	const { totalPages, handlePageChange } = usePagination({ totalCount });

	const handleCreateTest = () => {
		navigate(PATH.TEST_CREATE);
	};

	const columns: Column<Test>[] = [
		{
			key: 'title',
			header: '테스트 정보',
			renderCell: (row) => (
				<div className="flex items-center">
					{row.thumbnail_url ? (
						<img src={row.thumbnail_url} alt={row.title} className="w-12 h-12 rounded-md mr-4 object-cover" />
					) : (
						<div className="w-12 h-12 bg-neutral-300 rounded-md mr-4 flex items-center justify-center">
							<span className="text-white text-xs">IMG</span>
						</div>
					)}
					<div>
						<div className="text-neutral-900">{row.title}</div>
						<div className="text-sm text-neutral-500">{row.slug}</div>
					</div>
				</div>
			),
		},
		{
			key: 'type',
			header: '타입',
			renderCell: (row) => <Badge variant="outline">{getTestTypeLabel(row.type)}</Badge>,
		},
		{
			key: 'status',
			header: '상태',
			renderCell: (row) => <Badge variant={getTestStatusVariant(row.status)}>{getTestStatusLabel(row.status)}</Badge>,
		},
		{
			key: 'created_at',
			header: '생성일',
			renderCell: (row) => <span className="text-sm text-neutral-500">{formatDate(row.created_at)}</span>,
		},
		{
			key: 'published_at',
			header: '발행일',
			renderCell: (row) => (
				<span className="text-sm text-neutral-500">{row.published_at ? formatDate(row.published_at) : '-'}</span>
			),
		},
		{
			key: 'actions',
			header: '액션',
			renderCell: (row) => (
				<div className="flex items-center space-x-2">
					<IconButton
						icon={<Eye className="w-4 h-4" />}
						className="text-neutral-400 hover:text-neutral-600 transition-colors"
						aria-label="상세보기"
						onClick={(e) => {
							e.stopPropagation();
							setSelectedTestId(row.id);
						}}
					/>
					<IconButton
						icon={<Edit className="w-4 h-4" />}
						className="text-neutral-400 hover:text-neutral-600 transition-colors"
						aria-label="수정"
						onClick={(e) => {
							e.stopPropagation();
							navigate(HREF.TEST_EDIT(row.id));
						}}
					/>
					<IconButton
						icon={row.status === 'published' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
						className="text-neutral-400 hover:text-neutral-600 transition-colors"
						aria-label="상태 변경"
						onClick={(e) => {
							e.stopPropagation();
							// TODO: 상태 변경 로직 구현
						}}
					/>
				</div>
			),
		},
	];

	return (
		<>
			<header className="bg-white border-b border-neutral-200 px-6 py-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-4">
						<h1 className="text-2xl text-neutral-900">테스트 관리</h1>
						<div className="text-sm text-neutral-500">총 {totalCount}개 테스트</div>
					</div>
					<IconButton
						icon={<Plus className="w-4 h-4" />}
						text="테스트 만들기"
						onClick={handleCreateTest}
						className="bg-black text-white px-4 py-2 rounded-md hover:bg-neutral-800 transition-colors"
						aria-label="테스트 만들기"
					/>
				</div>
			</header>

			<main className="p-6">
				<TestListFilters filters={filters} onFilterChange={setFilters} onSearch={setSearch} />

				<BaseTable data={tests} columns={columns} isLoading={isLoading} />

				{!isLoading && totalPages > 1 && (
					<div className="mt-6 flex justify-center">
						<DefaultPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
					</div>
				)}
			</main>

			{selectedTestId && (
				<TestDetailModal testId={selectedTestId} isOpen={!!selectedTestId} onClose={() => setSelectedTestId(null)} />
			)}
		</>
	);
}
