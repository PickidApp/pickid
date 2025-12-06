interface ProgressBarProps {
	value: number;
	max?: number;
	color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray';
	hexColor?: string;
	className?: string;
}

const colorClasses = {
	green: 'bg-green-500',
	yellow: 'bg-amber-500',
	red: 'bg-red-400',
	blue: 'bg-blue-500',
	gray: 'bg-neutral-400',
};

export function ProgressBar({ value, max = 100, color = 'blue', hexColor, className = '' }: ProgressBarProps) {
	const percentage = Math.min((value / max) * 100, 100);

	return (
		<div className={`w-full bg-neutral-100 rounded-full h-2 overflow-hidden ${className}`}>
			<div
				className={`h-full rounded-full transition-all ${hexColor ? '' : colorClasses[color]}`}
				style={{ width: `${percentage}%`, ...(hexColor ? { backgroundColor: hexColor } : {}) }}
			/>
		</div>
	);
}
