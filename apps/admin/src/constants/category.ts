import type { CategoryStatus } from '@/services/category.service';

export const CATEGORY_STATUSES: { value: CategoryStatus; label: string; color: string }[] = [
	{ value: 'active', label: '활성', color: 'green' },
	{ value: 'inactive', label: '비활성', color: 'gray' },
];
