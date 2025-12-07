import { useState } from 'react';
import type { Feedback } from '@/types/feedback';
import type { FeedbackStatus } from '@pickid/supabase';
import { FEEDBACK_STATUSES } from '@/constants/feedback';
import {
	DefaultModal,
	DefaultModalContent,
	DefaultModalFooter,
	DefaultModalHeader,
	DefaultModalTitle,
	DefaultSelect,
	Button,
	DefaultTextarea,
} from '@pickid/ui';

interface FeedbackReplyModalProps {
	feedback: Feedback | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (status: FeedbackStatus, adminNote: string) => void;
	isLoading?: boolean;
}

export function FeedbackReplyModal({ feedback, open, onOpenChange, onSubmit, isLoading }: FeedbackReplyModalProps) {
	const [status, setStatus] = useState<FeedbackStatus>('resolved');
	const [adminNote, setAdminNote] = useState('');

	if (!feedback) return null;

	const handleClose = () => {
		setStatus('resolved');
		setAdminNote('');
		onOpenChange(false);
	};

	const handleSubmit = () => {
		onSubmit(status, adminNote);
		setStatus('resolved');
		setAdminNote('');
	};

	return (
		<DefaultModal open={open} onOpenChange={onOpenChange}>
			<DefaultModalHeader onClose={handleClose}>
				<DefaultModalTitle>피드백 처리</DefaultModalTitle>
			</DefaultModalHeader>
			<DefaultModalContent className="space-y-4">
				<div>
					<p className="text-sm font-medium text-neutral-700 mb-1">내용</p>
					<p className="text-sm text-neutral-600 line-clamp-3">{feedback.content}</p>
				</div>
				<div>
					<label className="text-sm font-medium text-neutral-700 mb-2 block">상태 변경</label>
					<DefaultSelect
						value={status}
						onValueChange={(value) => setStatus(value as FeedbackStatus)}
						options={FEEDBACK_STATUSES}
						placeholder="상태 선택"
					/>
				</div>
				<DefaultTextarea
					label="관리자 메모"
					value={adminNote}
					onChange={(e) => setAdminNote(e.target.value)}
					placeholder="처리 내용이나 메모를 입력하세요..."
					rows={4}
					className="resize-none"
				/>
			</DefaultModalContent>
			<DefaultModalFooter>
				<Button variant="outline" onClick={handleClose} text="취소" />
				<Button onClick={handleSubmit} loading={isLoading} text="저장" />
			</DefaultModalFooter>
		</DefaultModal>
	);
}
