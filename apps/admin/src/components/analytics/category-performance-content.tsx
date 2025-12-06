import { useCategoryPerformanceQuery } from '@/api';
import { ProgressBar, ChartSkeleton } from '@/components/common';
import { getCompletionRateColor } from '@/utils/analytics';
import { formatTime } from '@/utils/format';
import { DefaultTable, type DefaultTableColumn } from '@pickid/ui';
import type { CategoryPerformance } from '@/types/test-analytics';
import { BarChart3, Clock, TrendingDown } from 'lucide-react';

interface CategoryPerformanceContentProps {
	dateParams: { from: string; to: string };
}

export function CategoryPerformanceContent({ dateParams }: CategoryPerformanceContentProps) {
	const { data, isLoading } = useCategoryPerformanceQuery(dateParams);

	if (isLoading) {
		return <ChartSkeleton height={400} title="카테고리별 성과" />;
	}

	const columns: DefaultTableColumn<CategoryPerformance>[] = [
		{
			key: 'categoryName',
			header: '카테고리',
			renderCell: (row: CategoryPerformance) => (
				<div>
					<div className="font-medium text-neutral-900">{row.categoryName}</div>
					<div className="text-xs text-neutral-400">{row.categorySlug}</div>
				</div>
			),
		},
		{
			key: 'testsCount',
			header: '테스트 수',
			renderCell: (row: CategoryPerformance) => (
				<span className="font-medium">{row.testsCount.toLocaleString()}</span>
			),
		},
		{
			key: 'totalResponses',
			header: '총 응답수',
			renderCell: (row: CategoryPerformance) => (
				<div className="flex items-center gap-1.5">
					<BarChart3 className="w-3.5 h-3.5 text-neutral-400" />
					<span className="font-medium">{row.totalResponses.toLocaleString()}</span>
				</div>
			),
		},
		{
			key: 'completionRate',
			header: '완료율',
			renderCell: (row: CategoryPerformance) => (
				<div className="flex items-center gap-2">
					<ProgressBar value={row.completionRate} color={getCompletionRateColor(row.completionRate)} className="w-16" />
					<span className="text-sm font-medium w-10">{row.completionRate}%</span>
				</div>
			),
		},
		{
			key: 'avgCompletionTime',
			header: '평균 소요시간',
			renderCell: (row: CategoryPerformance) => (
				<div className="flex items-center gap-1.5 text-neutral-600">
					<Clock className="w-3.5 h-3.5" />
					<span className="text-sm">{formatTime(row.avgCompletionTime)}</span>
				</div>
			),
		},
		{
			key: 'resultSkew',
			header: '결과 편중도',
			renderCell: (row: CategoryPerformance) => {
				if (row.resultSkew === null) {
					return <span className="text-neutral-400">-</span>;
				}
				const isHigh = row.resultSkew >= 70;
				return (
					<div className="flex items-center gap-1.5">
						{isHigh && <TrendingDown className="w-3.5 h-3.5 text-amber-500" />}
						<span className={`text-sm ${isHigh ? 'text-amber-600 font-medium' : 'text-neutral-600'}`}>
							{row.resultSkew}%
						</span>
					</div>
				);
			},
		},
	];

	return (
		<div className="space-y-4">
			<div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
				<div className="px-6 py-4 border-b border-neutral-200">
					<h4 className="text-sm font-medium text-neutral-700">카테고리별 성과</h4>
					<p className="text-xs text-neutral-500 mt-1">각 카테고리의 테스트 성과를 비교합니다</p>
				</div>
				<DefaultTable columns={columns} data={data || []} isLoading={isLoading} emptyMessage="카테고리 데이터가 없습니다" />
			</div>
		</div>
	);
}
