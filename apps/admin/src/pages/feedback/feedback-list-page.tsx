import { useFeedbacksQuery, useFeedbackSummaryQuery, useDeleteFeedback, useUpdateFeedbackStatus } from '@/api';
import { StatCard } from '@/components/common/stat-card';
import { FeedbackDetailModal } from '@/components/feedback/feedback-detail-modal';
import { FeedbackReplyModal } from '@/components/feedback/feedback-reply-modal';
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from '@/constants/feedback';
import { usePagination } from '@/hooks';
import type { Feedback } from '@/types/feedback';
import type { FeedbackCategory, FeedbackStatus } from '@pickid/supabase';
import { getFeedbackCategoryLabel, getFeedbackStatusLabel, getFeedbackCategoryVariant, getFeedbackStatusVariant } from '@/utils/feedback';
import { formatDate } from '@/utils';
import {
	Badge,
	DefaultTable,
	ConfirmDialog,
	DefaultPagination,
	IconButton,
	SearchInput,
	useModal,
	type DefaultTableColumn,
} from '@pickid/ui';
import { Eye, MessageSquare, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function FeedbackListPage() {
	const [statusFilter, setStatusFilter] = useState<FeedbackStatus[]>([]);
	const [categoryFilter, setCategoryFilter] = useState<FeedbackCategory[]>([]);
	const [search, setSearch] = useState('');
	const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

	const detailModal = useModal();
	const replyModal = useModal();
	const deleteConfirm = useModal();
	const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

	const [searchParams] = useSearchParams();
	const currentPage = Number(searchParams.get('page')) || 1;

	const { data, isLoading } = useFeedbacksQuery({
		status: statusFilter[0],
		category: categoryFilter[0],
		search: search || undefined,
		page: currentPage,
		pageSize: 20,
	});

	const { data: summary } = useFeedbackSummaryQuery();

	const feedbacks = data?.feedbacks ?? [];
	const totalCount = data?.count ?? 0;

	const { totalPages, handlePageChange } = usePagination({ totalCount });

	const updateMutation = useUpdateFeedbackStatus();
	const deleteMutation = useDeleteFeedback();

	const handleOpenDetail = (feedback: Feedback) => {
		setSelectedFeedback(feedback);
		detailModal.open();
	};

	const handleOpenReply = (feedback: Feedback) => {
		setSelectedFeedback(feedback);
		replyModal.open();
	};

	const handleReplyFromDetail = () => {
		detailModal.close();
		replyModal.open();
	};

	const handleSubmitReply = (status: FeedbackStatus, adminNote: string) => {
		if (!selectedFeedback) return;
		updateMutation.mutate(
			{ id: selectedFeedback.id, status, adminNote },
			{
				onSuccess: () => {
					replyModal.close();
					detailModal.close();
				},
			}
		);
	};

	const handleOpenDeleteConfirm = (id: string) => {
		setDeleteTargetId(id);
		deleteConfirm.open();
	};

	const handleConfirmDelete = () => {
		if (deleteTargetId) {
			deleteMutation.mutate(deleteTargetId, {
				onSuccess: () => {
					deleteConfirm.close();
					setDeleteTargetId(null);
				},
			});
		}
	};

	const columns: DefaultTableColumn<Feedback>[] = [
		{
			key: 'no',
			header: 'No',
			width: 60,
			renderCell: (_, index) => (
				<span className="text-neutral-500">{(currentPage - 1) * 20 + index + 1}</span>
			),
		},
		{
			key: 'content',
			header: '내용',
			renderCell: (row) => (
				<div className="max-w-md">
					<p className="text-neutral-900 truncate">{row.content}</p>
				</div>
			),
		},
		{
			key: 'category',
			header: '카테고리',
			filterOptions: FEEDBACK_CATEGORIES,
			filterValue: categoryFilter,
			onFilterChange: (values) => setCategoryFilter(values as FeedbackCategory[]),
			renderCell: (row) => <Badge variant={getFeedbackCategoryVariant(row.category)}>{getFeedbackCategoryLabel(row.category)}</Badge>,
		},
		{
			key: 'test',
			header: '관련 테스트',
			renderCell: (row) => <span className="text-neutral-500 text-sm">{row.tests?.title || '-'}</span>,
		},
		{
			key: 'user',
			header: '작성자',
			renderCell: (row) => <span className="text-neutral-700">{row.users?.email || '익명'}</span>,
		},
		{
			key: 'status',
			header: '상태',
			filterOptions: FEEDBACK_STATUSES,
			filterValue: statusFilter,
			onFilterChange: (values) => setStatusFilter(values as FeedbackStatus[]),
			renderCell: (row) => <Badge variant={getFeedbackStatusVariant(row.status)}>{getFeedbackStatusLabel(row.status)}</Badge>,
		},
		{
			key: 'created_at',
			header: '작성일',
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
							handleOpenDetail(row);
						}}
					/>
					<IconButton
						variant="ghost"
						icon={<MessageSquare className="w-4 h-4" />}
						className="text-neutral-400 hover:text-neutral-600"
						aria-label="처리하기"
						onClick={(e) => {
							e.stopPropagation();
							handleOpenReply(row);
						}}
					/>
					<IconButton
						variant="ghost"
						icon={<Trash2 className="w-4 h-4" />}
						className="text-neutral-400 hover:text-red-600"
						aria-label="삭제"
						onClick={(e) => {
							e.stopPropagation();
							handleOpenDeleteConfirm(row.id);
						}}
					/>
				</div>
			),
		},
	];

	const stats: { label: string; value: number; color: 'default' | 'green' | 'red' | 'gray' | 'yellow' }[] = [
		{ label: '전체', value: summary?.total ?? 0, color: 'default' },
		{ label: '신규', value: summary?.new ?? 0, color: 'red' },
		{ label: '처리중', value: summary?.in_progress ?? 0, color: 'yellow' },
		{ label: '완료', value: summary?.resolved ?? 0, color: 'green' },
		{ label: '보류', value: summary?.rejected ?? 0, color: 'gray' },
	];

	return (
		<>
			<header className="bg-white border-b px-6 py-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-4">
						<h1 className="text-2xl text-neutral-900">피드백 관리</h1>
						<span className="text-sm text-neutral-500">총 {totalCount}건</span>
					</div>
					<div className="flex items-center gap-2">
						<SearchInput placeholder="내용 검색..." value={search} onSearch={setSearch} className="w-64" />
					</div>
				</div>
			</header>

			<main className="p-6">
				<div className="flex gap-3 mb-6">
					{stats.map((stat) => (
						<StatCard key={stat.label} {...stat} />
					))}
				</div>

				<DefaultTable data={feedbacks} columns={columns} isLoading={isLoading} onRowClick={handleOpenDetail} />

				{!isLoading && totalPages > 1 && (
					<div className="mt-6 flex justify-center">
						<DefaultPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
					</div>
				)}
			</main>

			<FeedbackDetailModal
				feedback={selectedFeedback}
				open={detailModal.isOpen}
				onOpenChange={detailModal.setIsOpen}
				onReply={handleReplyFromDetail}
			/>

			<FeedbackReplyModal
				feedback={selectedFeedback}
				open={replyModal.isOpen}
				onOpenChange={replyModal.setIsOpen}
				onSubmit={handleSubmitReply}
				isLoading={updateMutation.isPending}
			/>

			<ConfirmDialog
				open={deleteConfirm.isOpen}
				onOpenChange={deleteConfirm.setIsOpen}
				target="피드백"
				variant="delete"
				onConfirm={handleConfirmDelete}
				isLoading={deleteMutation.isPending}
			/>
		</>
	);
}



