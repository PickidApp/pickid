import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit, ToggleLeft, ToggleRight, Trash2, Calendar, FileText } from 'lucide-react';
import { usePagination } from '@/hooks';
import { useThemesQuery, useDeleteTheme, useUpdateThemeStatus } from '@/api';
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
import { ThemeModal } from '@/components/themes/theme-modal';
import { ThemeDetailModal } from '@/components/themes/theme-detail-modal';
import { THEME_STATUSES } from '@/constants/theme';
import { formatDate } from '@/utils';
import type { ThemeStatus, ThemeStatusFilter, ThemeWithCount } from '@/types/theme';

function getThemeStatus(theme: ThemeWithCount): ThemeStatus {
	if (!theme.is_active) return 'inactive';

	const today = new Date().toISOString().split('T')[0];

	if (!theme.start_date && !theme.end_date) return 'ongoing';

	if (theme.start_date && theme.start_date > today) return 'upcoming';

	if (theme.end_date && theme.end_date < today) return 'ended';

	return 'active';
}

function getThemeStatusLabel(status: ThemeStatus): string {
	switch (status) {
		case 'inactive':
			return '비활성';
		case 'ongoing':
			return '상시 진행';
		case 'upcoming':
			return '예정';
		case 'active':
			return '진행중';
		case 'ended':
			return '종료';
	}
}

function getThemeStatusVariant(status: ThemeStatus): 'default' | 'secondary' | 'outline' | 'gray' {
	switch (status) {
		case 'active':
			return 'default';
		case 'ongoing':
			return 'default';
		case 'upcoming':
			return 'outline';
		case 'ended':
			return 'gray';
		case 'inactive':
			return 'secondary';
	}
}

export default function ThemeListPage() {
	const [statusFilter, setStatusFilter] = useState<string[]>([]);
	const [search, setSearch] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTheme, setSelectedTheme] = useState<ThemeWithCount | undefined>(undefined);
	const [detailTheme, setDetailTheme] = useState<ThemeWithCount | null>(null);

	const deleteConfirm = useModal();
	const [deleteTarget, setDeleteTarget] = useState<ThemeWithCount | null>(null);

	const [searchParams] = useSearchParams();
	const currentPage = Number(searchParams.get('page')) || 1;

	// 필터 값 변환
	const statusFilterValue = statusFilter.length === 1 ? (statusFilter[0] as ThemeStatusFilter) : undefined;

	const { data, isLoading } = useThemesQuery({
		status: statusFilterValue,
		search: search || undefined,
		page: currentPage,
		pageSize: 20,
	});

	const deleteTheme = useDeleteTheme();
	const updateThemeStatus = useUpdateThemeStatus();

	const themeList = data?.themes ?? [];
	const totalCount = data?.count ?? 0;

	const { totalPages, handlePageChange } = usePagination({ totalCount });

	const handleOpenCreateModal = () => {
		setSelectedTheme(undefined);
		setIsModalOpen(true);
	};

	const handleOpenEditModal = (theme: ThemeWithCount) => {
		setSelectedTheme(theme);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedTheme(undefined);
	};

	const handleToggleStatus = (theme: ThemeWithCount) => {
		updateThemeStatus.mutate({ themeId: theme.id, is_active: !theme.is_active });
	};

	const handleOpenDeleteConfirm = (theme: ThemeWithCount) => {
		setDeleteTarget(theme);
		deleteConfirm.open();
	};

	const handleRowClick = (theme: ThemeWithCount) => {
		setDetailTheme(theme);
	};

	const handleConfirmDelete = () => {
		if (deleteTarget) {
			deleteTheme.mutate(deleteTarget.id, {
				onSuccess: () => {
					deleteConfirm.close();
					setDeleteTarget(null);
				},
			});
		}
	};

	const columns: DefaultTableColumn<ThemeWithCount>[] = [
		{
			key: 'no',
			header: 'No',
			width: 60,
			renderCell: (_, index) => <span className="text-neutral-500">{(currentPage - 1) * 20 + index + 1}</span>,
		},
		{
			key: 'name',
			header: '테마명',
			renderCell: (row) => (
				<div>
					<span className="text-neutral-900 font-medium">{row.name}</span>
					{row.description && <p className="text-sm text-neutral-500 truncate max-w-xs">{row.description}</p>}
				</div>
			),
		},
		{
			key: 'period',
			header: '기간',
			width: 200,
			renderCell: (row) => {
				if (!row.start_date && !row.end_date) {
					return <span className="text-neutral-400">상시 진행</span>;
				}
				return (
					<div className="flex items-center gap-1.5 text-sm text-neutral-600">
						<Calendar className="w-3.5 h-3.5" />
						<span>
							{row.start_date ? formatDate(row.start_date) : '?'} ~ {row.end_date ? formatDate(row.end_date) : '미정'}
						</span>
					</div>
				);
			},
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
			key: 'status',
			header: '상태',
			width: 100,
			filterOptions: THEME_STATUSES,
			filterValue: statusFilter,
			onFilterChange: (values) => setStatusFilter(values),
			renderCell: (row) => {
				const status = getThemeStatus(row);
				return <Badge variant={getThemeStatusVariant(status)}>{getThemeStatusLabel(status)}</Badge>;
			},
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
						disabled={updateThemeStatus.isPending}
					/>
					<IconButton
						icon={<Trash2 className="w-4 h-4" />}
						className="text-neutral-400 hover:text-red-600"
						aria-label="삭제"
						onClick={(e) => {
							e.stopPropagation();
							handleOpenDeleteConfirm(row);
						}}
						disabled={deleteTheme.isPending}
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
						<h1 className="text-2xl text-neutral-900">테마 관리</h1>
						<span className="text-sm text-neutral-500">총 {totalCount}개</span>
					</div>
					<div className="flex items-center gap-2">
						<SearchInput placeholder="테마명, 슬러그 검색..." value={search} onSearch={setSearch} className="w-64" />
						<IconButton
							icon={<Plus className="w-4 h-4" />}
							text="테마 추가"
							onClick={handleOpenCreateModal}
							className="bg-black text-white px-4 py-2 rounded-md hover:bg-neutral-800 transition-colors"
							aria-label="테마 추가"
						/>
					</div>
				</div>
			</header>

			<main className="p-6">
				<DefaultTable data={themeList} columns={columns} isLoading={isLoading} onRowClick={handleRowClick} />

				{!isLoading && totalPages > 1 && (
					<div className="mt-6 flex justify-center">
						<DefaultPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
					</div>
				)}
			</main>

			<ThemeModal isOpen={isModalOpen} onClose={handleCloseModal} theme={selectedTheme} />

			<ConfirmDialog
				open={deleteConfirm.isOpen}
				onOpenChange={deleteConfirm.setIsOpen}
				target={deleteTarget?.name ?? '테마'}
				variant="delete"
				onConfirm={handleConfirmDelete}
				isLoading={deleteTheme.isPending}
			/>

			{detailTheme && (
				<ThemeDetailModal theme={detailTheme} isOpen={!!detailTheme} onClose={() => setDetailTheme(null)} />
			)}
		</>
	);
}
