import { useState, useMemo } from 'react';
import {
	useDashboardSummary,
	useDailyGrowth,
	useChannelShare,
	useGlobalFunnel,
	useTestFunnel,
	useRecentFeedback,
} from '@/api';
import { DashboardSummarySection } from '@/components/dashboard/dashboard-summary-section';
import { GrowthChartSection } from '@/components/dashboard/growth-chart-section';
import { FunnelSection } from '@/components/dashboard/funnel-section';
import { FeedbackSection } from '@/components/dashboard/feedback-section';
import { PageLoadingSkeleton } from '@/components/common';
import { getDateRangeParams } from '@/utils';
import { type DateRangeOption } from '@/constants/analytics';

export function DashboardPage() {
	const [dateRange, setDateRange] = useState<DateRangeOption>('7d');
	const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

	const dateParams = useMemo(() => getDateRangeParams(dateRange), [dateRange]);

	const summaryQuery = useDashboardSummary(dateParams);
	const growthQuery = useDailyGrowth(dateParams);
	const channelQuery = useChannelShare(dateParams);
	const globalFunnelQuery = useGlobalFunnel(dateParams);
	const feedbackQuery = useRecentFeedback(10);
	const testFunnelQuery = useTestFunnel(selectedTestId, dateParams);

	const handleQuickFilter = (days: number) => {
		setDateRange(`${days}d` as DateRangeOption);
	};

	const isLoading =
		summaryQuery.isLoading ||
		growthQuery.isLoading ||
		channelQuery.isLoading ||
		globalFunnelQuery.isLoading ||
		feedbackQuery.isLoading;

	if (isLoading) {
		return <PageLoadingSkeleton />;
	}

	return (
		<>
			<header className="bg-white border-b px-6 py-4">
				<h1 className="text-2xl text-neutral-900">대시보드</h1>
				<p className="text-sm text-neutral-500 mt-1">서비스 핵심 지표를 한눈에 확인하세요</p>
			</header>

			<div className="p-6">
				<DashboardSummarySection data={summaryQuery.data!} />

				<GrowthChartSection
					growthData={growthQuery.data ?? []}
					channelData={channelQuery.data ?? []}
					dateRange={dateRange}
					onQuickFilter={handleQuickFilter}
				/>

				<FunnelSection
					globalFunnelData={globalFunnelQuery.data ?? []}
					testFunnelQuery={testFunnelQuery}
					selectedTestId={selectedTestId}
					onTestChange={setSelectedTestId}
				/>

				<FeedbackSection data={feedbackQuery.data ?? []} />
			</div>
		</>
	);
}
