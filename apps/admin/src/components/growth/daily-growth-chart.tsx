import { DefaultLineChart, EmptyState } from '@/components/common';
import type { DailyGrowth } from '@/types/analytics';

interface DailyGrowthChartProps {
	data?: DailyGrowth[];
}

export function DailyGrowthChart({ data }: DailyGrowthChartProps) {
	if (!data || data.length === 0) {
		return <EmptyState title="일별 성장 추이" className="bg-white border border-neutral-200 rounded-lg p-6 h-96" />;
	}

	const chartData = data.map((d) => ({
		...d,
		displayDate: new Date(d.date).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }),
	}));

	return (
		<div className="bg-white border border-neutral-200 rounded-lg p-6">
			<h3 className="text-lg font-medium text-neutral-900 mb-4">일별 성장 추이</h3>
			<DefaultLineChart
				data={chartData}
				lines={[
					{ dataKey: 'visits', name: '방문', color: '#3b82f6' },
					{ dataKey: 'responses', name: '응답', color: '#22c55e' },
					{ dataKey: 'completions', name: '완료', color: '#a855f7' },
				]}
				xAxisKey="displayDate"
				height={288}
			/>
		</div>
	);
}
