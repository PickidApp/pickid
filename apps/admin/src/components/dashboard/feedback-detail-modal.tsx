import { useState } from 'react';
import type { FeedbackListItem } from '@/types/dashboard';
import { useUpdateFeedbackStatus } from '@/api';
import { X } from 'lucide-react';
import { FEEDBACK_STATUSES } from '@/constants/feedback';
import { formatDateTimeKorean, getFeedbackCategoryLabel } from '@/utils';
import { IconButton, Button, FormField, DefaultSelect, Textarea } from '@pickid/ui';

interface FeedbackDetailModalProps {
	feedback: FeedbackListItem;
	isOpen: boolean;
	onClose: () => void;
}

export function FeedbackDetailModal(props: FeedbackDetailModalProps) {
	const { feedback, isOpen, onClose } = props;
	const feedbackUpdate = useUpdateFeedbackStatus();

	const [status, setStatus] = useState(feedback.status);
	const [adminNote, setAdminNote] = useState('');

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

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
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
				<div className="flex items-center justify-between p-6 border-b">
					<h2 className="text-xl font-bold">피드백 상세</h2>
					<IconButton icon={<X size={20} />} onClick={onClose} variant="ghost" className="hover:bg-gray-100" />
				</div>

				<div className="p-6 space-y-4">
					<FormField label="카테고리">
						<p className="mt-1">{getFeedbackCategoryLabel(feedback.category)}</p>
					</FormField>

					<FormField label="작성자">
						<p className="mt-1">{feedback.users?.email || '익명'}</p>
					</FormField>

					<FormField label="관련 테스트">
						<p className="mt-1">{feedback.tests?.title || '-'}</p>
					</FormField>

					<FormField label="내용">
						<p className="mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded">{feedback.content}</p>
					</FormField>

					<FormField label="작성일시">
						<p className="mt-1">{formatDateTimeKorean(feedback.created_at)}</p>
					</FormField>

					<hr />

					<form onSubmit={handleSubmit} className="space-y-4">
						<FormField label="상태 변경" htmlFor="status">
							<DefaultSelect
								id="status"
								value={status}
								onValueChange={(value) => setStatus(value as typeof status)}
								options={FEEDBACK_STATUSES.map((s) => ({
									value: s.value,
									label: s.label,
								}))}
								placeholder="상태를 선택해주세요"
							/>
						</FormField>

						<FormField label="관리자 메모" htmlFor="adminNote">
							<Textarea
								id="adminNote"
								value={adminNote}
								onChange={(e) => setAdminNote(e.target.value)}
								rows={4}
								placeholder="처리 내용이나 메모를 입력하세요..."
							/>
						</FormField>

						<div className="flex gap-2 justify-end">
							<Button type="button" onClick={onClose} variant="outline" text="취소" />
							<Button
								type="submit"
								disabled={feedbackUpdate.isPending}
								loading={feedbackUpdate.isPending}
								text="저장"
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
