export interface StatCardProps {
	label: string;
	value: number | string;
	color?: 'default' | 'green' | 'red' | 'gray' | 'yellow' | 'blue';
}

const colorMap = {
	default: 'text-neutral-900',
	green: 'text-green-600',
	red: 'text-red-500',
	gray: 'text-neutral-500',
	yellow: 'text-yellow-600',
	blue: 'text-blue-600',
};

export function StatCard({ label, value, color = 'default' }: StatCardProps) {
	return (
		<div className="bg-white border border-neutral-200 rounded-lg px-4 py-2 flex items-center gap-3">
			<span className="text-xs text-neutral-500">{label}</span>
			<span className={`text-lg font-semibold ${colorMap[color]}`}>{value}</span>
		</div>
	);
}
