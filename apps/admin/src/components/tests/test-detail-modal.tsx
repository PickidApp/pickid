import {
	useTestWithDetailsQuery,
	useTestCategoryIdsQuery,
	useCategoriesQuery,
	useTestRecentSessionsQuery,
} from '@/api/queries';
import { HREF } from '@/constants/routes';
import { TEST_TABS, type TestTabType } from '@/constants/test';
import { formatDateTimeKorean } from '@/utils';
import { getTestStatusLabel, getTestStatusVariant, getTestTypeLabel } from '@/utils/test';
import {
	Badge,
	Button,
	Tabs,
	TabsList,
	TabsTrigger,
	BaseModal,
	BaseModalHeader,
	BaseModalTitle,
	BaseModalContent,
	BaseModalFooter,
	IconButton,
} from '@pickid/ui';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
	const { data: recentSessions, isLoading: isSessionsLoading } = useTestRecentSessionsQuery(testId, 5);
	const [activeTab, setActiveTab] = useState<TestTabType>('basic');

	const test = testData as any;
	const questions = test?.questions || [];
	const results = test?.results || [];

	const categoryNames =
		categoryIds
			?.map((id) => categoriesData?.categories?.find((cat) => cat.id === id)?.name)
			.filter(Boolean)
			.join(', ') || '-';

	if (!isOpen) return null;

	const handleEdit = () => {
		if (test) {
			navigate(HREF.TEST_EDIT(test.id));
			onClose();
		}
	};

	const tabs = TEST_TABS.map((tab) => ({
		...tab,
		label:
			tab.id === 'questions'
				? `질문 (${questions.length})`
				: tab.id === 'results'
				? `결과 (${results.length})`
				: tab.label,
	}));

	return (
		<BaseModal open={isOpen} onOpenChange={onClose} className="max-w-6xl w-[90%]">
			<BaseModalHeader onClose={onClose}>
				<BaseModalTitle>테스트 상세 정보</BaseModalTitle>
				{test && (
					<>
						<Badge variant="outline">{getTestTypeLabel(test.type)}</Badge>
						<Badge variant={getTestStatusVariant(test.status)}>{getTestStatusLabel(test.status)}</Badge>
					</>
				)}
			</BaseModalHeader>

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

			<BaseModalContent className="max-h-[65vh]">
				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
					</div>
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
												<div className="text-center p-4 bg-neutral-50 rounded-lg">
													<div className="text-2xl font-semibold text-neutral-900">{questions.length}</div>
													<div className="text-xs text-neutral-500 mt-1">총 질문</div>
												</div>
												<div className="text-center p-4 bg-neutral-50 rounded-lg">
													<div className="text-2xl font-semibold text-neutral-900">{results.length}</div>
													<div className="text-xs text-neutral-500 mt-1">결과 유형</div>
												</div>
												<div className="text-center p-4 bg-neutral-50 rounded-lg">
													<div className="text-2xl font-semibold text-neutral-900">-</div>
													<div className="text-xs text-neutral-500 mt-1">총 참여자</div>
												</div>
												<div className="text-center p-4 bg-neutral-50 rounded-lg">
													<div className="text-2xl font-semibold text-neutral-900">-</div>
													<div className="text-xs text-neutral-500 mt-1">평균 평점</div>
												</div>
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
											{isSessionsLoading ? (
												<div className="flex items-center justify-center py-4">
													<div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
												</div>
											) : !recentSessions || recentSessions.length === 0 ? (
												<div className="text-center py-4 text-sm text-neutral-500">응답 데이터가 없습니다</div>
											) : (
												<div className="space-y-2">
													{recentSessions.map((session) => (
														<div
															key={session.id}
															className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
														>
															<div className="flex-1 min-w-0">
																<div className="text-sm text-neutral-900 truncate">
																	{session.result_name || '결과 없음'}
																</div>
																<div className="text-xs text-neutral-500">
																	{formatDateTimeKorean(session.started_at)}
																</div>
															</div>
															<div className="ml-2 shrink-0">
																<Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
																	{session.status === 'completed'
																		? '완료'
																		: session.status === 'in_progress'
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
									questions.map((question: any, index: number) => (
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
														{question.choices?.map((choice: any, cIndex: number) => (
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
									results.map((result: any, index: number) => (
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
					</>
				)}
			</BaseModalContent>

			<BaseModalFooter>
				<Button variant="outline" text="닫기" onClick={onClose} />
				<IconButton
					icon={<Edit className="w-4 h-4" />}
					onClick={handleEdit}
					variant="ghost"
					className="hover:bg-gray-100"
				/>
			</BaseModalFooter>
		</BaseModal>
	);
}
