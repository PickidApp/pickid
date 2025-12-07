import { useUpdateFeedbackStatus } from '@/api';
import { FEEDBACK_STATUSES } from '@/constants/feedback';
import type { FeedbackListItem } from '@/types/dashboard';
import {
	formatDateTimeKorean,
	getFeedbackCategoryLabel,
	getFeedbackCategoryVariant,
	getFeedbackStatusLabel,
	getFeedbackStatusVariant,
} from '@/utils';
import type { FeedbackStatus } from '@pickid/supabase';
import {
	Badge,
	DefaultModal,
	DefaultModalContent,
	DefaultModalFooter,
	DefaultModalHeader,
	DefaultModalTitle,
	Button,
	DefaultSelect,
	DefaultTextarea,
} from '@pickid/ui';
import { useEffect, useState } from 'react';

interface FeedbackDetailModalProps {
	feedback: FeedbackListItem | null;
	isOpen: boolean;
	onClose: () => void;
}

export function FeedbackDetailModal({ feedback, isOpen, onClose }: FeedbackDetailModalProps) {
	const feedbackUpdate = useUpdateFeedbackStatus();

	const [status, setStatus] = useState<FeedbackStatus>('new');
	const [adminNote, setAdminNote] = useState('');

	useEffect(() => {
		if (isOpen && feedback) {
			setStatus(feedback.status);
			setAdminNote('');
		}
	}, [isOpen, feedback]);

	if (!feedback) return null;

	const handleSubmit = () => {
		feedbackUpdate.mutate(
			{
				id: feedback.id,
				status,
				adminNote: adminNote || undefined,
			},
			{
				onSuccess: () => onClose(),
			}
		);
	};

	return (
		<DefaultModal open={isOpen} onOpenChange={onClose}>
			<DefaultModalHeader onClose={onClose}>
				<DefaultModalTitle>피드백 상세</DefaultModalTitle>
			</DefaultModalHeader>
			<DefaultModalContent className="space-y-4">
				<div className="flex items-center gap-2 flex-wrap">
					<Badge variant={getFeedbackCategoryVariant(feedback.category)}>
						{getFeedbackCategoryLabel(feedback.category)}
					</Badge>
					<Badge variant={getFeedbackStatusVariant(feedback.status)}>{getFeedbackStatusLabel(feedback.status)}</Badge>
				</div>

				<div className="text-sm text-neutral-500 space-y-1">
					<p>작성자: {feedback.users?.email || '익명'}</p>
					{feedback.tests?.title && <p>관련 테스트: {feedback.tests.title}</p>}
					<p>작성일: {formatDateTimeKorean(feedback.created_at)}</p>
				</div>

				<div className="border-t pt-4">
					<h4 className="text-sm font-medium text-neutral-700 mb-2">내용</h4>
					<p className="text-sm text-neutral-600 whitespace-pre-wrap bg-neutral-50 p-3 rounded-md">
						{feedback.content}
					</p>
				</div>

				<div className="border-t pt-4 space-y-4">
					<div>
						<DefaultSelect
							value={status}
							onValueChange={(value) => setStatus(value as FeedbackStatus)}
							options={FEEDBACK_STATUSES}
							placeholder="상태 선택"
							label="상태 변경"
						/>
					</div>
					<div>
						<DefaultTextarea
							value={adminNote}
							onChange={(e) => setAdminNote(e.target.value)}
							placeholder="처리 내용이나 메모를 입력하세요..."
							rows={3}
							className="resize-none"
							label="관리자 메모"
						/>
					</div>
				</div>
			</DefaultModalContent>
			<DefaultModalFooter className="py-3">
				<Button variant="outline" onClick={onClose} text="취소" />
				<Button
					onClick={handleSubmit}
					disabled={feedbackUpdate.isPending}
					text="저장"
					loading={feedbackUpdate.isPending}
				/>
			</DefaultModalFooter>
		</DefaultModal>
	);
}
