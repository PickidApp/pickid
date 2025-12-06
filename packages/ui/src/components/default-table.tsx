import { cn } from '@pickid/shared';
import { Check, ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DefaultPagination } from './default-pagination';
export interface DefaultTableColumn<T> {
	key: keyof T | 'actions' | string;
	header: string;
	width?: number;
	renderCell: (row: T, index: number) => ReactNode;
	filterOptions?: { value: string; label: string }[];
	filterValue?: string[];
	onFilterChange?: (values: string[]) => void;
}

export interface DefaultTableProps<T> {
	data: T[];
	columns: DefaultTableColumn<T>[];
	isLoading?: boolean;
	emptyMessage?: string;
	className?: string;
	onRowClick?: (row: T) => void;
	pagination?: {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
	};
}

/** @deprecated Use DefaultTableColumn instead */
export type BaseTableColumn<T> = DefaultTableColumn<T>;
/** @deprecated Use DefaultTableProps instead */
export type BaseTableProps<T> = DefaultTableProps<T>;

function ColumnFilter({
	header,
	options,
	value = [],
	onChange,
}: {
	header: string;
	options: { value: string; label: string }[];
	value?: string[];
	onChange?: (values: string[]) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState<string[]>(value);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState({ top: 0, left: 0 });

	useEffect(() => setSelected(value), [value]);

	useEffect(() => {
		if (isOpen && triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			setPosition({ top: rect.bottom + 4, left: rect.left });
		}
	}, [isOpen]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node;
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(target) &&
				triggerRef.current &&
				!triggerRef.current.contains(target)
			) {
				setIsOpen(false);
				setSelected(value);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [value]);

	const handleToggle = (v: string) => {
		setSelected((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
	};

	const handleApply = () => {
		onChange?.(selected);
		setIsOpen(false);
	};

	const handleReset = () => {
		setSelected([]);
		onChange?.([]);
		setIsOpen(false);
	};

	const filterableOptions = options.filter((opt) => opt.value !== '');

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-1 hover:text-neutral-700"
			>
				<span>{header}</span>
				{value.length > 0 && <span className="text-neutral-900">({value.length})</span>}
				<ChevronDown className={cn('w-3 h-3 transition-transform', isOpen && 'rotate-180')} />
			</button>

			{isOpen &&
				createPortal(
					<div
						ref={dropdownRef}
						className="fixed bg-white border rounded-lg shadow-lg z-[9999] min-w-[160px]"
						style={{ top: position.top, left: position.left }}
					>
						<div className="p-2 border-b">
							<span className="text-xs text-neutral-500">필터</span>
						</div>
						<div className="max-h-48 overflow-y-auto p-1">
							{filterableOptions.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => handleToggle(opt.value)}
									className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-neutral-50 rounded"
								>
									<span
										className={cn(
											'w-4 h-4 border rounded flex items-center justify-center shrink-0',
											selected.includes(opt.value) ? 'bg-neutral-900 border-neutral-900' : 'border-neutral-300'
										)}
									>
										{selected.includes(opt.value) && <Check className="w-3 h-3 text-white" />}
									</span>
									<span className="text-neutral-700">{opt.label}</span>
								</button>
							))}
						</div>
						<div className="flex gap-2 p-2 border-t">
							<button
								type="button"
								onClick={handleReset}
								className="flex-1 px-2 py-1.5 text-xs text-neutral-500 hover:text-neutral-700 rounded hover:bg-neutral-50"
							>
								초기화
							</button>
							<button
								type="button"
								onClick={handleApply}
								className="flex-1 px-2 py-1.5 text-xs bg-neutral-900 text-white rounded hover:bg-neutral-800"
							>
								적용
							</button>
						</div>
					</div>,
					document.body
				)}
		</>
	);
}

export function DefaultTable<T extends Record<string, any>>({
	data,
	columns,
	isLoading = false,
	emptyMessage = '데이터가 없습니다.',
	className,
	onRowClick,
	pagination,
}: DefaultTableProps<T>) {
	const isEmpty = !data || data.length === 0;
	const showPagination = pagination && pagination.totalPages > 1;

	return (
		<div className="space-y-4">
			<div className={cn('overflow-hidden rounded-lg border bg-white', className)}>
				<table className="w-full table-fixed">
					<thead>
						<tr className="border-b">
							{columns.map((col) => (
								<th
									key={String(col.key)}
									className="h-11 px-3 text-left align-middle text-sm font-medium text-neutral-500"
									style={{ width: col.width ? `${col.width}px` : undefined }}
								>
									{col.filterOptions ? (
										<ColumnFilter
											header={col.header}
											options={col.filterOptions}
											value={col.filterValue}
											onChange={col.onFilterChange}
										/>
									) : (
										col.header
									)}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="[&_tr:last-child]:border-0">
						{isLoading ? (
							<tr>
								<td colSpan={columns.length} className="h-24 text-center text-sm text-neutral-500">
									로딩 중...
								</td>
							</tr>
						) : isEmpty ? (
							<tr>
								<td colSpan={columns.length} className="h-24 text-center text-sm text-neutral-500">
									{emptyMessage}
								</td>
							</tr>
						) : (
							data.map((row, i) => (
								<tr
									key={i}
									className={cn('border-b transition-colors hover:bg-neutral-50/50', onRowClick && 'cursor-pointer')}
									onClick={() => onRowClick?.(row)}
								>
									{columns.map((col) => (
										<td key={String(col.key)} className="px-3 py-2 align-middle text-sm">
											{col.renderCell(row, i)}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{showPagination && (
				<div className="flex justify-center">
					<DefaultPagination
						currentPage={pagination.currentPage}
						totalPages={pagination.totalPages}
						onPageChange={pagination.onPageChange}
					/>
				</div>
			)}
		</div>
	);
}

/** @deprecated Use DefaultTable instead */
export const BaseTable = DefaultTable;
