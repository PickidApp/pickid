import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	useTestInfoQuery,
	useTestDetailMetricsQuery,
	useDeviceDistributionQuery,
	useResultDistributionQuery,
	useDailyTrendQuery,
	useQuestionMetricsQuery,
} from '@/api';
import {
	DATE_RANGE_OPTIONS,
	TEST_DETAIL_TABS,
	DROPOFF_RATE_THRESHOLDS,
	TEST_ANALYTICS_GUIDES,
	DEVICE_COLORS,
	RESULT_COLORS,
	type DateRangeOption,
	type TestDetailTab,
} from '@/constants/analytics';
import { AnalysisGuideTooltip, StatBox, ProgressBar, DefaultPieChart, EmptyState } from '@/components/common';
import { StatCard } from '@/components/common/stat-card';
import { getTestTypeLabel, getTestStatusLabel, getTestStatusVariant, getTestTypeVariant } from '@/utils/test';
import { formatDate, formatDateShort, formatTime, getDateRangeParams } from '@/utils/format';
import { getCompletionRateColor, getDropoffRateColor } from '@/utils/analytics';
import { Badge, DefaultSelect, DefaultTable, IconButton, type DefaultTableColumn } from '@pickid/ui';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	Legend,
} from 'recharts';
import { ArrowLeft, CheckCircle, Users, Smartphone, Monitor, Tablet, AlertTriangle } from 'lucide-react';
import type { QuestionMetric, ResultDistributionItem, DailyTestMetric } from '@/types/test-analytics';

export function TestAnalyticsDetailPage() {
	const { testId } = useParams<{ testId: string }>();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<TestDetailTab>('overview');
	const [dateRange, setDateRange] = useState<DateRangeOption>('30d');

	const dateParams = useMemo(() => getDateRangeParams(dateRange), [dateRange]);

	const { data: testInfo, isLoading: testInfoLoading } = useTestInfoQuery(testId || '');
	const { data: metrics, isLoading: metricsLoading } = useTestDetailMetricsQuery(testId || '', dateParams);
	const { data: deviceData, isLoading: deviceLoading } = useDeviceDistributionQuery(testId || '', dateParams);
	const { data: resultData, isLoading: resultLoading } = useResultDistributionQuery(testId || '', dateParams);
	const { data: trendData, isLoading: trendLoading } = useDailyTrendQuery(testId || '', dateParams);
	const { data: questionData, isLoading: questionLoading } = useQuestionMetricsQuery(testId || '', dateParams);

	const isHeaderLoading = testInfoLoading || metricsLoading;
	const isOverviewLoading = deviceLoading || trendLoading || resultLoading;

	const handleBack = () => navigate('/analytics');
	const handleDateRangeChange = (value: string) => setDateRange(value as DateRangeOption);

	if (!testId) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-neutral-500">테스트 ID가 없습니다</p>
			</div>
		);
	}

	return (
		<>
			<header className="bg-white border-b px-6 py-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-4">
						<IconButton
							icon={<ArrowLeft className="w-5 h-5" />}
							onClick={handleBack}
							aria-label="뒤로가기"
						/>
						<div>
							{isHeaderLoading ? (
								<div className="h-7 w-48 bg-neutral-100 rounded animate-pulse" />
							) : (
								<div className="flex items-center gap-3">
									<h1 className="text-2xl text-neutral-900">{testInfo?.title}</h1>
									{testInfo && (
										<>
											<Badge variant={getTestTypeVariant(testInfo.type)}>{getTestTypeLabel(testInfo.type)}</Badge>
											<Badge variant={getTestStatusVariant(testInfo.status)}>
												{getTestStatusLabel(testInfo.status)}
											</Badge>
										</>
									)}
								</div>
							)}
							<p className="text-sm text-neutral-500 mt-1">
								{testInfo?.created_at && `생성일: ${formatDate(testInfo.created_at)}`}
							</p>
						</div>
					</div>
					<DefaultSelect
						value={dateRange}
						onValueChange={handleDateRangeChange}
						options={DATE_RANGE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
						placeholder="기간 선택"
						className="w-36"
					/>
				</div>
			</header>

			<main className="p-6 space-y-6">
				<div className="flex flex-wrap gap-3">
					<StatCard label="총 응답수" value={metricsLoading ? '-' : (metrics?.totalResponses?.toLocaleString() ?? '0')} />
					<StatCard
						label="완료수"
						value={metricsLoading ? '-' : (metrics?.completedResponses?.toLocaleString() ?? '0')}
						color="green"
					/>
					<StatCard
						label="완료율"
						value={metricsLoading ? '-' : `${metrics?.completionRate ?? 0}%`}
						color={metrics?.completionRate ? getCompletionRateColor(metrics.completionRate) : 'default'}
					/>
					<StatCard label="평균 소요시간" value={metricsLoading ? '-' : formatTime(metrics?.avgCompletionTime ?? null)} />
					{metrics?.avgScore !== null && metrics?.avgScore !== undefined && (
						<StatCard label="평균 점수" value={metricsLoading ? '-' : metrics.avgScore.toString()} />
					)}
				</div>

				<div className="border-b border-neutral-200">
					<div className="flex items-end gap-3">
						<div className="flex gap-6">
							{TEST_DETAIL_TABS.map((tab) => (
								<button
									key={tab.value}
									onClick={() => setActiveTab(tab.value as TestDetailTab)}
									className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
										activeTab === tab.value
											? 'text-neutral-900 border-neutral-900'
											: 'text-neutral-500 border-transparent hover:text-neutral-700'
									}`}
								>
									{tab.label}
								</button>
							))}
						</div>
						<div className="pb-3">
							<AnalysisGuideTooltip {...TEST_ANALYTICS_GUIDES[`detail_${activeTab}` as keyof typeof TEST_ANALYTICS_GUIDES]} />
						</div>
					</div>
				</div>

				{activeTab === 'overview' && (
					<OverviewTab
						deviceData={deviceData}
						trendData={trendData}
						resultData={resultData}
						isLoading={isOverviewLoading}
					/>
				)}
				{activeTab === 'trend' && <TrendTab trendData={trendData} isLoading={trendLoading} />}
				{activeTab === 'questions' && <QuestionsTab questionData={questionData} isLoading={questionLoading} />}
				{activeTab === 'results' && <ResultsTab resultData={resultData} isLoading={resultLoading} />}
			</main>
		</>
	);
}

function OverviewTab({
	deviceData,
	trendData,
	resultData,
	isLoading,
}: {
	deviceData?: {
		mobile: number;
		desktop: number;
		tablet: number;
		mobileRate: number;
		desktopRate: number;
		tabletRate: number;
	};
	trendData?: DailyTestMetric[];
	resultData?: ResultDistributionItem[];
	isLoading: boolean;
}) {
	const deviceChartData = useMemo(() => {
		if (!deviceData) return [];
		return [
			{ name: '모바일', value: deviceData.mobile, rate: deviceData.mobileRate, color: DEVICE_COLORS.mobile },
			{ name: '데스크톱', value: deviceData.desktop, rate: deviceData.desktopRate, color: DEVICE_COLORS.desktop },
			{ name: '태블릿', value: deviceData.tablet, rate: deviceData.tabletRate, color: DEVICE_COLORS.tablet },
		].filter((d) => d.value > 0);
	}, [deviceData]);

	const deviceChartColors = useMemo(() => {
		return deviceChartData.map((d) => d.color);
	}, [deviceChartData]);

	const recentTrend = useMemo(() => {
		if (!trendData || trendData.length < 2) return null;
		const recent = trendData.slice(-7);
		const totalResponses = recent.reduce((sum, d) => sum + d.responses, 0);
		const totalCompletions = recent.reduce((sum, d) => sum + d.completions, 0);
		const avgCompletionRate = totalResponses > 0 ? Math.round((totalCompletions / totalResponses) * 100) : 0;
		return { totalResponses, totalCompletions, avgCompletionRate };
	}, [trendData]);

	const topResults = useMemo(() => {
		if (!resultData || resultData.length === 0) return [];
		return resultData.slice(0, 3);
	}, [resultData]);

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-2 gap-6">
					{[1, 2].map((i) => (
						<div key={i} className="bg-white border border-neutral-200 rounded-lg p-6 animate-pulse">
							<div className="h-5 w-32 bg-neutral-200 rounded mb-4" />
							<div className="h-48 bg-neutral-100 rounded" />
						</div>
					))}
				</div>
				<div className="bg-white border border-neutral-200 rounded-lg p-6 animate-pulse">
					<div className="h-5 w-24 bg-neutral-200 rounded mb-4" />
					<div className="h-32 bg-neutral-100 rounded" />
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-6">
				<div className="bg-white border border-neutral-200 rounded-lg p-6">
					<h3 className="text-lg font-medium text-neutral-900 mb-4">디바이스 분포</h3>
					{deviceChartData.length === 0 ? (
						<EmptyState className="h-48" />
					) : (
						<div className="flex items-center gap-8">
							<div className="w-48 h-48">
								<DefaultPieChart
									data={deviceChartData}
									colors={deviceChartColors}
									height={192}
									innerRadius={40}
									outerRadius={70}
									showLegend={false}
								/>
							</div>
							<div className="flex-1 space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Smartphone className="w-4 h-4 text-neutral-600" />
										<span className="text-sm text-neutral-600">모바일</span>
									</div>
									<div className="text-right">
										<span className="font-medium">{deviceData?.mobileRate ?? 0}%</span>
										<span className="text-xs text-neutral-400 ml-2">({deviceData?.mobile?.toLocaleString() ?? 0})</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Monitor className="w-4 h-4 text-neutral-600" />
										<span className="text-sm text-neutral-600">데스크톱</span>
									</div>
									<div className="text-right">
										<span className="font-medium">{deviceData?.desktopRate ?? 0}%</span>
										<span className="text-xs text-neutral-400 ml-2">({deviceData?.desktop?.toLocaleString() ?? 0})</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Tablet className="w-4 h-4 text-neutral-600" />
										<span className="text-sm text-neutral-600">태블릿</span>
									</div>
									<div className="text-right">
										<span className="font-medium">{deviceData?.tabletRate ?? 0}%</span>
										<span className="text-xs text-neutral-400 ml-2">({deviceData?.tablet?.toLocaleString() ?? 0})</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="bg-white border border-neutral-200 rounded-lg p-6">
					<h3 className="text-lg font-medium text-neutral-900 mb-4">최근 7일 요약</h3>
					{!recentTrend ? (
						<EmptyState className="h-48" />
					) : (
						<div className="space-y-4">
							<div className="grid grid-cols-3 gap-4">
								<StatBox label="총 응답" value={recentTrend.totalResponses.toLocaleString()} />
								<StatBox label="완료" value={recentTrend.totalCompletions.toLocaleString()} color="green" />
								<StatBox label="완료율" value={`${recentTrend.avgCompletionRate}%`} color="blue" />
							</div>
							{trendData && trendData.length > 0 && (
								<div className="h-24">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={trendData.slice(-7)}>
											<Line type="monotone" dataKey="responses" stroke="#171717" strokeWidth={2} dot={false} />
										</LineChart>
									</ResponsiveContainer>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-medium text-neutral-900">결과 분포</h3>
					{topResults.length > 0 && <span className="text-xs text-neutral-400">상위 {topResults.length}개</span>}
				</div>
				{topResults.length === 0 ? (
					<EmptyState message="결과 데이터가 없습니다" className="h-32" />
				) : (
					<div className="space-y-3">
						{topResults.map((result, index) => (
							<div key={result.resultId} className="space-y-1">
								<div className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-2">
										<span className="w-5 h-5 flex items-center justify-center bg-neutral-100 rounded text-xs font-medium">
											{index + 1}
										</span>
										<span className="text-neutral-700 truncate max-w-[180px]">{result.resultName}</span>
									</div>
									<span className="font-medium">{result.percentage}%</span>
								</div>
								<ProgressBar value={result.percentage} color="gray" />
							</div>
						))}
					</div>
				)}
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
				<h3 className="text-lg font-medium text-blue-900 mb-3">분석 인사이트</h3>
				<ul className="text-sm text-blue-800 space-y-2">
					{deviceData && deviceData.mobileRate > 70 && (
						<li>• 모바일 사용자 비율이 {deviceData.mobileRate}%로 높습니다. 모바일 UX 최적화를 권장합니다.</li>
					)}
					{recentTrend && recentTrend.avgCompletionRate < 50 && (
						<li>• 완료율이 {recentTrend.avgCompletionRate}%로 낮습니다. 질문별 이탈률을 확인해보세요.</li>
					)}
					{recentTrend && recentTrend.avgCompletionRate >= 70 && (
						<li>• 완료율이 {recentTrend.avgCompletionRate}%로 우수합니다!</li>
					)}
					{topResults.length > 0 && topResults[0].percentage > 50 && (
						<li>
							• &apos;{topResults[0].resultName}&apos; 결과가 {topResults[0].percentage}%로 편중되어 있습니다.
						</li>
					)}
					<li>• 상세 분석을 위해 &apos;질문별 분석&apos; 탭을 확인해보세요.</li>
				</ul>
			</div>
		</div>
	);
}

function TrendTab({
	trendData,
	isLoading,
}: {
	trendData?: DailyTestMetric[];
	isLoading: boolean;
}) {
	if (isLoading) {
		return (
			<div className="bg-white border border-neutral-200 rounded-lg p-6 animate-pulse">
				<div className="h-5 w-32 bg-neutral-200 rounded mb-4" />
				<div className="h-80 bg-neutral-100 rounded" />
			</div>
		);
	}

	if (!trendData || trendData.length === 0) {
		return (
			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<EmptyState message="트렌드 데이터가 없습니다" className="h-80" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<h3 className="text-lg font-medium text-neutral-900 mb-4">일별 응답 추이</h3>
				<div className="h-72">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
							<XAxis dataKey="date" tickFormatter={formatDateShort} stroke="#737373" fontSize={12} />
							<YAxis stroke="#737373" fontSize={12} />
							<Tooltip
								labelFormatter={(value) => formatDate(value as string)}
								formatter={(value: number) => value.toLocaleString()}
							/>
							<Legend />
							<Bar dataKey="responses" name="응답수" fill="#525252" radius={[2, 2, 0, 0]} />
							<Bar dataKey="completions" name="완료수" fill="#171717" radius={[2, 2, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<h3 className="text-lg font-medium text-neutral-900 mb-4">일별 완료율</h3>
				<div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
							<XAxis dataKey="date" tickFormatter={formatDateShort} stroke="#737373" fontSize={12} />
							<YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} stroke="#737373" fontSize={12} />
							<Tooltip labelFormatter={(value) => formatDate(value as string)} formatter={(value: number) => `${value}%`} />
							<Line
								type="monotone"
								dataKey="completionRate"
								name="완료율"
								stroke="#171717"
								strokeWidth={2}
								dot={{ r: 3, fill: '#171717' }}
								activeDot={{ r: 5 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}

function QuestionsTab({
	questionData,
	isLoading,
}: {
	questionData?: QuestionMetric[];
	isLoading: boolean;
}) {
	const columns: DefaultTableColumn<QuestionMetric>[] = [
		{
			key: 'questionOrder',
			header: '순서',
			renderCell: (row: QuestionMetric) => <span className="font-medium text-neutral-500">Q{row.questionOrder}</span>,
		},
		{
			key: 'questionText',
			header: '질문',
			renderCell: (row: QuestionMetric) => (
				<div className="max-w-[400px] truncate" title={row.questionText}>
					{row.questionText}
				</div>
			),
		},
		{
			key: 'reached',
			header: '도달',
			renderCell: (row: QuestionMetric) => (
				<div className="flex items-center gap-1.5">
					<Users className="w-3.5 h-3.5 text-neutral-400" />
					<span>{row.reached.toLocaleString()}</span>
				</div>
			),
		},
		{
			key: 'completed',
			header: '완료',
			renderCell: (row: QuestionMetric) => (
				<div className="flex items-center gap-1.5">
					<CheckCircle className="w-3.5 h-3.5 text-green-500" />
					<span className="text-green-600">{row.completed.toLocaleString()}</span>
				</div>
			),
		},
		{
			key: 'dropoffRate',
			header: '이탈률',
			renderCell: (row: QuestionMetric) => {
				const color = getDropoffRateColor(row.dropoffRate);
				const isHighDropoff = color === 'red';
				return (
					<div className="flex items-center gap-2">
						{isHighDropoff && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
						<ProgressBar value={row.dropoffRate} color={color} className="w-20" />
						<span className={`text-sm font-medium w-12 ${isHighDropoff ? 'text-red-500' : ''}`}>{row.dropoffRate}%</span>
					</div>
				);
			},
		},
	];

	const funnelData = useMemo(() => {
		if (!questionData || questionData.length === 0) return [];
		const maxReached = Math.max(...questionData.map((q) => q.reached), 1);
		return questionData.map((q) => ({
			...q,
			reachedPercent: Math.round((q.reached / maxReached) * 100),
		}));
	}, [questionData]);

	const highDropoffQuestions = useMemo(() => {
		if (!questionData) return [];
		return questionData.filter((q) => q.dropoffRate >= DROPOFF_RATE_THRESHOLDS.high);
	}, [questionData]);

	if (isLoading) {
		return (
			<div className="bg-white border border-neutral-200 rounded-lg p-6 animate-pulse">
				<div className="h-5 w-40 bg-neutral-200 rounded mb-4" />
				<div className="h-64 bg-neutral-100 rounded" />
			</div>
		);
	}

	if (!questionData || questionData.length === 0) {
		return (
			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<EmptyState message="질문 데이터가 없습니다" className="h-64" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{highDropoffQuestions.length > 0 && (
				<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
					<div className="flex items-start gap-3">
						<AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
						<div>
							<h4 className="font-medium text-amber-900">이탈률이 높은 질문이 있습니다</h4>
							<p className="text-sm text-amber-700 mt-1">
								{highDropoffQuestions.map((q) => `Q${q.questionOrder}`).join(', ')}에서 30% 이상의 이탈이 발생하고
								있습니다. 질문 내용이나 선택지를 검토해보세요.
							</p>
						</div>
					</div>
				</div>
			)}

			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<h3 className="text-lg font-medium text-neutral-900 mb-4">질문별 도달 퍼널</h3>
				<div className="space-y-2">
					{funnelData.map((item, index) => {
						const color = getDropoffRateColor(item.dropoffRate);
						const bgColor = color === 'red' ? '#fca5a5' : color === 'yellow' ? '#fcd34d' : '#86efac';
						return (
							<div key={item.questionId} className="flex items-center gap-4">
								<div className="w-8 text-sm text-neutral-500 font-medium">Q{item.questionOrder}</div>
								<div className="flex-1 relative">
									<div
										className="h-8 rounded transition-all"
										style={{
											width: `${item.reachedPercent}%`,
											backgroundColor: bgColor,
											minWidth: '40px',
										}}
									/>
									<div className="absolute inset-y-0 left-2 flex items-center">
										<span className="text-xs font-medium text-neutral-700">{item.reached.toLocaleString()}명</span>
									</div>
								</div>
								{index < funnelData.length - 1 && item.dropoffRate > 0 && (
									<div className="w-20 text-right">
										<span
											className={`text-xs ${item.dropoffRate >= DROPOFF_RATE_THRESHOLDS.high ? 'text-red-500 font-medium' : 'text-neutral-400'}`}
										>
											-{item.dropoffRate}%
										</span>
									</div>
								)}
							</div>
						);
					})}
				</div>
				<div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-200">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded bg-green-300" />
						<span className="text-xs text-neutral-500">이탈률 15% 미만</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded bg-amber-300" />
						<span className="text-xs text-neutral-500">이탈률 15-30%</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded bg-red-300" />
						<span className="text-xs text-neutral-500">이탈률 30% 이상 (주의)</span>
					</div>
				</div>
			</div>

			<div className="bg-white border border-neutral-200 rounded-lg">
				<div className="p-4 border-b border-neutral-200">
					<h3 className="text-lg font-medium text-neutral-900">질문별 상세 분석</h3>
				</div>
				<DefaultTable columns={columns} data={questionData} emptyMessage="질문 데이터가 없습니다" />
			</div>
		</div>
	);
}

function ResultsTab({
	resultData,
	isLoading,
}: {
	resultData?: ResultDistributionItem[];
	isLoading: boolean;
}) {
	const chartData = useMemo(() => {
		if (!resultData) return [];
		return resultData.map((r) => ({
			name: r.resultName,
			value: r.count,
			percentage: r.percentage,
		}));
	}, [resultData]);

	if (isLoading) {
		return (
			<div className="bg-white border border-neutral-200 rounded-lg p-6 animate-pulse">
				<div className="h-5 w-24 bg-neutral-200 rounded mb-4" />
				<div className="h-64 bg-neutral-100 rounded" />
			</div>
		);
	}

	if (!resultData || resultData.length === 0) {
		return (
			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<EmptyState message="결과 데이터가 없습니다" className="h-64" />
			</div>
		);
	}

	const totalCount = resultData.reduce((sum, r) => sum + r.count, 0);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-6">
				<div className="bg-white border border-neutral-200 rounded-lg p-6">
					<h3 className="text-lg font-medium text-neutral-900 mb-4">결과 분포</h3>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie data={chartData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
									{chartData.map((_, index) => (
										<Cell key={`cell-${index}`} fill={RESULT_COLORS[index % RESULT_COLORS.length]} />
									))}
								</Pie>
								<Tooltip formatter={(value: number, name: string) => [`${value.toLocaleString()}명`, name]} />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div className="bg-white border border-neutral-200 rounded-lg p-6">
					<h3 className="text-lg font-medium text-neutral-900 mb-4">결과별 상세</h3>
					<div className="space-y-3">
						{resultData.map((result, index) => (
							<div key={result.resultId} className="space-y-1">
								<div className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-2">
										<div
											className="w-3 h-3 rounded-full"
											style={{ backgroundColor: RESULT_COLORS[index % RESULT_COLORS.length] }}
										/>
										<span className="text-neutral-700 truncate max-w-[200px]">{result.resultName}</span>
									</div>
									<span className="font-medium">{result.percentage}%</span>
								</div>
								<ProgressBar value={result.percentage} hexColor={RESULT_COLORS[index % RESULT_COLORS.length]} />
								<div className="flex justify-between text-xs text-neutral-400">
									<span>{result.count.toLocaleString()}명</span>
									{result.avgScore !== null && <span>평균 점수: {result.avgScore}</span>}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<h3 className="text-lg font-medium text-neutral-900 mb-4">결과 분석</h3>
				<div className="grid grid-cols-3 gap-4">
					<StatBox label="결과 유형 수" value={resultData.length} />
					<StatBox label="총 완료 수" value={totalCount.toLocaleString()} />
					<StatBox label="가장 많이 나온 결과" value={resultData[0]?.resultName || '-'} />
				</div>
			</div>
		</div>
	);
}
