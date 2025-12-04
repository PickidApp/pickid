import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { usePagination } from '@/hooks';
import { useCategoriesQuery } from '@/api/queries';
import { useDeleteCategory, useUpdateCategoryStatus } from '@/api/mutations';
import {
	BaseTable,
	Badge,
	ConfirmDialog,
	DefaultPagination,
	IconButton,
	SearchInput,
	useModal,
	type BaseTableColumn,
} from '@pickid/ui';
import { CategoryModal } from '@/components/categories/category-modal';
import { CATEGORY_STATUSES } from '@/constants/category';
import { formatDate } from '@/utils';
import { getCategoryStatusLabel, getCategoryStatusVariant } from '@/utils/category';
import type { Category } from '@pickid/supabase';
import type { CategoryStatus } from '@/services/category.service';

export default function CategoryListPage() {
	const [statusFilter, setStatusFilter] = useState<CategoryStatus[]>([]);
	const [search, setSearch] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);

	const deleteConfirm = useModal();
	const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

	const [searchParams] = useSearchParams();
	const currentPage = Number(searchParams.get('page')) || 1;

	const { data, isLoading } = useCategoriesQuery({
		status: statusFilter[0],
		search: search || undefined,
		page: currentPage,
		pageSize: 20,
	});

	const deleteCategory = useDeleteCategory();
	const updateCategoryStatus = useUpdateCategoryStatus();

	const categories = data?.categories ?? [];
	const totalCount = data?.count ?? 0;

	const { totalPages, handlePageChange } = usePagination({ totalCount });

	const handleOpenCreateModal = () => {
		setSelectedCategory(undefined);
		setIsModalOpen(true);
	};

	const handleOpenEditModal = (category: Category) => {
		setSelectedCategory(category);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedCategory(undefined);
	};

	const handleToggleStatus = (category: Category) => {
		const newStatus: CategoryStatus = category.status === 'active' ? 'inactive' : 'active';
		updateCategoryStatus.mutate({ categoryId: category.id, status: newStatus });
	};

	const handleOpenDeleteConfirm = (category: Category) => {
		setDeleteTarget(category);
		deleteConfirm.open();
	};

	const handleConfirmDelete = () => {
		if (deleteTarget) {
			deleteCategory.mutate(deleteTarget.id);
			deleteConfirm.close();
			setDeleteTarget(null);
		}
	};

	const columns: BaseTableColumn<Category>[] = [
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
			header: '카테고리명',
			renderCell: (row) => <span className="text-neutral-900 font-medium">{row.name}</span>,
		},
		{
			key: 'slug',
			header: '슬러그',
			renderCell: (row) => <span className="text-sm text-neutral-500">{row.slug}</span>,
		},
		{
			key: 'status',
			header: '상태',
			width: 100,
			filterOptions: CATEGORY_STATUSES,
			filterValue: statusFilter,
			onFilterChange: (values) => setStatusFilter(values as CategoryStatus[]),
			renderCell: (row) => (
				<Badge variant={getCategoryStatusVariant(row.status)}>{getCategoryStatusLabel(row.status)}</Badge>
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
						variant="ghost"
						icon={<Edit className="w-4 h-4" />}
						className="text-neutral-400 hover:text-neutral-600"
						aria-label="수정"
						onClick={(e) => {
							e.stopPropagation();
							handleOpenEditModal(row);
						}}
					/>
					<IconButton
						variant="ghost"
						icon={row.status === 'active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
						className="text-neutral-400 hover:text-neutral-600"
						aria-label="상태 변경"
						onClick={(e) => {
							e.stopPropagation();
							handleToggleStatus(row);
						}}
						disabled={updateCategoryStatus.isPending}
					/>
					<IconButton
						variant="ghost"
						icon={<Trash2 className="w-4 h-4" />}
						className="text-neutral-400 hover:text-red-600"
						aria-label="삭제"
						onClick={(e) => {
							e.stopPropagation();
							handleOpenDeleteConfirm(row);
						}}
						disabled={deleteCategory.isPending}
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
						<h1 className="text-2xl text-neutral-900">카테고리 관리</h1>
						<span className="text-sm text-neutral-500">총 {totalCount}개</span>
					</div>
					<div className="flex items-center gap-2">
						<SearchInput
							placeholder="카테고리명, 슬러그 검색..."
							value={search}
							onSearch={setSearch}
							className="w-64"
						/>
						<IconButton
							icon={<Plus className="w-4 h-4" />}
							text="카테고리 추가"
							onClick={handleOpenCreateModal}
							className="bg-black text-white px-4 py-2 rounded-md hover:bg-neutral-800 transition-colors"
							aria-label="카테고리 추가"
						/>
					</div>
				</div>
			</header>

			<main className="p-6">
				<BaseTable data={categories} columns={columns} isLoading={isLoading} />

				{!isLoading && totalPages > 1 && (
					<div className="mt-6 flex justify-center">
						<DefaultPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
					</div>
				)}
			</main>

			<CategoryModal isOpen={isModalOpen} onClose={handleCloseModal} category={selectedCategory} />

			<ConfirmDialog
				open={deleteConfirm.isOpen}
				onOpenChange={deleteConfirm.setIsOpen}
				target={deleteTarget?.name ?? '카테고리'}
				variant="delete"
				onConfirm={handleConfirmDelete}
				isLoading={deleteCategory.isPending}
			/>
		</>
	);
}
