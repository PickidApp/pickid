import { useDashboardFilters } from '@/hooks/useDashboardFilters';
import {
	useDashboardSummary,
	useDailyGrowth,
	useChannelShare,
	useGlobalFunnel,
	useTestFunnel,
	useRecentFeedback,
} from '@/api/queries';
import { DashboardSummarySection } from '@/components/dashboard/dashboard-summary-section';
import { GrowthChartSection } from '@/components/dashboard/growth-chart-section';
import { FunnelSection } from '@/components/dashboard/funnel-section';
import { FeedbackSection } from '@/components/dashboard/feedback-section';
import dayjs from 'dayjs';

export function DashboardPage() {
	const { dateRange, setDateRange, selectedTestId, setSelectedTestId } = useDashboardFilters();

	const summaryQuery = useDashboardSummary(dateRange.from, dateRange.to);
	const growthQuery = useDailyGrowth(dateRange.from, dateRange.to);
	const channelQuery = useChannelShare(dateRange.from, dateRange.to);
	const globalFunnelQuery = useGlobalFunnel(dateRange.from, dateRange.to);
	const testFunnelQuery = useTestFunnel(selectedTestId, dateRange.from, dateRange.to);
	const feedbackQuery = useRecentFeedback(10);

	const handleQuickFilter = (days: number) => {
		setDateRange({
			from: dayjs().subtract(days, 'day').toDate(),
			to: new Date(),
		});
	};

	return (
		<div className="flex-1 p-8 overflow-auto bg-neutral-50">
			<DashboardSummarySection query={summaryQuery} />

			<GrowthChartSection
				growthQuery={growthQuery}
				channelQuery={channelQuery}
				dateRange={dateRange}
				onQuickFilter={handleQuickFilter}
			/>

			<FunnelSection
				globalFunnelQuery={globalFunnelQuery}
				testFunnelQuery={testFunnelQuery}
				selectedTestId={selectedTestId}
				onTestChange={setSelectedTestId}
			/>

			<FeedbackSection feedbackQuery={feedbackQuery} />
		</div>
	);
}
