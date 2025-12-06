export function PageLoadingSkeleton() {
	return (
		<div className="p-6 space-y-6 animate-pulse">
			<div className="h-8 bg-neutral-200 rounded w-48" />

			<div className="grid grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="bg-white border border-neutral-200 rounded-lg p-6">
						<div className="h-4 bg-neutral-200 rounded w-20 mb-3" />
						<div className="h-8 bg-neutral-200 rounded w-24" />
					</div>
				))}
			</div>

			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<div className="h-64 bg-neutral-100 rounded" />
			</div>
		</div>
	);
}
