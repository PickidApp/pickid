import type { CategoryStatus } from '@/services/category.service';

export const CATEGORY_STATUSES: { value: CategoryStatus; label: string }[] = [
	{ value: 'active', label: '활성' },
	{ value: 'inactive', label: '비활성' },
];
