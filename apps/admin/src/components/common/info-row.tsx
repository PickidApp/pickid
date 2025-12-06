import type { ReactNode } from 'react';

interface InfoRowProps {
	label: string;
	value: ReactNode;
	fallback?: string;
	valueClassName?: string;
}

export function InfoRow({ label, value, fallback = '-', valueClassName = 'text-neutral-700' }: InfoRowProps) {
	const displayValue = value ?? fallback;

	return (
		<div className="flex justify-between">
			<span className="text-neutral-500">{label}</span>
			<span className={valueClassName}>{displayValue}</span>
		</div>
	);
}
