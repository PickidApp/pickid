import type { Feedback } from '@/services/feedback.service';
import { getFeedbackCategoryLabel, getFeedbackStatusLabel, getFeedbackCategoryVariant, getFeedbackStatusVariant } from '@/utils/feedback';
import { formatDate } from '@/utils';
import {
	Badge,
	BaseModal,
	BaseModalContent,
	BaseModalFooter,
	BaseModalHeader,
	BaseModalTitle,
	Button,
} from '@pickid/ui';

interface FeedbackDetailModalProps {
	feedback: Feedback | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onReply: () => void;
}

export function FeedbackDetailModal({ feedback, open, onOpenChange, onReply }: FeedbackDetailModalProps) {
	if (!feedback) return null;

	const handleClose = () => onOpenChange(false);

	return (
		<BaseModal open={open} onOpenChange={onOpenChange}>
			<BaseModalHeader onClose={handleClose}>
				<BaseModalTitle>피드백 상세</BaseModalTitle>
			</BaseModalHeader>
			<BaseModalContent className="space-y-4">
				<div className="flex items-center gap-2 flex-wrap">
					<Badge variant={getFeedbackCategoryVariant(feedback.category)}>{getFeedbackCategoryLabel(feedback.category)}</Badge>
					<Badge variant={getFeedbackStatusVariant(feedback.status)}>{getFeedbackStatusLabel(feedback.status)}</Badge>
				</div>

				<div className="text-sm text-neutral-500 space-y-1">
					<p>작성자: {feedback.users?.email || '익명'}</p>
					{feedback.tests?.title && <p>관련 테스트: {feedback.tests.title}</p>}
					<p>작성일: {formatDate(feedback.created_at)}</p>
				</div>

				<div className="border-t pt-4">
					<h4 className="text-sm font-medium text-neutral-700 mb-2">내용</h4>
					<p className="text-sm text-neutral-600 whitespace-pre-wrap bg-neutral-50 p-3 rounded-md">
						{feedback.content}
					</p>
				</div>

				{feedback.admin_note && (
					<div className="border-t pt-4">
						<h4 className="text-sm font-medium text-neutral-700 mb-2">관리자 메모</h4>
						<p className="text-sm text-neutral-600 whitespace-pre-wrap bg-blue-50 p-3 rounded-md">
							{feedback.admin_note}
						</p>
					</div>
				)}
			</BaseModalContent>
			<BaseModalFooter>
				<Button variant="outline" onClick={handleClose} text="닫기" />
				{feedback.status !== 'resolved' && (
					<Button onClick={onReply} text="처리하기" />
				)}
			</BaseModalFooter>
		</BaseModal>
	);
}
