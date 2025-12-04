import { useState } from 'react';
import type { FeedbackListItem } from '@/services/dashboard.service';
import { useUpdateFeedbackStatus } from '@/api/mutations';
import { X } from 'lucide-react';
import { FEEDBACK_CATEGORY_LABELS, FEEDBACK_STATUS_LABELS } from '@/constants';
import { formatDateTimeKorean } from '@/utils';
import { IconButton, Button, FormField, BaseSelect, Textarea } from '@pickid/ui';

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await feedbackUpdate.mutateAsync({
				id: feedback.id,
				status,
				adminNote: adminNote || undefined,
			});
			onClose();
		} catch (error) {
			console.error('피드백 업데이트 실패:', error);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
				<div className="flex items-center justify-between p-6 border-b">
					<h2 className="text-xl font-bold">피드백 상세</h2>
					<IconButton icon={<X size={20} />} onClick={onClose} variant="ghost" className="hover:bg-gray-100" />
				</div>

				{/* 내용 */}
				<div className="p-6 space-y-4">
					<FormField label="카테고리">
						<p className="mt-1">{FEEDBACK_CATEGORY_LABELS[feedback.category]}</p>
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

					{/* 상태 업데이트 폼 */}
					<form onSubmit={handleSubmit} className="space-y-4">
						<FormField label="상태 변경" htmlFor="status">
							<BaseSelect
								id="status"
								value={status}
								onValueChange={(value) => setStatus(value as typeof status)}
								options={Object.entries(FEEDBACK_STATUS_LABELS).map(([value, label]) => ({
									value,
									label,
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
