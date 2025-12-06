import { useResponseDetailQuery } from '@/api';
import {
	getResponseStatusLabel,
	getResponseStatusVariant,
	getDeviceTypeLabel,
	getDeviceTypeVariant,
	formatCompletionTime,
} from '@/utils/response';
import { formatDate } from '@/utils';
import { InfoRow, ModalLoadingSkeleton, EmptyState } from '@/components/common';
import {
	Badge,
	BaseModal,
	BaseModalContent,
	BaseModalFooter,
	BaseModalHeader,
	BaseModalTitle,
	Button,
} from '@pickid/ui';

interface ResponseDetailModalProps {
	responseId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

interface ResponseAnswer {
	question_id: string;
	question_order: number;
	question_text: string;
	choice_id: string | null;
	choice_text: string | null;
	answer_text: string | null;
	answered_at: string;
}

export function ResponseDetailModal(props: ResponseDetailModalProps) {
	const { responseId, open, onOpenChange } = props;

	const { data, isLoading } = useResponseDetailQuery(responseId || '');

	const handleClose = () => onOpenChange(false);

	const response = data?.session;
	const answers = (data?.answers || []) as ResponseAnswer[];

	return (
		<BaseModal open={open} onOpenChange={onOpenChange}>
			<BaseModalHeader onClose={handleClose}>
				<BaseModalTitle>응답 상세</BaseModalTitle>
			</BaseModalHeader>
			<BaseModalContent className="max-h-[70vh] overflow-y-auto">
				{isLoading ? (
					<ModalLoadingSkeleton variant="detail" />
				) : !response ? (
					<EmptyState message="데이터를 찾을 수 없습니다." />
				) : (
					<div className="space-y-6">
						<section>
							<h3 className="text-sm font-medium text-neutral-500 mb-3">테스트 정보</h3>
							<div className="bg-neutral-50 rounded-lg p-4 space-y-2">
								<InfoRow label="테스트명" value={response.test_title} valueClassName="text-neutral-900 font-medium" />
								{response.categories?.length > 0 && <InfoRow label="카테고리" value={response.categories.join(', ')} />}
								<InfoRow label="테스트 유형" value={response.test_type} />
							</div>
						</section>

						<section>
							<h3 className="text-sm font-medium text-neutral-500 mb-3">응답 정보</h3>
							<div className="bg-neutral-50 rounded-lg p-4 space-y-2">
								<InfoRow
									label="상태"
									value={
										<Badge variant={getResponseStatusVariant(response.status)}>
											{getResponseStatusLabel(response.status)}
										</Badge>
									}
								/>
								{response.result_name && (
									<InfoRow label="결과" value={response.result_name} valueClassName="text-neutral-900 font-medium" />
								)}
								{response.total_score !== null && <InfoRow label="총점" value={`${response.total_score}점`} />}
								<InfoRow
									label="디바이스"
									value={
										<Badge variant={getDeviceTypeVariant(response.device_type)}>
											{getDeviceTypeLabel(response.device_type)}
										</Badge>
									}
								/>
								<InfoRow label="소요시간" value={formatCompletionTime(response.completion_time_seconds)} />
								<InfoRow label="시작일시" value={formatDate(response.started_at)} />
								{response.completed_at && <InfoRow label="완료일시" value={formatDate(response.completed_at)} />}
							</div>
						</section>

						<section>
							<h3 className="text-sm font-medium text-neutral-500 mb-3">접속 정보</h3>
							<div className="bg-neutral-50 rounded-lg p-4 space-y-2 text-sm">
								{response.ip_address && (
									<InfoRow label="IP 주소" value={response.ip_address} valueClassName="text-neutral-700 font-mono" />
								)}
								{response.referrer && (
									<InfoRow
										label="유입 경로"
										value={
											<span className="truncate max-w-[200px]" title={response.referrer}>
												{response.referrer}
											</span>
										}
									/>
								)}
								{response.user_agent && (
									<div>
										<span className="text-neutral-500 block mb-1">User Agent</span>
										<span className="text-neutral-600 text-xs break-all">{response.user_agent}</span>
									</div>
								)}
							</div>
						</section>

						{/* 응답 목록 */}
						{answers.length > 0 && (
							<section>
								<h3 className="text-sm font-medium text-neutral-500 mb-3">응답 내역 ({answers.length}개)</h3>
								<div className="space-y-3">
									{answers.map((answer, index) => (
										<div key={answer.question_id} className="bg-neutral-50 rounded-lg p-4">
											<div className="flex items-start gap-3">
												<span className="flex-shrink-0 w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center text-xs text-neutral-600">
													{index + 1}
												</span>
												<div className="flex-1 min-w-0">
													<p className="text-neutral-900 text-sm mb-2">{answer.question_text}</p>
													<div className="flex items-center gap-2">
														<span className="text-xs text-neutral-500">답변:</span>
														<span className="text-sm text-blue-600 font-medium">
															{answer.choice_text || answer.answer_text || '-'}
														</span>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</section>
						)}
					</div>
				)}
			</BaseModalContent>
			<BaseModalFooter>
				<Button variant="outline" onClick={handleClose} text="닫기" />
			</BaseModalFooter>
		</BaseModal>
	);
}
