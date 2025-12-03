import { useState } from 'react';
import type { FeedbackListItem } from '@/services/dashboard.service';
import { useUpdateFeedbackStatus } from '@/api/mutations';
import { X } from 'lucide-react';
import { FEEDBACK_CATEGORY_LABELS, FEEDBACK_STATUS_LABELS } from '@/constants';
import { formatDateTimeKorean } from '@/utils';
import { IconButton, Button } from '@pickid/ui';

interface FeedbackDetailModalProps {
	feedback: FeedbackListItem;
	isOpen: boolean;
	onClose: () => void;
}

export function FeedbackDetailModal(props: FeedbackDetailModalProps) {
	const { feedback, isOpen, onClose } = props;
	const updateMutation = useUpdateFeedbackStatus();

	const [status, setStatus] = useState(feedback.status);
	const [adminNote, setAdminNote] = useState('');

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await updateMutation.mutateAsync({
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
					<div>
						<label className="text-sm font-medium text-gray-600">카테고리</label>
						<p className="mt-1">{FEEDBACK_CATEGORY_LABELS[feedback.category]}</p>
					</div>

					<div>
						<label className="text-sm font-medium text-gray-600">작성자</label>
						<p className="mt-1">{feedback.users?.email || '익명'}</p>
					</div>

					<div>
						<label className="text-sm font-medium text-gray-600">관련 테스트</label>
						<p className="mt-1">{feedback.tests?.title || '-'}</p>
					</div>

					<div>
						<label className="text-sm font-medium text-gray-600">내용</label>
						<p className="mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded">{feedback.content}</p>
					</div>

					<div>
						<label className="text-sm font-medium text-gray-600">작성일시</label>
						<p className="mt-1">{formatDateTimeKorean(feedback.created_at)}</p>
					</div>

					<hr />

					{/* 상태 업데이트 폼 */}
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
								상태 변경
							</label>
							<select
								id="status"
								value={status}
								onChange={(e) => setStatus(e.target.value as typeof status)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								{Object.entries(FEEDBACK_STATUS_LABELS).map(([value, label]) => (
									<option key={value} value={value}>
										{label}
									</option>
								))}
							</select>
						</div>

						<div>
							<label htmlFor="adminNote" className="block text-sm font-medium text-gray-700 mb-1">
								관리자 메모
							</label>
							<textarea
								id="adminNote"
								value={adminNote}
								onChange={(e) => setAdminNote(e.target.value)}
								rows={4}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="처리 내용이나 메모를 입력하세요..."
							/>
						</div>

						<div className="flex gap-2 justify-end">
							<Button type="button" onClick={onClose} variant="outline">
								취소
							</Button>
							<Button type="submit" disabled={updateMutation.isPending} loading={updateMutation.isPending}>
								저장
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
