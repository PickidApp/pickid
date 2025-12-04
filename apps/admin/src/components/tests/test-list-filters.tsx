import { TEST_STATUSES, TEST_TYPES } from '@/constants/test';
import type { TTestListFilters } from '@/hooks/useTestListFilters';
import { BaseSelect, Input } from '@pickid/ui';
import { Search } from 'lucide-react';

type TTestListFiltersProps = {
	filters: TTestListFilters;
	onFilterChange: (filters: Partial<TTestListFilters>) => void;
	onSearch: (search?: string) => void;
};

export function TestListFilters(props: TTestListFiltersProps) {
	const { filters, onFilterChange, onSearch } = props;

	const typeOptions = [
		{ value: 'all', label: '전체' },
		...TEST_TYPES.map((type) => ({
			value: type.value,
			label: type.label,
		})),
	];

	const statusOptions = [
		{ value: 'all', label: '전체' },
		...TEST_STATUSES.map((status) => ({
			value: status.value,
			label: status.label,
		})),
	];

	return (
		<div className="bg-white border border-neutral-200 rounded-lg p-4 mb-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2">
						<label className="text-sm text-neutral-700">타입:</label>
						<BaseSelect
							value={filters.type || 'all'}
							onValueChange={(value) => onFilterChange({ type: value === 'all' ? undefined : (value as any) })}
							options={typeOptions}
							placeholder="전체"
							className="w-[140px] border border-neutral-300 rounded-md px-3 py-2 text-sm"
						/>
					</div>
					<div className="flex items-center space-x-2">
						<label className="text-sm text-neutral-700">상태:</label>
						<BaseSelect
							value={filters.status || 'all'}
							onValueChange={(value) => onFilterChange({ status: value === 'all' ? undefined : (value as any) })}
							options={statusOptions}
							placeholder="전체"
							className="w-[140px] border border-neutral-300 rounded-md px-3 py-2 text-sm"
						/>
					</div>
				</div>
				<div className="flex items-center space-x-2">
					<Input
						type="text"
						placeholder="테스트 검색..."
						value={filters.search || ''}
						onChange={(e) => onSearch(e.target.value)}
						className="border border-neutral-300 rounded-md px-3 py-2 text-sm w-64"
					/>
					<button className="bg-neutral-100 text-neutral-700 px-3 py-2 rounded-md hover:bg-neutral-200 transition-colors">
						<Search className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
