interface ModalLoadingSkeletonProps {
	variant?: 'default' | 'detail' | 'simple';
}

export function ModalLoadingSkeleton({ variant = 'default' }: ModalLoadingSkeletonProps) {
	if (variant === 'simple') {
		return (
			<div className="animate-pulse py-8">
				<div className="flex flex-col items-center gap-3">
					<div className="h-8 w-8 border-4 border-neutral-200 border-t-neutral-400 rounded-full animate-spin" />
					<div className="h-4 bg-neutral-200 rounded w-24" />
				</div>
			</div>
		);
	}

	if (variant === 'detail') {
		return (
			<div className="animate-pulse space-y-6">
				<div className="space-y-3">
					<div className="h-4 bg-neutral-200 rounded w-24" />
					<div className="bg-neutral-50 rounded-lg p-4 space-y-3">
						<div className="flex justify-between">
							<div className="h-4 bg-neutral-200 rounded w-20" />
							<div className="h-4 bg-neutral-200 rounded w-32" />
						</div>
						<div className="flex justify-between">
							<div className="h-4 bg-neutral-200 rounded w-24" />
							<div className="h-4 bg-neutral-200 rounded w-28" />
						</div>
						<div className="flex justify-between">
							<div className="h-4 bg-neutral-200 rounded w-16" />
							<div className="h-4 bg-neutral-200 rounded w-36" />
						</div>
					</div>
				</div>
				<div className="space-y-3">
					<div className="h-4 bg-neutral-200 rounded w-28" />
					<div className="bg-neutral-50 rounded-lg p-4 space-y-3">
						<div className="flex justify-between">
							<div className="h-4 bg-neutral-200 rounded w-24" />
							<div className="h-4 bg-neutral-200 rounded w-20" />
						</div>
						<div className="flex justify-between">
							<div className="h-4 bg-neutral-200 rounded w-20" />
							<div className="h-4 bg-neutral-200 rounded w-24" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	// default variant
	return (
		<div className="animate-pulse space-y-6">
			<div className="grid grid-cols-3 gap-6">
				<div className="col-span-2 space-y-6">
					<div className="border border-neutral-200 rounded-lg p-4 space-y-4">
						<div className="h-5 bg-neutral-200 rounded w-24" />
						<div className="grid grid-cols-2 gap-4">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<div className="h-3 bg-neutral-200 rounded w-16" />
									<div className="h-5 bg-neutral-200 rounded w-32" />
								</div>
							))}
						</div>
					</div>
					<div className="border border-neutral-200 rounded-lg p-4 space-y-4">
						<div className="h-5 bg-neutral-200 rounded w-20" />
						<div className="grid grid-cols-4 gap-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="bg-neutral-50 rounded-lg p-4">
									<div className="h-3 bg-neutral-200 rounded w-12 mb-2" />
									<div className="h-6 bg-neutral-200 rounded w-8" />
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="space-y-6">
					<div className="border border-neutral-200 rounded-lg p-4">
						<div className="h-5 bg-neutral-200 rounded w-20 mb-4" />
						<div className="aspect-video bg-neutral-100 rounded-lg" />
					</div>
					<div className="border border-neutral-200 rounded-lg p-4 space-y-3">
						<div className="h-5 bg-neutral-200 rounded w-24" />
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="flex justify-between py-2">
								<div className="h-4 bg-neutral-200 rounded w-24" />
								<div className="h-4 bg-neutral-200 rounded w-12" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
