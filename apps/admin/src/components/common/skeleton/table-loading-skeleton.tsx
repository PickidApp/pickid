interface TableLoadingSkeletonProps {
	rows?: number;
	columns?: number;
	showHeader?: boolean;
}

export function TableLoadingSkeleton({ rows = 5, columns = 5, showHeader = true }: TableLoadingSkeletonProps) {
	return (
		<div className="animate-pulse">
			{showHeader && (
				<div className="flex gap-4 p-4 border-b border-neutral-200 bg-neutral-50">
					{Array.from({ length: columns }).map((_, i) => (
						<div key={i} className="h-4 bg-neutral-200 rounded flex-1" />
					))}
				</div>
			)}
			{Array.from({ length: rows }).map((_, rowIdx) => (
				<div key={rowIdx} className="flex gap-4 p-4 border-b border-neutral-100">
					{Array.from({ length: columns }).map((_, colIdx) => (
						<div
							key={colIdx}
							className="h-4 bg-neutral-200 rounded flex-1"
							style={{ maxWidth: colIdx === 0 ? '60px' : undefined }}
						/>
					))}
				</div>
			))}
		</div>
	);
}
