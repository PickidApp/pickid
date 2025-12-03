import { useState } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { FeedbackListItem } from '@/services/dashboard.service';
import { FeedbackDetailModal } from './feedback-detail-modal';
import { ArrowRight } from 'lucide-react';
import { FEEDBACK_CATEGORY_LABELS, FEEDBACK_STATUS_LABELS, FEEDBACK_STATUS_COLORS } from '@/constants';
import { formatDateTimeKorean } from '@/utils';
import { useModal } from '@pickid/ui';
import { Button } from '@pickid/ui';

interface FeedbackSectionProps {
	feedbackQuery: UseQueryResult<FeedbackListItem[], Error>;
}

export function FeedbackSection(props: FeedbackSectionProps) {
	const { feedbackQuery } = props;
	const [selectedFeedback, setSelectedFeedback] = useState<FeedbackListItem | null>(null);
	const { open, close, isOpen } = useModal();

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

			{feedbackQuery.isLoading && (
				<div className="space-y-3">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="h-16 bg-neutral-50 rounded animate-pulse"></div>
					))}
				</div>
			)}

			{feedbackQuery.isError && <div className="p-6 text-center text-red-600">데이터를 불러오는데 실패했습니다.</div>}

			{feedbackQuery.data && feedbackQuery.data.length === 0 && (
				<div className="p-6 text-center text-neutral-500">최근 피드백이 없습니다.</div>
			)}

			{feedbackQuery.data && feedbackQuery.data.length > 0 && (
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-neutral-200">
						<thead className="bg-neutral-50">
							<tr>
								<th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									상태
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									카테고리
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									내용
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									관련 테스트
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									작성자
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									작성일
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-neutral-200">
							{feedbackQuery.data.map((feedback) => (
								<tr
									key={feedback.id}
									className="hover:bg-neutral-50 cursor-pointer transition-colors"
									onClick={() => {
										setSelectedFeedback(feedback);
										open();
									}}
								>
									<td className="px-4 py-4 whitespace-nowrap">
										<span
											className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${
												FEEDBACK_STATUS_COLORS[feedback.status]
											}`}
										>
											{FEEDBACK_STATUS_LABELS[feedback.status]}
										</span>
									</td>
									<td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-900">
										{FEEDBACK_CATEGORY_LABELS[feedback.category]}
									</td>
									<td className="px-4 py-4 text-sm text-neutral-900 max-w-md truncate">{feedback.content}</td>
									<td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-600">
										{feedback.tests?.title || '-'}
									</td>
									<td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-600">
										{feedback.users?.email || '익명'}
									</td>
									<td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-500">
										{formatDateTimeKorean(feedback.created_at)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

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
