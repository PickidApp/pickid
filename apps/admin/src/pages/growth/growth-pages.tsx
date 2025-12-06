import { useState, useMemo } from 'react';
import {
	useGrowthSummaryQuery,
	useDailyGrowthQuery,
	useFunnelAnalysisQuery,
	useChannelAnalysisQuery,
	useLandingPageAnalysisQuery,
	useCohortAnalysisQuery,
	useViralMetricsQuery,
	useShareChannelStatsQuery,
	useShareBasedSessionsQuery,
} from '@/api';
import {
	GrowthSummaryCards,
	DailyGrowthChart,
	FunnelChart,
	ChannelTable,
	LandingPageTable,
	CohortTable,
	ViralContent,
} from '@/components/growth';
import { AnalysisGuideTooltip } from '@/components/common';
import { DATE_RANGE_OPTIONS, GROWTH_TABS, GROWTH_ANALYSIS_GUIDES, type GrowthTab } from '@/constants/growth';
import { type DateRangeOption } from '@/constants/analytics';
import { getDateRangeParams } from '@/utils';
import { DefaultSelect, Tabs, TabsList, TabsTrigger, TabsContent, Button } from '@pickid/ui';

export function GrowthPage() {
	const [activeTab, setActiveTab] = useState<GrowthTab>('overview');
	const [dateRange, setDateRange] = useState<DateRangeOption>('30d');

	const dateParams = useMemo(() => getDateRangeParams(dateRange), [dateRange]);

	const { data: summaryData } = useGrowthSummaryQuery(dateParams);
	const { data: dailyData } = useDailyGrowthQuery(dateParams);
	const { data: funnelData } = useFunnelAnalysisQuery(dateParams);
	const { data: channelData } = useChannelAnalysisQuery(dateParams);
	const { data: landingData } = useLandingPageAnalysisQuery(dateParams);
	const { data: cohortData } = useCohortAnalysisQuery(8);
	const { data: viralMetrics } = useViralMetricsQuery(dateParams);
	const { data: shareChannelStats } = useShareChannelStatsQuery(dateParams);
	const { data: shareBasedSessions } = useShareBasedSessionsQuery(dateParams);

	const handleDateRangeChange = (value: string) => {
		setDateRange(value as DateRangeOption);
	};

	return (
		<>
			<header className="bg-white border-b px-6 py-4">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-2xl text-neutral-900">성장 지표 분석</h1>
						<p className="text-sm text-neutral-500 mt-1">
							유입 경로, 전환 퍼널, 사용자 리텐션을 분석하여 서비스 성장 전략을 수립합니다
						</p>
					</div>
					<div className="flex items-center gap-3">
						<DefaultSelect
							value={dateRange}
							onValueChange={handleDateRangeChange}
							options={DATE_RANGE_OPTIONS.map((opt) => ({
								value: opt.value,
								label: opt.label,
							}))}
							placeholder="기간 선택"
							className="w-36"
						/>
						<Button
							variant="outline"
							size="sm"
							className="text-blue-600 border-blue-200 hover:bg-blue-50"
							onClick={() => window.open('https://analytics.google.com', '_blank')}
						>
							GA 대시보드
						</Button>
					</div>
				</div>
			</header>

			<main className="p-6">
				<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as GrowthTab)}>
					<div className="flex items-center gap-3 mb-6">
						<TabsList className="bg-neutral-100 p-0.5 rounded-md h-8">
							{GROWTH_TABS.map((tab) => (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									className="px-3 py-1 text-xs font-medium rounded data-[state=active]:bg-white data-[state=active]:shadow-sm"
								>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
						<AnalysisGuideTooltip {...GROWTH_ANALYSIS_GUIDES[activeTab]} />
					</div>

					{/* 성장 요약 탭 */}
					<TabsContent value="overview" className="space-y-6">
						<GrowthSummaryCards data={summaryData} />

						<DailyGrowthChart data={dailyData} />

						<div className="grid grid-cols-2 gap-6">
							<div className="bg-white border border-neutral-200 rounded-lg p-6">
								<h3 className="text-lg font-medium text-neutral-900 mb-4">전환 퍼널</h3>
								<FunnelChart data={funnelData} />
							</div>
							<div className="bg-white border border-neutral-200 rounded-lg p-6">
								<h3 className="text-lg font-medium text-neutral-900 mb-4">유입 채널</h3>
								<ChannelTable data={channelData} />
							</div>
						</div>
					</TabsContent>

					{/* 퍼널 분석 탭 */}
					<TabsContent value="funnel" className="space-y-6">
						<div className="bg-white border border-neutral-200 rounded-lg p-6">
							<div className="mb-6">
								<h3 className="text-lg font-medium text-neutral-900">전환 퍼널</h3>
								<p className="text-sm text-neutral-500 mt-1">
									방문 → 테스트 시작 → 테스트 완료까지의 전환 과정을 분석합니다
								</p>
							</div>
							<FunnelChart data={funnelData} />
						</div>

						<div className="bg-white border border-neutral-200 rounded-lg p-6">
							<h3 className="text-lg font-medium text-neutral-900 mb-4">단계별 상세 분석</h3>
							<div className="grid grid-cols-3 gap-4">
								{funnelData?.map((step, index) => (
									<div key={step.step} className="p-4 bg-neutral-50 rounded-lg">
										<div className="flex items-center gap-2 mb-2">
											<span className="flex items-center justify-center w-6 h-6 bg-neutral-200 rounded-full text-xs font-medium">
												{index + 1}
											</span>
											<span className="text-sm font-medium text-neutral-700">{step.label}</span>
										</div>
										<div className="text-2xl font-semibold text-neutral-900 mb-2">{step.count.toLocaleString()}명</div>
										{index > 0 && (
											<div className="flex gap-3 text-sm">
												<div className="flex items-center gap-1">
													<span className="w-2 h-2 rounded-full bg-green-500" />
													<span className="text-neutral-600">전환 {step.rate}%</span>
												</div>
												<div className="flex items-center gap-1">
													<span className="w-2 h-2 rounded-full bg-red-400" />
													<span className="text-neutral-600">이탈 {step.dropoff}%</span>
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						</div>

						<div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
							<h3 className="text-lg font-medium text-amber-900 mb-2">개선 포인트</h3>
							<ul className="text-sm text-amber-800 space-y-2">
								<li>• 가장 이탈률이 높은 단계를 집중적으로 개선하세요</li>
								<li>• 테스트 시작 전환율이 낮다면 랜딩 페이지 개선이 필요합니다</li>
								<li>• 테스트 완료율이 낮다면 테스트 난이도나 길이를 검토하세요</li>
							</ul>
						</div>
					</TabsContent>

					{/* 채널 분석 탭 */}
					<TabsContent value="channel" className="space-y-6">
						<div className="bg-white border border-neutral-200 rounded-lg p-6">
							<div className="mb-6">
								<h3 className="text-lg font-medium text-neutral-900">유입 채널별 성과</h3>
								<p className="text-sm text-neutral-500 mt-1">각 마케팅 채널의 유입량과 전환 성과를 비교 분석합니다</p>
							</div>
							<ChannelTable data={channelData} />
						</div>

						<div className="bg-white border border-neutral-200 rounded-lg p-6">
							<h3 className="text-lg font-medium text-neutral-900 mb-4">채널별 전환율 비교</h3>
							<div className="space-y-3">
								{channelData
									?.sort((a, b) => b.conversionRate - a.conversionRate)
									.map((channel) => (
										<div key={channel.channel} className="flex items-center gap-4">
											<div className="w-24 text-sm font-medium text-neutral-700">{channel.label}</div>
											<div className="flex-1 bg-neutral-100 rounded-full h-6 overflow-hidden">
												<div
													className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-2"
													style={{ width: `${Math.max(channel.conversionRate * 2, 5)}%` }}
												>
													<span className="text-xs text-white font-medium">{channel.conversionRate}%</span>
												</div>
											</div>
											<div className="w-24 text-right text-sm text-neutral-500">
												{channel.responses.toLocaleString()} 응답
											</div>
										</div>
									))}
							</div>
						</div>
					</TabsContent>

					{/* 랜딩 페이지 탭 */}
					<TabsContent value="landing" className="space-y-6">
						<div className="bg-white border border-neutral-200 rounded-lg p-6">
							<div className="mb-6">
								<h3 className="text-lg font-medium text-neutral-900">랜딩 페이지별 성과</h3>
								<p className="text-sm text-neutral-500 mt-1">사용자가 처음 방문한 페이지별 전환 성과를 분석합니다</p>
							</div>
							<LandingPageTable data={landingData} />
						</div>

						<div className="grid grid-cols-2 gap-6">
							<div className="bg-white border border-neutral-200 rounded-lg p-6">
								<h3 className="text-lg font-medium text-neutral-900 mb-4">상위 전환 페이지</h3>
								<div className="space-y-3">
									{landingData
										?.sort((a, b) => b.conversionRate - a.conversionRate)
										.slice(0, 5)
										.map((page, index) => (
											<div key={page.path} className="flex items-center gap-3">
												<span className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 rounded-full text-xs font-medium">
													{index + 1}
												</span>
												<span className="flex-1 text-sm text-neutral-700 truncate" title={page.path}>
													{page.path}
												</span>
												<span className="text-sm font-medium text-green-600">{page.conversionRate}%</span>
											</div>
										))}
								</div>
							</div>

							<div className="bg-white border border-neutral-200 rounded-lg p-6">
								<h3 className="text-lg font-medium text-neutral-900 mb-4">개선 필요 페이지</h3>
								<div className="space-y-3">
									{landingData
										?.filter((p) => p.visits >= 10)
										.sort((a, b) => a.conversionRate - b.conversionRate)
										.slice(0, 5)
										.map((page, index) => (
											<div key={page.path} className="flex items-center gap-3">
												<span className="flex items-center justify-center w-6 h-6 bg-red-100 text-red-700 rounded-full text-xs font-medium">
													{index + 1}
												</span>
												<span className="flex-1 text-sm text-neutral-700 truncate" title={page.path}>
													{page.path}
												</span>
												<span className="text-sm font-medium text-red-600">{page.conversionRate}%</span>
											</div>
										))}
								</div>
							</div>
						</div>
					</TabsContent>

					{/* 코호트 분석 탭 */}
					<TabsContent value="cohort" className="space-y-6">
						<div className="bg-white border border-neutral-200 rounded-lg p-6">
							<div className="mb-6">
								<h3 className="text-lg font-medium text-neutral-900">코호트 리텐션 분석</h3>
								<p className="text-sm text-neutral-500 mt-1">
									가입 시점별로 사용자 그룹을 나누어 주간 리텐션을 추적합니다
								</p>
							</div>
							<CohortTable data={cohortData} />
						</div>

						<div className="grid grid-cols-2 gap-6">
							<div className="bg-white border border-neutral-200 rounded-lg p-6">
								<h3 className="text-lg font-medium text-neutral-900 mb-4">리텐션 해석 가이드</h3>
								<div className="space-y-3 text-sm text-neutral-600">
									<div className="flex items-start gap-3">
										<span className="w-4 h-4 mt-0.5 rounded bg-green-600 shrink-0" />
										<span>진한 녹색: 높은 리텐션 (좋음)</span>
									</div>
									<div className="flex items-start gap-3">
										<span className="w-4 h-4 mt-0.5 rounded bg-green-200 shrink-0" />
										<span>연한 녹색: 보통 리텐션</span>
									</div>
									<div className="flex items-start gap-3">
										<span className="w-4 h-4 mt-0.5 rounded bg-neutral-100 shrink-0" />
										<span>회색: 낮은 리텐션 (개선 필요)</span>
									</div>
								</div>
							</div>

							<div className="bg-white border border-neutral-200 rounded-lg p-6">
								<h3 className="text-lg font-medium text-neutral-900 mb-4">리텐션 개선 전략</h3>
								<ul className="space-y-2 text-sm text-neutral-600">
									<li>• Week 1 리텐션이 낮다면 온보딩 개선이 필요합니다</li>
									<li>• 장기 리텐션을 위해 정기적인 새 테스트 출시를 고려하세요</li>
									<li>• 푸시 알림이나 이메일로 재방문을 유도하세요</li>
									<li>• 사용자 세그먼트별 맞춤 전략을 수립하세요</li>
								</ul>
							</div>
						</div>
					</TabsContent>

					{/* 바이럴 분석 탭 */}
					<TabsContent value="viral" className="space-y-6">
						<ViralContent
							viralMetrics={viralMetrics}
							shareChannelStats={shareChannelStats}
							shareBasedSessions={shareBasedSessions}
						/>
					</TabsContent>
				</Tabs>
			</main>
		</>
	);
}

