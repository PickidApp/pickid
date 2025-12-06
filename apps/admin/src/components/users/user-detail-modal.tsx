import { useState } from 'react';
import { useUserDetailQuery, useUserResponsesQuery, useUserStatsQuery } from '@/api';
import { StatBox, ModalLoadingSkeleton } from '@/components/common';
import { ResponseDetailModal } from '@/components/responses/response-detail-modal';
import { USER_TABS, type UserTabType } from '@/constants/user';
import { formatDate } from '@/utils';
import {
	getResponseStatusLabel,
	getResponseStatusVariant,
	getDeviceTypeLabel,
	getDeviceTypeVariant,
	formatCompletionTime,
} from '@/utils/response';
import { getUserStatusLabel, getUserStatusVariant, getUserProviderLabel, getUserProviderVariant } from '@/utils/user';
import type { Json } from '@pickid/supabase';
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
} from '@pickid/ui';

interface UserDetailModalProps {
	userId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function getProvider(meta: Json | null): string {
	if (meta && typeof meta === 'object' && 'provider' in meta) {
		return String(meta.provider);
	}
	return 'email';
}

export function UserDetailModal(props: UserDetailModalProps) {
	const { userId, open, onOpenChange } = props;

	const [activeTab, setActiveTab] = useState<UserTabType>('basic');
	const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);

	const { data: user, isLoading: userLoading } = useUserDetailQuery(userId || '');
	const { data: stats } = useUserStatsQuery(userId || '');
	const { data: responses, isLoading: responsesLoading } = useUserResponsesQuery(userId || '', 20);

	const handleClose = () => onOpenChange(false);

	if (!open) return null;

	const responsesCount = responses?.length || 0;

	const tabs = USER_TABS.map((tab) => ({
		...tab,
		label: tab.id === 'responses' ? `테스트 참여 (${responsesCount})` : tab.label,
	}));

	return (
		<>
			<BaseModal open={open} onOpenChange={onOpenChange} className="max-w-4xl w-[90%]">
				<BaseModalHeader onClose={handleClose}>
					<BaseModalTitle>사용자 상세 정보</BaseModalTitle>
					{user && (
						<>
							<Badge variant={getUserProviderVariant(getProvider(user.meta))}>
								{getUserProviderLabel(getProvider(user.meta))}
							</Badge>
							<Badge variant={getUserStatusVariant(user.status)}>{getUserStatusLabel(user.status)}</Badge>
						</>
					)}
				</BaseModalHeader>

				<div className="border-b border-neutral-200 px-6 shrink-0">
					<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UserTabType)}>
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
					{userLoading ? (
						<ModalLoadingSkeleton />
					) : !user ? (
						<div className="flex items-center justify-center py-12">
							<p className="text-neutral-500">사용자를 찾을 수 없습니다.</p>
						</div>
					) : (
						<>
							{activeTab === 'basic' && (
								<div className="grid grid-cols-3 gap-6">
									<div className="col-span-2 space-y-6">
										<div className="border border-neutral-200 rounded-lg overflow-hidden">
											<div className="px-4 py-3 border-b border-neutral-200">
												<h3 className="font-medium text-neutral-900">기본 정보</h3>
											</div>
											<div className="p-4 space-y-4">
												<div className="grid grid-cols-2 gap-x-6 gap-y-4">
													<div>
														<label className="block text-xs font-medium text-neutral-500 mb-1">이메일</label>
														<div className="text-neutral-900">{user.email}</div>
													</div>
													<div>
														<label className="block text-xs font-medium text-neutral-500 mb-1">이름</label>
														<div className="text-neutral-900">{user.name || '-'}</div>
													</div>
													<div>
														<label className="block text-xs font-medium text-neutral-500 mb-1">가입경로</label>
														<div className="text-neutral-900">{getUserProviderLabel(getProvider(user.meta))}</div>
													</div>
													<div>
														<label className="block text-xs font-medium text-neutral-500 mb-1">상태</label>
														<div className="text-neutral-900">{getUserStatusLabel(user.status)}</div>
													</div>
													<div>
														<label className="block text-xs font-medium text-neutral-500 mb-1">가입일</label>
														<div className="text-neutral-900">{formatDate(user.created_at)}</div>
													</div>
													<div>
														<label className="block text-xs font-medium text-neutral-500 mb-1">최근 수정일</label>
														<div className="text-neutral-900">{formatDate(user.updated_at)}</div>
													</div>
												</div>
											</div>
										</div>

										<div className="border border-neutral-200 rounded-lg overflow-hidden">
											<div className="px-4 py-3 border-b border-neutral-200">
												<h3 className="font-medium text-neutral-900">활동 통계</h3>
											</div>
											<div className="p-4">
												<div className="grid grid-cols-4 gap-4">
													<StatBox label="총 참여" value={stats?.totalResponses ?? 0} />
													<StatBox label="완료" value={stats?.completedResponses ?? 0} color="green" />
													<StatBox label="완료율" value={`${stats?.completionRate ?? 0}%`} color="blue" />
													<StatBox
														label="평균 소요시간"
														value={formatCompletionTime(stats?.avgCompletionTime ?? 0)}
													/>
												</div>
											</div>
										</div>
									</div>

									<div className="space-y-6">
										<div className="border border-neutral-200 rounded-lg overflow-hidden">
											<div className="px-4 py-3 border-b border-neutral-200">
												<h3 className="font-medium text-neutral-900">프로필</h3>
											</div>
											<div className="p-4">
												<div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden max-w-32 mx-auto">
													{user.avatar_url ? (
														<img
															src={user.avatar_url}
															alt={user.name || user.email}
															className="w-full h-full object-cover"
														/>
													) : (
														<div className="w-full h-full bg-neutral-900 flex items-center justify-center">
															<span className="text-4xl font-bold text-white">
																{user.email?.charAt(0).toUpperCase()}
															</span>
														</div>
													)}
												</div>
											</div>
										</div>

										<div className="border border-neutral-200 rounded-lg overflow-hidden">
											<div className="px-4 py-3 border-b border-neutral-200">
												<h3 className="font-medium text-neutral-900">최근 테스트</h3>
											</div>
											<div className="p-4">
												{responsesLoading ? (
													<ModalLoadingSkeleton variant="simple" />
												) : !responses || responses.length === 0 ? (
													<div className="text-center py-4 text-sm text-neutral-500">
														테스트 참여 내역이 없습니다
													</div>
												) : (
													<div className="space-y-2">
														{responses.slice(0, 5).map((response: any) => (
															<div
																key={response.id}
																className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
															>
																<div className="flex-1 min-w-0">
																	<div className="text-sm text-neutral-900 truncate">
																		{response.tests?.title || '테스트'}
																	</div>
																	<div className="text-xs text-neutral-500">{formatDate(response.started_at)}</div>
																</div>
																<div className="ml-2 shrink-0">
																	<Badge variant={getResponseStatusVariant(response.status)} size="sm">
																		{getResponseStatusLabel(response.status)}
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

							{activeTab === 'responses' && (
								<div className="space-y-4">
									{responsesLoading ? (
										<ModalLoadingSkeleton variant="simple" />
									) : !responses || responses.length === 0 ? (
										<div className="text-center py-12 text-neutral-500">테스트 참여 내역이 없습니다.</div>
									) : (
										<>
											<div className="grid grid-cols-4 gap-4 mb-6">
												<StatBox label="총 참여" value={responsesCount} />
												<StatBox
													label="완료"
													value={responses.filter((r: any) => r.status === 'completed').length}
													color="green"
												/>
												<StatBox
													label="진행중"
													value={responses.filter((r: any) => r.status === 'in_progress').length}
													color="blue"
												/>
												<StatBox
													label="이탈"
													value={responses.filter((r: any) => r.status === 'abandoned').length}
													color="gray"
												/>
											</div>
											<div className="space-y-2">
												{responses.map((response: any) => (
													<button
														key={response.id}
														onClick={() => setSelectedResponseId(response.id)}
														className="w-full bg-neutral-50 hover:bg-neutral-100 rounded-lg p-4 text-left transition-colors"
													>
														<div className="flex items-center justify-between gap-4">
															<div className="flex-1 min-w-0">
																<div className="flex items-center gap-2 mb-1">
																	<span className="text-neutral-900 font-medium truncate">
																		{response.tests?.title || '테스트'}
																	</span>
																	<Badge variant={getResponseStatusVariant(response.status)} size="sm">
																		{getResponseStatusLabel(response.status)}
																	</Badge>
																</div>
																<div className="flex items-center gap-3 text-sm text-neutral-500">
																	{response.test_results?.name && (
																		<span className="text-blue-600">결과: {response.test_results.name}</span>
																	)}
																	<Badge variant={getDeviceTypeVariant(response.device_type)} size="sm">
																		{getDeviceTypeLabel(response.device_type)}
																	</Badge>
																</div>
															</div>
															<div className="text-right text-sm shrink-0">
																<div className="text-neutral-500">{formatDate(response.started_at)}</div>
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
				</BaseModalContent>

				<BaseModalFooter>
					<Button variant="outline" text="닫기" onClick={handleClose} />
				</BaseModalFooter>
			</BaseModal>

			<ResponseDetailModal
				responseId={selectedResponseId}
				open={!!selectedResponseId}
				onOpenChange={(open) => !open && setSelectedResponseId(null)}
			/>
		</>
	);
}
