import { EmptyState } from '@/components/common';
import type { FunnelStep } from '@/types/analytics';

interface FunnelChartProps {
	data?: FunnelStep[];
}

export function FunnelChart({ data }: FunnelChartProps) {
	if (!data || data.length === 0) {
		return <EmptyState />;
	}

	const maxCount = data[0]?.count || 1;

	return (
		<div className="space-y-3">
			{data.map((step, index) => {
				const widthPercent = (step.count / maxCount) * 100;

				return (
					<div key={step.step} className="flex items-center gap-4">
						<div className="w-24 text-sm text-neutral-600">{step.label}</div>
						<div className="flex-1 relative">
							<div className="h-8 bg-neutral-100 rounded-lg overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg flex items-center justify-end px-3 transition-all"
									style={{ width: `${widthPercent}%` }}
								>
									<span className="text-sm font-medium text-white">{step.count.toLocaleString()}</span>
								</div>
							</div>
						</div>
						<div className="w-16 text-right">
							{index > 0 ? (
								<span className="text-sm text-green-600">{step.rate}%</span>
							) : (
								<span className="text-sm text-neutral-400">-</span>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
