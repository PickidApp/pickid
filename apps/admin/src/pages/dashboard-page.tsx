import { useState, useMemo } from 'react';
import {
	useDashboardSummary,
	useDailyGrowth,
	useChannelShare,
	useGlobalFunnel,
	useTestFunnel,
	useRecentFeedback,
	useFeaturedTest,
	useCurrentTheme,
	useThemeTests,
} from '@/api';
import { DashboardSummarySection } from '@/components/dashboard/dashboard-summary-section';
import { GrowthChartSection } from '@/components/dashboard/growth-chart-section';
import { FunnelSection } from '@/components/dashboard/funnel-section';
import { FeedbackSection } from '@/components/dashboard/feedback-section';
import { FeaturedSection } from '@/components/dashboard/featured-section';
import { getDateRangeParams } from '@/utils';
import { type DateRangeOption } from '@/constants/analytics';
import { Button, IconButton } from '@pickid/ui';
import { Plus, ExternalLink } from 'lucide-react';
import { PATH } from '@/constants';

export function DashboardPage() {
	const [dateRange, setDateRange] = useState<DateRangeOption>('7d');
	const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

	const dateParams = useMemo(() => getDateRangeParams(dateRange), [dateRange]);

	const { data: summaryData } = useDashboardSummary(dateParams);
	const { data: growthData } = useDailyGrowth(dateParams);
	const { data: channelData } = useChannelShare(dateParams);
	const { data: globalFunnelData } = useGlobalFunnel(dateParams);
	const { data: feedbackData } = useRecentFeedback(10);
	const testFunnelQuery = useTestFunnel(selectedTestId, dateParams);

	// 오늘의 테스트/테마
	const { data: featuredTest } = useFeaturedTest();
	const { data: currentTheme } = useCurrentTheme();
	const themeTestsQuery = useThemeTests(currentTheme?.id ?? null, 3);

	const handleQuickFilter = (days: number) => {
		setDateRange(`${days}d` as DateRangeOption);
	};

	const handleCreateTest = () => {
		window.location.href = PATH.TEST_CREATE;
	};

	return (
		<>
			<header className="bg-white border-b px-6 py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl text-neutral-900">대시보드</h1>
						<p className="text-sm text-neutral-500 mt-1">오늘의 핵심 지표</p>
					</div>
					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							size="sm"
							className="text-blue-600 border-blue-200 hover:bg-blue-50"
							onClick={() => window.open('https://analytics.google.com', '_blank')}
							text="GA 대시보드"
						/>
						<IconButton
							size="sm"
							variant="outline"
							onClick={handleCreateTest}
							icon={<Plus className="w-4 h-4" />}
							text="새 테스트 만들기"
							aria-label="새 테스트 만들기"
						/>
					</div>
				</div>
			</header>

			<div className="p-6">
				{/* 핵심 KPI */}
				<DashboardSummarySection data={summaryData} />

				{/* 실시간 활동 안내 - GA 연동 */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
					<div className="flex items-start gap-3">
						<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
							<ExternalLink className="w-4 h-4 text-blue-600" />
						</div>
						<div>
							<h3 className="font-medium text-blue-900">실시간 활동 모니터링</h3>
							<p className="text-sm text-blue-700 mt-1">
								실시간 방문자 및 사용자 행동은 Google Analytics에서 확인하세요.
							</p>
						</div>
					</div>
				</div>

				{/* 성장 차트 */}
				<GrowthChartSection
					growthData={growthData}
					channelData={channelData}
					dateRange={dateRange}
					onQuickFilter={handleQuickFilter}
				/>

				{/* 퍼널 분석 */}
				<FunnelSection
					globalFunnelData={globalFunnelData}
					testFunnelQuery={testFunnelQuery}
					selectedTestId={selectedTestId}
					onTestChange={setSelectedTestId}
				/>

				{/* 하단 2열: 오늘의 테스트/테마 + 피드백 */}
				<div className="grid grid-cols-2 gap-6 mt-8">
					<div className="col-span-2">
						<FeaturedSection
							featuredTest={featuredTest}
							currentTheme={currentTheme}
							themeTests={themeTestsQuery.data}
						/>
					</div>
				</div>

				{/* 최근 피드백 */}
				<div className="mt-8">
					<FeedbackSection data={feedbackData} />
				</div>
			</div>
		</>
	);
}
