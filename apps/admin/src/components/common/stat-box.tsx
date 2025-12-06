import type { ReactNode } from 'react';

type StatBoxColor = 'default' | 'green' | 'blue' | 'red' | 'amber' | 'gray';

interface StatBoxProps {
	label: string;
	value: ReactNode;
	color?: StatBoxColor;
}

const bgColorMap = {
	default: 'bg-neutral-50',
	green: 'bg-green-50',
	blue: 'bg-blue-50',
	red: 'bg-red-50',
	amber: 'bg-amber-50',
	gray: 'bg-neutral-50',
};

const textColorMap = {
	default: 'text-neutral-900',
	green: 'text-green-600',
	blue: 'text-blue-600',
	red: 'text-red-500',
	amber: 'text-amber-600',
	gray: 'text-neutral-600',
};

export function StatBox({ label, value, color = 'default' }: StatBoxProps) {
	return (
		<div className={`text-center p-4 ${bgColorMap[color]} rounded-lg`}>
			<div className={`text-2xl font-semibold ${textColorMap[color]}`}>{value}</div>
			<div className="text-xs text-neutral-500 mt-1">{label}</div>
		</div>
	);
}
