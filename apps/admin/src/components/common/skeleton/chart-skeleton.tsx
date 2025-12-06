interface ChartSkeletonProps {
	height?: number;
	title?: string;
}

export function ChartSkeleton({ height = 256, title }: ChartSkeletonProps) {
	return (
		<div className="bg-white border border-neutral-200 rounded-lg p-6 animate-pulse">
			{title && <div className="h-5 bg-neutral-200 rounded w-48 mb-4" />}
			<div className="bg-neutral-100 rounded" style={{ height }} />
		</div>
	);
}
