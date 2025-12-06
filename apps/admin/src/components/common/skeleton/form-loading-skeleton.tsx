export function FormLoadingSkeleton() {
	return (
		<div className="animate-pulse space-y-6 max-w-4xl mx-auto">
			<div className="bg-white border border-neutral-200 rounded-lg p-8 space-y-6">
				{/* 제목 영역 */}
				<div className="space-y-2">
					<div className="h-4 bg-neutral-200 rounded w-16" />
					<div className="h-10 bg-neutral-100 rounded w-full" />
				</div>
				{/* 2열 입력 */}
				<div className="grid grid-cols-2 gap-6">
					<div className="space-y-2">
						<div className="h-4 bg-neutral-200 rounded w-20" />
						<div className="h-10 bg-neutral-100 rounded w-full" />
					</div>
					<div className="space-y-2">
						<div className="h-4 bg-neutral-200 rounded w-24" />
						<div className="h-10 bg-neutral-100 rounded w-full" />
					</div>
				</div>
				{/* 설명 영역 */}
				<div className="space-y-2">
					<div className="h-4 bg-neutral-200 rounded w-12" />
					<div className="h-24 bg-neutral-100 rounded w-full" />
				</div>
				{/* 이미지 영역 */}
				<div className="space-y-2">
					<div className="h-4 bg-neutral-200 rounded w-16" />
					<div className="h-40 bg-neutral-100 rounded w-48" />
				</div>
				{/* 버튼 영역 */}
				<div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
					<div className="h-10 bg-neutral-200 rounded w-20" />
					<div className="h-10 bg-neutral-300 rounded w-20" />
				</div>
			</div>
		</div>
	);
}
