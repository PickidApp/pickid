import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useTestsComparisonMetrics, useTestsComparisonInfo, useTestsComparisonDailyTrend } from '@/api';
import { CHART_COLORS } from '@/constants/analytics';
import { formatTime } from '@/utils/format';
import { ProgressBar, ChartSkeleton, BaseLineChart } from '@/components/common';
import { Badge } from '@pickid/ui';

interface TestCompareContentProps {
	testIds: string[];
	dateParams: { from: string; to: string };
}

export function TestCompareContent({ testIds, dateParams }: TestCompareContentProps) {
	const testInfoQueries = useTestsComparisonInfo(testIds);
	const metricsQueries = useTestsComparisonMetrics(testIds, dateParams);
	const dailyTrendQueries = useTestsComparisonDailyTrend(testIds, dateParams);

	const isLoading =
		testInfoQueries.some((q) => q.isLoading) ||
		metricsQueries.some((q) => q.isLoading) ||
		dailyTrendQueries.some((q) => q.isLoading);

	const testInfoMap = useMemo(() => {
		const map: Record<string, { title: string; type: string }> = {};
		testInfoQueries.forEach((query, idx) => {
			if (query.data) {
				map[testIds[idx]] = {
					title: query.data.title ?? `테스트 ${idx + 1}`,
					type: query.data.type ?? 'unknown',
				};
			}
		});
		return map;
	}, [testInfoQueries, testIds]);

	const comparisonData = useMemo(() => {
		return metricsQueries.map((query, idx) => {
			const testId = testIds[idx];
			const info = testInfoMap[testId];
			const data = query.data;
			return {
				testId,
				name: info?.title ?? `테스트 ${idx + 1}`,
				responses: data?.totalResponses ?? 0,
				completionRate: data?.completionRate ?? 0,
				avgTime: data?.avgCompletionTime ?? 0,
			};
		});
	}, [metricsQueries, testIds, testInfoMap]);

	const trendData = useMemo(() => {
		const dateMap: Record<string, Record<string, number>> = {};

		dailyTrendQueries.forEach((query, idx) => {
			const testId = testIds[idx];
			const trends = query.data ?? [];
			trends.forEach((item: { date: string; responses: number }) => {
				if (!dateMap[item.date]) {
					dateMap[item.date] = {};
				}
				dateMap[item.date][testId] = item.responses;
			});
		});

		return Object.entries(dateMap)
			.map(([date, values]) => ({
				date: dayjs(date).format('MM/DD'),
				...values,
			}))
			.sort((a, b) => a.date.localeCompare(b.date));
	}, [dailyTrendQueries, testIds]);

	const lineConfigs = useMemo(() => {
		return testIds.map((testId, idx) => ({
			dataKey: testId,
			name: testInfoMap[testId]?.title ?? `테스트 ${idx + 1}`,
			color: CHART_COLORS[idx % CHART_COLORS.length],
		}));
	}, [testIds, testInfoMap]);

	if (isLoading) {
		return <ChartSkeleton height={256} title="테스트 비교" />;
	}

	const maxResponses = Math.max(...comparisonData.map((d) => d.responses), 1);
	const maxAvgTime = Math.max(...comparisonData.map((d) => d.avgTime), 1);

	return (
		<div className="space-y-6">
			<div className="bg-white border border-neutral-200 rounded-lg p-4">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-sm text-neutral-500">비교 대상:</span>
					{comparisonData.map((test, idx) => (
						<Badge
							key={test.testId}
							style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length], color: 'white' }}
						>
							{test.name}
						</Badge>
					))}
				</div>
			</div>

			<div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
				<div className="px-6 py-4 border-b border-neutral-200">
					<h4 className="text-sm font-medium text-neutral-700">테스트 성과 비교</h4>
				</div>
				<table className="w-full text-sm">
					<thead className="bg-neutral-50">
						<tr>
							<th className="text-left px-6 py-3 font-medium text-neutral-600 w-[200px]">테스트</th>
							<th className="text-left px-6 py-3 font-medium text-neutral-600">응답수</th>
							<th className="text-left px-6 py-3 font-medium text-neutral-600">완료율</th>
							<th className="text-left px-6 py-3 font-medium text-neutral-600">평균 소요시간</th>
						</tr>
					</thead>
					<tbody>
						{comparisonData.map((test, idx) => {
							const color = CHART_COLORS[idx % CHART_COLORS.length];
							return (
								<tr key={test.testId} className="border-t border-neutral-100">
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
											<span className="font-medium text-neutral-900 truncate">{test.name}</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="space-y-1">
											<span className="text-neutral-900 font-medium">{test.responses.toLocaleString()}</span>
											<ProgressBar value={test.responses} max={maxResponses} hexColor={color} />
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="space-y-1">
											<span
												className={`font-medium ${
													test.completionRate >= 70
														? 'text-green-600'
														: test.completionRate >= 40
															? 'text-amber-600'
															: 'text-red-500'
												}`}
											>
												{test.completionRate}%
											</span>
											<ProgressBar value={test.completionRate} max={100} hexColor={color} />
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="space-y-1">
											<span className="text-neutral-600">{formatTime(test.avgTime)}</span>
											<ProgressBar value={test.avgTime} max={maxAvgTime} hexColor={color} />
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{trendData.length > 0 && (
				<div className="bg-white border border-neutral-200 rounded-lg p-6">
					<h4 className="text-sm font-medium text-neutral-700 mb-4">일별 응답 트렌드</h4>
					<BaseLineChart data={trendData} lines={lineConfigs} xAxisKey="date" height={288} />
				</div>
			)}
		</div>
	);
}
