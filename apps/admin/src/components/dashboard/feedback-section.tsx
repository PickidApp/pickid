import { useState } from 'react';
import type { FeedbackListItem } from '@/types/dashboard';
import { FeedbackDetailModal } from './feedback-detail-modal';
import { ArrowRight } from 'lucide-react';
import {
	formatDateTimeKorean,
	getFeedbackStatusLabel,
	getFeedbackCategoryLabel,
	getFeedbackStatusColor,
} from '@/utils';
import { useModal, Button, BaseTable, type BaseTableColumn } from '@pickid/ui';

interface FeedbackSectionProps {
	data: FeedbackListItem[];
}

export function FeedbackSection({ data }: FeedbackSectionProps) {
	const [selectedFeedback, setSelectedFeedback] = useState<FeedbackListItem | null>(null);
	const { open, close, isOpen } = useModal();

	const handleRowClick = (feedback: FeedbackListItem) => {
		setSelectedFeedback(feedback);
		open();
	};

	const columns: BaseTableColumn<FeedbackListItem>[] = [
		{
			key: 'status',
			header: '상태',
			width: 80,
			renderCell: (row) => (
				<span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getFeedbackStatusColor(row.status)}`}>
					{getFeedbackStatusLabel(row.status)}
				</span>
			),
		},
		{
			key: 'category',
			header: '카테고리',
			width: 100,
			renderCell: (row) => <span className="text-neutral-900">{getFeedbackCategoryLabel(row.category)}</span>,
		},
		{
			key: 'content',
			header: '내용',
			renderCell: (row) => <span className="text-neutral-900 truncate block max-w-md">{row.content}</span>,
		},
		{
			key: 'test',
			header: '관련 테스트',
			width: 150,
			renderCell: (row) => <span className="text-neutral-600">{row.tests?.title || '-'}</span>,
		},
		{
			key: 'user',
			header: '작성자',
			width: 150,
			renderCell: (row) => <span className="text-neutral-600">{row.users?.email || '익명'}</span>,
		},
		{
			key: 'created_at',
			header: '작성일',
			width: 140,
			renderCell: (row) => <span className="text-neutral-500">{formatDateTimeKorean(row.created_at)}</span>,
		},
	];

	return (
		<div className="bg-white border border-neutral-200 rounded-lg p-6 mb-8">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg text-neutral-900">최근 피드백</h3>
					<p className="text-sm text-neutral-500 mt-1">사용자 피드백 및 제안사항</p>
				</div>
				<Button variant="ghost" size="sm" className="text-neutral-600 hover:text-neutral-900">
					전체보기 <ArrowRight className="w-3 h-3 ml-1" />
				</Button>
			</div>

			<BaseTable
				data={data}
				columns={columns}
				emptyMessage="최근 피드백이 없습니다."
				onRowClick={handleRowClick}
			/>

			{selectedFeedback && (
				<FeedbackDetailModal
					feedback={selectedFeedback}
					isOpen={isOpen}
					onClose={() => {
						close();
						setSelectedFeedback(null);
					}}
				/>
			)}
		</div>
	);
}
