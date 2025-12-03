import { useState } from 'react';
import dayjs from 'dayjs';

export interface DateRange {
	from: Date;
	to: Date;
}

export function useDashboardFilters() {
	const [dateRange, setDateRange] = useState<DateRange>({
		from: dayjs().subtract(7, 'day').toDate(),
		to: new Date(),
	});

	const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

	return {
		dateRange,
		setDateRange,
		selectedTestId,
		setSelectedTestId,
	};
}
