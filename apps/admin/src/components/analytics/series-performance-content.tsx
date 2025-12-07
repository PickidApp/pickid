import { useState, useMemo } from 'react';
import { useSeriesPerformanceQuery, useSeriesFunnelQuery, useSeriesTestsPerformanceQuery } from '@/api';
import { ProgressBar, ChartSkeleton } from '@/components/common';
import { getCompletionRateColor, getDropoffRateColor } from '@/utils/analytics';
import { formatTime } from '@/utils/format';
import { DefaultTable, DefaultSelect, type DefaultTableColumn } from '@pickid/ui';
import type { SeriesPerformance, SeriesFunnelStep, SeriesTestPerformance } from '@/types/test-analytics';
import { BarChart3, Users, ArrowRight } from 'lucide-react';

interface SeriesPerformanceContentProps {
	dateParams: { from: string; to: string };
}

export function SeriesPerformanceContent({ dateParams }: SeriesPerformanceContentProps) {
	const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');

	const { data: seriesList, isLoading: seriesListLoading } = useSeriesPerformanceQuery(dateParams);
	const { data: funnelData, isLoading: funnelLoading } = useSeriesFunnelQuery(selectedSeriesId, dateParams);
	const { data: testsData, isLoading: testsLoading } = useSeriesTestsPerformanceQuery(selectedSeriesId, dateParams);

	const seriesOptions = useMemo(() => {
		if (!seriesList) return [];
		return seriesList.map((s) => ({
			value: s.seriesId,
			label: s.seriesName,
		}));
	}, [seriesList]);

	const seriesColumns: DefaultTableColumn<SeriesPerformance>[] = [
		{
			key: 'seriesName',
			header: '시리즈',
			renderCell: (row: SeriesPerformance) => (
				<div>
					<div className="font-medium text-neutral-900">{row.seriesName}</div>
					<div className="text-xs text-neutral-400">{row.testsCount}개 테스트</div>
				</div>
			),
		},
		{
			key: 'entryResponses',
			header: '1편 응답수',
			renderCell: (row: SeriesPerformance) => (
				<div className="flex items-center gap-1.5">
					<BarChart3 className="w-3.5 h-3.5 text-neutral-400" />
					<span className="font-medium">{row.entryResponses.toLocaleString()}</span>
				</div>
			),
		},
		{
			key: 'entryCompletionRate',
			header: '1편 완료율',
			renderCell: (row: SeriesPerformance) => (
				<div className="flex items-center gap-2">
					<ProgressBar
						value={row.entryCompletionRate}
						color={getCompletionRateColor(row.entryCompletionRate)}
						className="w-16"
					/>
					<span className="text-sm font-medium w-10">{row.entryCompletionRate}%</span>
				</div>
			),
		},
		{
			key: 'seriesCompletionRate',
			header: '시리즈 완주율',
			renderCell: (row: SeriesPerformance) => (
				<div className="flex items-center gap-2">
					<ProgressBar
						value={row.seriesCompletionRate}
						color={getCompletionRateColor(row.seriesCompletionRate)}
						className="w-16"
					/>
					<span className="text-sm font-medium w-10">{row.seriesCompletionRate}%</span>
				</div>
			),
		},
		{
			key: 'avgTestsPerSession',
			header: '세션당 평균 테스트',
			renderCell: (row: SeriesPerformance) => (
				<div className="flex items-center gap-1.5">
					<Users className="w-3.5 h-3.5 text-neutral-400" />
					<span className="font-medium">{row.avgTestsPerSession.toFixed(1)}</span>
				</div>
			),
		},
	];

	const handleSeriesSelect = (row: SeriesPerformance) => {
		setSelectedSeriesId(row.seriesId);
	};

	if (seriesListLoading) {
		return <ChartSkeleton height={400} title="시리즈별 성과" />;
	}

	return (
		<div className="space-y-6">
			<div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
				<div className="px-6 py-4 border-b border-neutral-200">
					<h4 className="text-sm font-medium text-neutral-700">시리즈별 성과</h4>
					<p className="text-xs text-neutral-500 mt-1">시리즈를 클릭하면 상세 퍼널을 확인할 수 있습니다</p>
				</div>
				<DefaultTable
					columns={seriesColumns}
					data={seriesList || []}
					isLoading={seriesListLoading}
					emptyMessage="시리즈 데이터가 없습니다"
					onRowClick={handleSeriesSelect}
					className="border-0 rounded-none"
				/>
			</div>

			{selectedSeriesId && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
						<div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
							<div>
								<h4 className="text-sm font-medium text-neutral-700">시리즈 퍼널</h4>
								<p className="text-xs text-neutral-500 mt-1">테스트별 도달 및 이탈률</p>
							</div>
							<DefaultSelect
								value={selectedSeriesId}
								onValueChange={setSelectedSeriesId}
								options={seriesOptions}
								placeholder="시리즈 선택"
								className="w-48"
							/>
						</div>
						<div className="p-6">
							{funnelLoading ? (
								<ChartSkeleton height={200} />
							) : !funnelData || funnelData.length === 0 ? (
								<div className="text-center text-neutral-500 py-8">퍼널 데이터가 없습니다</div>
							) : (
								<div className="space-y-3">
									{funnelData.map((step: SeriesFunnelStep, idx: number) => (
										<div key={step.testId} className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-medium">
												{step.seriesOrder}
											</div>
											<div className="flex-1">
												<div className="flex items-center justify-between mb-1">
													<span className="text-sm font-medium text-neutral-900 truncate max-w-[200px]">
														{step.testTitle}
													</span>
													<span className="text-xs text-neutral-500">
														{step.reached.toLocaleString()} 도달 → {step.completed.toLocaleString()} 완료
													</span>
												</div>
												<div className="flex items-center gap-2">
													<ProgressBar
														value={100 - step.dropoffRate}
														color={getDropoffRateColor(step.dropoffRate)}
														className="flex-1"
													/>
													<span
														className={`text-xs w-12 text-right ${
															step.dropoffRate >= 30
																? 'text-red-500'
																: step.dropoffRate >= 15
																	? 'text-amber-500'
																	: 'text-green-500'
														}`}
													>
														-{step.dropoffRate}%
													</span>
												</div>
											</div>
											{idx < funnelData.length - 1 && (
												<ArrowRight className="w-4 h-4 text-neutral-300 flex-shrink-0" />
											)}
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					<div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
						<div className="px-6 py-4 border-b border-neutral-200">
							<h4 className="text-sm font-medium text-neutral-700">시리즈 내 테스트 성과</h4>
							<p className="text-xs text-neutral-500 mt-1">각 편별 상세 지표</p>
						</div>
						{testsLoading ? (
							<ChartSkeleton height={200} />
						) : !testsData || testsData.length === 0 ? (
							<div className="text-center text-neutral-500 py-8">테스트 데이터가 없습니다</div>
						) : (
							<table className="w-full text-sm">
								<thead className="bg-neutral-50">
									<tr>
										<th className="text-left px-6 py-3 font-medium text-neutral-600">순서</th>
										<th className="text-left px-6 py-3 font-medium text-neutral-600">테스트</th>
										<th className="text-left px-6 py-3 font-medium text-neutral-600">응답수</th>
										<th className="text-left px-6 py-3 font-medium text-neutral-600">완료율</th>
										<th className="text-left px-6 py-3 font-medium text-neutral-600">평균 시간</th>
									</tr>
								</thead>
								<tbody>
									{testsData.map((test: SeriesTestPerformance) => (
										<tr key={test.testId} className="border-t border-neutral-100">
											<td className="px-6 py-3">
												<span className="w-6 h-6 rounded bg-neutral-100 flex items-center justify-center text-xs font-medium">
													{test.seriesOrder}
												</span>
											</td>
											<td className="px-6 py-3 font-medium text-neutral-900 max-w-[150px] truncate">
												{test.testTitle}
											</td>
											<td className="px-6 py-3 text-neutral-600">{test.totalResponses.toLocaleString()}</td>
											<td className="px-6 py-3">
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
											</td>
											<td className="px-6 py-3 text-neutral-500">{formatTime(test.avgCompletionTime)}</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
