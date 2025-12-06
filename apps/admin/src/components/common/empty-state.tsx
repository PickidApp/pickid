interface EmptyStateProps {
	title?: string;
	message?: string;
	className?: string;
}

export function EmptyState({ title, message = '데이터가 없습니다', className = 'h-48' }: EmptyStateProps) {
	return (
		<div className={`${className} flex flex-col`}>
			{title && <h3 className="text-lg font-medium text-neutral-900 mb-4">{title}</h3>}
			<div className="flex-1 flex items-center justify-center text-neutral-500">{message}</div>
		</div>
	);
}
