import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Eye, Edit } from 'lucide-react';
import { usePagination } from '@/hooks';
import { useTestsQuery } from '@/api';
import { TestDetailModal } from '@/components/tests/test-detail-modal';
import { BaseTable, Badge, DefaultPagination, IconButton, SearchInput, type BaseTableColumn } from '@pickid/ui';
import { PATH, HREF } from '@/constants/routes';
import { TEST_TYPES, TEST_STATUSES } from '@/constants/test';
import { formatDate } from '@/utils';
import { getTestTypeLabel, getTestTypeVariant, getTestStatusLabel, getTestStatusVariant } from '@/utils/test';
import type { Test, TestType, TestStatus } from '@pickid/supabase';

export function TestListPage() {
	const navigate = useNavigate();
	const [typeFilter, setTypeFilter] = useState<TestType[]>([]);
	const [statusFilter, setStatusFilter] = useState<TestStatus[]>([]);
	const [search, setSearch] = useState('');
	const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

	const [searchParams] = useSearchParams();
	const currentPage = Number(searchParams.get('page')) || 1;

	const { data, isLoading } = useTestsQuery({
		type: typeFilter[0],
		status: statusFilter[0],
		search: search || undefined,
		page: currentPage,
		pageSize: 20,
	});

	const tests = data?.tests ?? [];
	const totalCount = data?.count ?? 0;

	const { totalPages, handlePageChange } = usePagination({ totalCount });

	const handleCreateTest = () => {
		navigate(PATH.TEST_CREATE);
	};

	const handleCloseModal = () => setSelectedTestId(null);

	const columns: BaseTableColumn<Test>[] = [
		{
			key: 'no',
			header: 'No',
			width: 60,
			renderCell: (_, index) => (
				<span className="text-neutral-500">{(currentPage - 1) * 20 + index + 1}</span>
			),
		},
		{
			key: 'thumbnail',
			header: '',
			width: 60,
			renderCell: (row) =>
				row.thumbnail_url ? (
					<img src={row.thumbnail_url} alt={row.title} className="w-10 h-10 rounded-md object-cover" />
				) : (
					<div className="w-10 h-10 bg-neutral-200 rounded-md flex items-center justify-center">
						<span className="text-neutral-400 text-xs">IMG</span>
					</div>
				),
		},
		{
			key: 'title',
			header: '테스트명',
			renderCell: (row) => (
				<div className="min-w-0">
					<div className="text-neutral-900 font-medium truncate">{row.title}</div>
					<div className="text-xs text-neutral-400 truncate">{row.slug}</div>
				</div>
			),
		},
		{
			key: 'type',
			header: '유형',
			width: 110,
			filterOptions: TEST_TYPES,
			filterValue: typeFilter,
			onFilterChange: (values) => setTypeFilter(values as TestType[]),
			renderCell: (row) => (
				<Badge variant={getTestTypeVariant(row.type)} className="whitespace-nowrap">
					{getTestTypeLabel(row.type)}
				</Badge>
			),
		},
		{
			key: 'status',
			header: '상태',
			width: 100,
			filterOptions: TEST_STATUSES,
			filterValue: statusFilter,
			onFilterChange: (values) => setStatusFilter(values as TestStatus[]),
			renderCell: (row) => (
				<Badge variant={getTestStatusVariant(row.status)} className="whitespace-nowrap">
					{getTestStatusLabel(row.status)}
				</Badge>
			),
		},
		{
			key: 'participants',
			header: '참여수',
			width: 80,
			renderCell: () => <span className="text-sm text-neutral-500">-</span>,
		},
		{
			key: 'created_at',
			header: '생성일',
			width: 120,
			renderCell: (row) => <span className="text-sm text-neutral-500">{formatDate(row.created_at)}</span>,
		},
		{
			key: 'actions',
			header: '',
			width: 100,
			renderCell: (row) => (
				<div className="flex items-center space-x-1">
					<IconButton
						variant="ghost"
						icon={<Eye className="w-4 h-4" />}
						className="text-neutral-400 hover:text-neutral-600"
						aria-label="상세보기"
						onClick={(e) => {
							e.stopPropagation();
							setSelectedTestId(row.id);
						}}
					/>
					<IconButton
						variant="ghost"
						icon={<Edit className="w-4 h-4" />}
						className="text-neutral-400 hover:text-neutral-600"
						aria-label="수정"
						onClick={(e) => {
							e.stopPropagation();
							navigate(HREF.TEST_EDIT(row.id));
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
						<span className="text-sm text-neutral-500">총 {totalCount}개</span>
					</div>
					<div className="flex items-center gap-2">
						<SearchInput
							placeholder="테스트명, 슬러그 검색..."
							value={search}
							onSearch={setSearch}
							className="w-64"
						/>
						<IconButton
							icon={<Plus className="w-4 h-4" />}
							text="테스트 만들기"
							onClick={handleCreateTest}
							className="bg-black text-white px-4 py-2 rounded-md hover:bg-neutral-800 transition-colors"
							aria-label="테스트 만들기"
						/>
					</div>
				</div>
			</header>

			<main className="p-6">
				<BaseTable data={tests} columns={columns} isLoading={isLoading} onRowClick={(row) => setSelectedTestId(row.id)} />

				{!isLoading && totalPages > 1 && (
					<div className="mt-6 flex justify-center">
						<DefaultPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
					</div>
				)}
			</main>

			{selectedTestId && (
				<TestDetailModal testId={selectedTestId} isOpen={!!selectedTestId} onClose={handleCloseModal} />
			)}
		</>
	);
}
