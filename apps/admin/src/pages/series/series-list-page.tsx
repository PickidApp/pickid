import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit, ToggleLeft, ToggleRight, Trash2, FileText } from 'lucide-react';
import { usePagination } from '@/hooks';
import { useSeriesQuery, useDeleteSeries, useUpdateSeriesStatus } from '@/api';
import {
	DefaultTable,
	Badge,
	ConfirmDialog,
	DefaultPagination,
	IconButton,
	SearchInput,
	useModal,
	type DefaultTableColumn,
} from '@pickid/ui';
import { SeriesModal } from '@/components/series/series-modal';
import { SeriesDetailModal } from '@/components/series/series-detail-modal';
import { SERIES_STATUSES } from '@/constants/series';
import { formatDate } from '@/utils';
import type { SeriesWithCount } from '@/types/series';

function getSeriesStatusLabel(isActive: boolean): string {
	return isActive ? '활성' : '비활성';
}

function getSeriesStatusVariant(isActive: boolean): 'default' | 'secondary' {
	return isActive ? 'default' : 'secondary';
}

export default function SeriesListPage() {
	const [statusFilter, setStatusFilter] = useState<string[]>([]);
	const [search, setSearch] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedSeries, setSelectedSeries] = useState<SeriesWithCount | undefined>(undefined);
	const [detailSeries, setDetailSeries] = useState<SeriesWithCount | null>(null);

	const deleteConfirm = useModal();
	const [deleteTarget, setDeleteTarget] = useState<SeriesWithCount | null>(null);

	const [searchParams] = useSearchParams();
	const currentPage = Number(searchParams.get('page')) || 1;

	// 필터 값을 boolean으로 변환
	const isActiveFilter =
		statusFilter.length === 1 ? (statusFilter[0] === 'active' ? true : false) : undefined;

	const { data, isLoading } = useSeriesQuery({
		is_active: isActiveFilter,
		search: search || undefined,
		page: currentPage,
		pageSize: 20,
	});

	const deleteSeries = useDeleteSeries();
	const updateSeriesStatus = useUpdateSeriesStatus();

	const seriesList = data?.series ?? [];
	const totalCount = data?.count ?? 0;

	const { totalPages, handlePageChange } = usePagination({ totalCount });

	const handleOpenCreateModal = () => {
		setSelectedSeries(undefined);
		setIsModalOpen(true);
	};

	const handleOpenEditModal = (series: SeriesWithCount) => {
		setSelectedSeries(series);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedSeries(undefined);
	};

	const handleToggleStatus = (series: SeriesWithCount) => {
		updateSeriesStatus.mutate({ seriesId: series.id, is_active: !series.is_active });
	};

	const handleOpenDeleteConfirm = (series: SeriesWithCount) => {
		setDeleteTarget(series);
		deleteConfirm.open();
	};

	const handleRowClick = (series: SeriesWithCount) => {
		setDetailSeries(series);
	};

	const handleConfirmDelete = () => {
		if (deleteTarget) {
			deleteSeries.mutate(deleteTarget.id, {
				onSuccess: () => {
					deleteConfirm.close();
					setDeleteTarget(null);
				},
			});
		}
	};

	const columns: DefaultTableColumn<SeriesWithCount>[] = [
		{
			key: 'no',
			header: 'No',
			width: 60,
			renderCell: (_, index) => (
				<span className="text-neutral-500">{(currentPage - 1) * 20 + index + 1}</span>
			),
		},
		{
			key: 'name',
			header: '시리즈명',
			renderCell: (row) => (
				<div>
					<span className="text-neutral-900 font-medium">{row.name}</span>
					{row.description && (
						<p className="text-sm text-neutral-500 truncate max-w-xs">{row.description}</p>
					)}
				</div>
			),
		},
		{
			key: 'sort_order',
			header: '정렬순서',
			width: 100,
			renderCell: (row) => <span className="text-sm text-neutral-500">{row.sort_order}</span>,
		},
		{
			key: 'test_count',
			header: '테스트',
			width: 80,
			renderCell: (row) => (
				<div className="flex items-center gap-1.5 text-sm text-neutral-600">
					<FileText className="w-3.5 h-3.5" />
					<span>{row.test_count}개</span>
				</div>
			),
		},
		{
			key: 'is_active',
			header: '상태',
			width: 100,
			filterOptions: SERIES_STATUSES,
			filterValue: statusFilter,
			onFilterChange: (values) => setStatusFilter(values),
			renderCell: (row) => (
				<Badge variant={getSeriesStatusVariant(row.is_active)}>{getSeriesStatusLabel(row.is_active)}</Badge>
			),
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
			width: 120,
			renderCell: (row) => (
				<div className="flex items-center space-x-1">
					<IconButton
						icon={<Edit className="w-4 h-4" />}
						className="text-neutral-400 hover:text-neutral-600"
						aria-label="수정"
						onClick={(e) => {
							e.stopPropagation();
							handleOpenEditModal(row);
						}}
					/>
					<IconButton
						icon={row.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
						className="text-neutral-400 hover:text-neutral-600"
						aria-label="상태 변경"
						onClick={(e) => {
							e.stopPropagation();
							handleToggleStatus(row);
						}}
						disabled={updateSeriesStatus.isPending}
					/>
					<IconButton
						icon={<Trash2 className="w-4 h-4" />}
						className="text-neutral-400 hover:text-red-600"
						aria-label="삭제"
						onClick={(e) => {
							e.stopPropagation();
							handleOpenDeleteConfirm(row);
						}}
						disabled={deleteSeries.isPending}
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
						<h1 className="text-2xl text-neutral-900">시리즈 관리</h1>
						<span className="text-sm text-neutral-500">총 {totalCount}개</span>
					</div>
					<div className="flex items-center gap-2">
						<SearchInput
							placeholder="시리즈명, 슬러그 검색..."
							value={search}
							onSearch={setSearch}
							className="w-64"
						/>
						<IconButton
							icon={<Plus className="w-4 h-4" />}
							text="시리즈 추가"
							onClick={handleOpenCreateModal}
							className="bg-black text-white px-4 py-2 rounded-md hover:bg-neutral-800 transition-colors"
							aria-label="시리즈 추가"
						/>
					</div>
				</div>
			</header>

			<main className="p-6">
				<DefaultTable data={seriesList} columns={columns} isLoading={isLoading} onRowClick={handleRowClick} />

				{!isLoading && totalPages > 1 && (
					<div className="mt-6 flex justify-center">
						<DefaultPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
					</div>
				)}
			</main>

			<SeriesModal isOpen={isModalOpen} onClose={handleCloseModal} series={selectedSeries} />

			<ConfirmDialog
				open={deleteConfirm.isOpen}
				onOpenChange={deleteConfirm.setIsOpen}
				target={deleteTarget?.name ?? '시리즈'}
				variant="delete"
				onConfirm={handleConfirmDelete}
				isLoading={deleteSeries.isPending}
			/>

			{detailSeries && (
				<SeriesDetailModal
					series={detailSeries}
					isOpen={!!detailSeries}
					onClose={() => setDetailSeries(null)}
				/>
			)}
		</>
	);
}
