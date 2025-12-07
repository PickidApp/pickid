import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	useTestWithDetailsQuery,
	useTestCategoryIdsQuery,
	useCategoriesQuery,
	useTestRecentResponsesQuery,
	useResponsesQuery,
	useSeriesListQuery,
	useThemesListQuery,
} from '@/api';
import { StatBox, ModalLoadingSkeleton } from '@/components/common';
import { ResponseDetailModal } from '@/components/responses/response-detail-modal';
import { HREF } from '@/constants/routes';
import { TEST_TABS, type TestTabType } from '@/constants/test';
import type { TestWithDetails, QuestionWithChoices, TestResultDisplay } from '@/types/test';
import type { Response } from '@/types/response';
import { formatDateTimeKorean } from '@/utils';
import {
	getResponseStatusLabel,
	getResponseStatusVariant,
	getDeviceTypeLabel,
	getDeviceTypeVariant,
	formatCompletionTime,
} from '@/utils/response';
import { getTestStatusLabel, getTestStatusVariant, getTestTypeLabel } from '@/utils/test';
import {
	Badge,
	Button,
	Tabs,
	TabsList,
	TabsTrigger,
	DefaultModal,
	DefaultModalHeader,
	DefaultModalTitle,
	DefaultModalContent,
	DefaultModalFooter,
} from '@pickid/ui';

interface TestDetailModalProps {
	testId: string;
	isOpen: boolean;
	onClose: () => void;
}

export function TestDetailModal({ testId, isOpen, onClose }: TestDetailModalProps) {
	const navigate = useNavigate();
	const { data: testData, isLoading } = useTestWithDetailsQuery(testId);
	const { data: categoryIds } = useTestCategoryIdsQuery(testId);
	const { data: categoriesData } = useCategoriesQuery({ status: 'active' });
	const { data: seriesList } = useSeriesListQuery();
	const { data: themesList } = useThemesListQuery();
	const { data: recentResponses, isLoading: isRecentResponsesLoading } = useTestRecentResponsesQuery(testId, 5);
	const { data: responsesData, isLoading: isAllResponsesLoading } = useResponsesQuery({ testId, pageSize: 20 });
	const [activeTab, setActiveTab] = useState<TestTabType>('basic');
	const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);

	const test = testData as TestWithDetails | null;
	const questions: QuestionWithChoices[] = test?.questions ?? [];
	const results: TestResultDisplay[] = test?.results ?? [];

	const categoryNames =
		categoryIds
			?.map((id) => categoriesData?.categories?.find((cat) => cat.id === id)?.name)
			.filter(Boolean)
			.join(', ') || '-';

	const seriesName = test?.series_id ? seriesList?.find((s) => s.id === test.series_id)?.name : null;
	const themeName = test?.theme_id ? themesList?.find((t) => t.id === test.theme_id)?.name : null;

	if (!isOpen) return null;

	const handleEdit = () => {
		if (test) {
			navigate(HREF.TEST_EDIT(test.id));
			onClose();
		}
	};

	const responses: Response[] = responsesData?.responses ?? [];
	const responsesCount = responsesData?.count ?? 0;

	const tabs = TEST_TABS.map((tab) => ({
		...tab,
		label:
			tab.id === 'questions'
				? `질문 (${questions.length})`
				: tab.id === 'results'
					? `결과 (${results.length})`
					: tab.id === 'responses'
						? `응답 (${responsesCount})`
						: tab.label,
	}));

	return (
		<DefaultModal open={isOpen} onOpenChange={onClose} className="max-w-6xl w-[90%]">
			<DefaultModalHeader onClose={onClose}>
				<DefaultModalTitle>테스트 상세 정보</DefaultModalTitle>
				{test && (
					<>
						<Badge variant="outline">{getTestTypeLabel(test.type)}</Badge>
						<Badge variant={getTestStatusVariant(test.status)}>{getTestStatusLabel(test.status)}</Badge>
					</>
				)}
			</DefaultModalHeader>

			<div className="border-b border-neutral-200 px-6 shrink-0">
				<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TestTabType)}>
					<TabsList className="bg-transparent p-0 h-auto gap-8">
						{tabs.map((tab) => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className={`py-4 px-0 rounded-none border-b-2 text-sm data-[state=active]:shadow-none ${
									activeTab === tab.id
										? 'border-black text-black'
										: 'border-transparent text-neutral-500 hover:text-neutral-700'
								}`}
							>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>

			<DefaultModalContent className="max-h-[65vh]">
				{isLoading ? (
					<ModalLoadingSkeleton />
				) : (
					<>
						{activeTab === 'basic' && test && (
							<div className="grid grid-cols-3 gap-6">
								<div className="col-span-2 space-y-6">
									<div className="border border-neutral-200 rounded-lg overflow-hidden">
										<div className="px-4 py-3 border-b border-neutral-200">
											<h3 className="font-medium text-neutral-900">기본 정보</h3>
										</div>
										<div className="p-4 space-y-4">
											<div className="grid grid-cols-2 gap-x-6 gap-y-4">
												<div>
													<label className="block text-xs font-medium text-neutral-500 mb-1">제목</label>
													<div className="text-neutral-900">{test.title}</div>
												</div>
												<div>
													<label className="block text-xs font-medium text-neutral-500 mb-1">슬러그</label>
													<div className="text-neutral-900 font-mono text-sm truncate">{test.slug}</div>
												</div>
												<div>
													<label className="block text-xs font-medium text-neutral-500 mb-1">타입</label>
													<div className="text-neutral-900">{getTestTypeLabel(test.type)}</div>
												</div>
												<div>
													<label className="block text-xs font-medium text-neutral-500 mb-1">카테고리</label>
													<div className="text-neutral-900">{categoryNames}</div>
												</div>
												<div>
													<label className="block text-xs font-medium text-neutral-500 mb-1">시리즈</label>
													<div className="text-neutral-900">
														{seriesName ? (
															<Badge variant="outline">{seriesName}</Badge>
														) : (
															'-'
														)}
													</div>
												</div>
												<div>
													<label className="block text-xs font-medium text-neutral-500 mb-1">테마</label>
													<div className="text-neutral-900">
														{themeName ? (
															<Badge variant="secondary">{themeName}</Badge>
														) : (
															'-'
														)}
													</div>
												</div>
												<div>
													<label className="block text-xs font-medium text-neutral-500 mb-1">예상 시간</label>
													<div className="text-neutral-900">
														{test.estimated_time_minutes ? `${test.estimated_time_minutes}분` : '-'}
													</div>
												</div>
												<div>
													<label className="block text-xs font-medium text-neutral-500 mb-1">생성일</label>
													<div className="text-neutral-900">{formatDateTimeKorean(test.created_at)}</div>
												</div>
											</div>

											<div>
												<label className="block text-xs font-medium text-neutral-500 mb-1">설명</label>
												<div className="text-neutral-900 leading-relaxed">{test.description || '-'}</div>
											</div>

											<div>
												<label className="block text-xs font-medium text-neutral-500 mb-1">URL</label>
												<div className="text-neutral-600 font-mono text-sm bg-neutral-50 border border-neutral-200 rounded px-2 py-1 inline-block">
													/test/{test.slug}
												</div>
											</div>
										</div>
									</div>

									<div className="border border-neutral-200 rounded-lg overflow-hidden">
										<div className="px-4 py-3 border-b border-neutral-200">
											<h3 className="font-medium text-neutral-900">통계</h3>
										</div>
										<div className="p-4">
											<div className="grid grid-cols-4 gap-4">
												<StatBox label="총 질문" value={questions.length} />
												<StatBox label="결과 유형" value={results.length} />
												<StatBox label="총 참여자" value="-" />
												<StatBox label="평균 평점" value="-" />
											</div>
										</div>
									</div>
								</div>

								<div className="space-y-6">
									<div className="border border-neutral-200 rounded-lg overflow-hidden">
										<div className="px-4 py-3 border-b border-neutral-200">
											<h3 className="font-medium text-neutral-900">썸네일</h3>
										</div>
										<div className="p-4">
											<div className="aspect-video bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
												{test.thumbnail_url ? (
													<img src={test.thumbnail_url} alt={test.title} className="w-full h-full object-cover" />
												) : (
													<div className="text-neutral-400 text-sm">썸네일 없음</div>
												)}
											</div>
										</div>
									</div>

									<div className="border border-neutral-200 rounded-lg overflow-hidden">
										<div className="px-4 py-3 border-b border-neutral-200">
											<h3 className="font-medium text-neutral-900">최근 응답</h3>
										</div>
										<div className="p-4">
											{isRecentResponsesLoading ? (
												<ModalLoadingSkeleton variant="simple" />
											) : !recentResponses || recentResponses.length === 0 ? (
												<div className="text-center py-4 text-sm text-neutral-500">응답 데이터가 없습니다</div>
											) : (
												<div className="space-y-2">
													{recentResponses.map((response) => (
														<div
															key={response.id}
															className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
														>
															<div className="flex-1 min-w-0">
																<div className="text-sm text-neutral-900 truncate">
																	{response.result_name || '결과 없음'}
																</div>
																<div className="text-xs text-neutral-500">
																	{formatDateTimeKorean(response.started_at)}
																</div>
															</div>
															<div className="ml-2 shrink-0">
																<Badge variant={response.status === 'completed' ? 'default' : 'secondary'}>
																	{response.status === 'completed'
																		? '완료'
																		: response.status === 'in_progress'
																		? '진행중'
																		: '중단'}
																</Badge>
															</div>
														</div>
													))}
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						)}

						{activeTab === 'questions' && (
							<div className="space-y-4">
								{questions.length === 0 ? (
									<div className="text-center py-12 text-neutral-500">등록된 질문이 없습니다.</div>
								) : (
									questions.map((question, index) => (
										<div key={question.id} className="border border-neutral-200 rounded-lg p-4">
											<div className="flex items-start gap-3">
												<div className="w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center text-sm shrink-0">
													{index + 1}
												</div>
												<div className="flex-1">
													<div className="text-neutral-900 mb-2">{question.text}</div>
													{question.image_url && (
														<div className="mb-3">
															<img
																src={question.image_url}
																alt={`질문 ${index + 1} 이미지`}
																className="max-w-xs h-auto rounded-lg object-cover"
															/>
														</div>
													)}
													<div className="space-y-2">
														{question.choices.map((choice, cIndex) => (
															<div key={choice.id} className="flex items-center gap-2 text-sm text-neutral-600">
																<span className="w-5 h-5 bg-neutral-100 rounded-full flex items-center justify-center text-xs">
																	{String.fromCharCode(65 + cIndex)}
																</span>
																<span>{choice.text}</span>
																{choice.code && <span className="text-xs text-neutral-400">({choice.code})</span>}
															</div>
														))}
													</div>
												</div>
											</div>
										</div>
									))
								)}
							</div>
						)}

						{activeTab === 'results' && (
							<div className="space-y-4">
								{results.length === 0 ? (
									<div className="text-center py-12 text-neutral-500">등록된 결과가 없습니다.</div>
								) : (
									results.map((result, index) => (
										<div key={result.id} className="border border-neutral-200 rounded-lg p-4">
											<div className="flex items-start gap-4">
												{result.thumbnail_url && (
													<img
														src={result.thumbnail_url}
														alt={result.name}
														className="w-16 h-16 rounded-lg object-cover"
													/>
												)}
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-1">
														<span className="text-sm text-neutral-500">#{index + 1}</span>
														<span className="text-neutral-900 font-medium">{result.name}</span>
													</div>
													{result.description && <div className="text-sm text-neutral-600">{result.description}</div>}
												</div>
											</div>
										</div>
									))
								)}
							</div>
						)}

						{activeTab === 'responses' && (
							<div className="space-y-4">
								{isAllResponsesLoading ? (
									<ModalLoadingSkeleton variant="simple" />
								) : responses.length === 0 ? (
									<div className="text-center py-12 text-neutral-500">응답 데이터가 없습니다.</div>
								) : (
									<>
										<div className="grid grid-cols-4 gap-4 mb-6">
											<StatBox label="총 응답" value={responsesCount} />
											<StatBox
												label="완료"
												value={responses.filter((r) => r.status === 'completed').length}
												color="green"
											/>
											<StatBox
												label="진행중"
												value={responses.filter((r) => r.status === 'in_progress').length}
												color="blue"
											/>
											<StatBox
												label="이탈"
												value={responses.filter((r) => r.status === 'abandoned').length}
												color="gray"
											/>
										</div>
										<div className="space-y-2">
											{responses.map((response) => (
												<button
													key={response.session_id}
													onClick={() => setSelectedResponseId(response.session_id)}
													className="w-full bg-neutral-50 hover:bg-neutral-100 rounded-lg p-4 text-left transition-colors"
												>
													<div className="flex items-center justify-between gap-4">
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 mb-1">
																<Badge variant={getResponseStatusVariant(response.status)} size="sm">
																	{getResponseStatusLabel(response.status)}
																</Badge>
																<Badge variant={getDeviceTypeVariant(response.device_type)} size="sm">
																	{getDeviceTypeLabel(response.device_type)}
																</Badge>
																{response.result_name && (
																	<span className="text-sm text-blue-600 font-medium">
																		결과: {response.result_name}
																	</span>
																)}
																{response.total_score !== null && response.total_score !== undefined && (
																	<span className="text-sm text-neutral-600">
																		점수: {response.total_score}점
																	</span>
																)}
															</div>
															<div className="text-sm text-neutral-500">익명 사용자</div>
														</div>
														<div className="text-right text-sm shrink-0">
															<div className="text-neutral-500">
																{formatDateTimeKorean(response.started_at)}
															</div>
															{response.completion_time_seconds && (
																<div className="text-neutral-400">
																	{formatCompletionTime(response.completion_time_seconds)}
																</div>
															)}
														</div>
													</div>
												</button>
											))}
										</div>
									</>
								)}
							</div>
						)}
					</>
				)}
			</DefaultModalContent>

			<ResponseDetailModal
				responseId={selectedResponseId}
				open={!!selectedResponseId}
				onOpenChange={(open) => !open && setSelectedResponseId(null)}
			/>

			<DefaultModalFooter className="py-3">
				<Button variant="outline" onClick={onClose} text="닫기" />
				<Button variant="ghost" onClick={handleEdit} text="수정" />
			</DefaultModalFooter>
		</DefaultModal>
	);
}
