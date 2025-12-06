import { EmptyState } from '@/components/common';
import { getRetentionHeatmapStyle } from '@/utils/analytics';
import type { CohortData } from '@/types/analytics';

interface CohortTableProps {
	data?: CohortData[];
}

export function CohortTable({ data }: CohortTableProps) {
	if (!data || data.length === 0) {
		return <EmptyState />;
	}

	const maxWeeks = Math.max(...data.map((d) => d.weeks.length));

	return (
		<div className="overflow-x-auto">
			<table className="w-full">
				<thead>
					<tr className="border-b border-neutral-200">
						<th className="text-left py-3 text-sm font-medium text-neutral-500 min-w-[80px]">코호트</th>
						<th className="text-right py-3 text-sm font-medium text-neutral-500 min-w-[60px]">사용자</th>
						{Array.from({ length: maxWeeks }).map((_, i) => (
							<th key={i} className="text-center py-3 text-sm font-medium text-neutral-500 min-w-[60px]">
								Week {i}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((cohort) => (
						<tr key={cohort.cohort} className="border-b border-neutral-100 last:border-0">
							<td className="py-2 text-sm text-neutral-900">{cohort.cohort}</td>
							<td className="py-2 text-sm text-neutral-600 text-right">{cohort.users}</td>
							{cohort.weeks.map((value, i) => (
								<td key={i} className="py-2 text-center">
									<span
										className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRetentionHeatmapStyle(value)}`}
									>
										{value}%
									</span>
								</td>
							))}
							{Array.from({ length: maxWeeks - cohort.weeks.length }).map((_, i) => (
								<td key={`empty-${i}`} className="py-2 text-center">
									<span className="inline-block px-2 py-1 rounded text-xs text-neutral-300">-</span>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
