import * as React from 'react';
import { cn } from '@pickid/shared';

interface Column<T> {
	key: keyof T | 'actions' | string;
	header: string;
	width?: string;
	renderCell: (row: T) => React.ReactNode;
}

export interface BaseTableProps<T> {
	data: T[];
	columns: Column<T>[];
	isLoading?: boolean;
	emptyMessage?: string;
	className?: string;
	onRowClick?: (row: T) => void;
}

const BaseTable = <T extends Record<string, any>>({
	data,
	columns,
	isLoading = false,
	emptyMessage = '데이터가 없습니다.',
	className,
	onRowClick,
}: BaseTableProps<T>) => {
	if (isLoading) {
		return (
			<div
				className={cn(
					'flex items-center justify-center py-12 bg-white rounded-lg border border-neutral-200',
					className
				)}
			>
				<p className="text-neutral-500">로딩 중...</p>
			</div>
		);
	}

	if (!data || data.length === 0) {
		return (
			<div
				className={cn(
					'flex items-center justify-center py-12 bg-white rounded-lg border border-neutral-200',
					className
				)}
			>
				<p className="text-neutral-500">{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className={cn('bg-white rounded-lg border border-neutral-200 overflow-hidden', className)}>
			<table className="w-full">
				<thead>
					<tr className="border-b border-neutral-200 bg-neutral-50">
						{columns.map((column) => (
							<th
								key={String(column.key)}
								className="px-6 py-3 text-left text-xs text-neutral-500 uppercase tracking-wider"
								style={{ width: column.width }}
							>
								{column.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-neutral-200">
					{data.map((row, rowIndex) => (
						<tr
							key={rowIndex}
							className={cn('hover:bg-neutral-50', onRowClick && 'cursor-pointer')}
							onClick={() => onRowClick?.(row)}
						>
							{columns.map((column) => (
								<td key={String(column.key)} className="px-6 py-4">
									{column.renderCell(row)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export { BaseTable };
