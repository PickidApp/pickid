import { useState } from 'react';
import type { TestType, TestStatus } from '@pickid/supabase';

export interface TTestListFilters {
	type?: TestType;
	status?: TestStatus;
	search?: string;
}

export function useTestListFilters() {
	const [filters, setFiltersState] = useState<TTestListFilters>({});

	const setFilters = (newFilters: Partial<TTestListFilters>) => {
		setFiltersState((prev) => ({ ...prev, ...newFilters }));
	};

	const setSearch = (search?: string) => {
		setFiltersState((prev) => ({ ...prev, search }));
	};

	const resetFilters = () => {
		setFiltersState({});
	};

	return {
		filters,
		setFilters,
		setSearch,
		resetFilters,
	};
}
