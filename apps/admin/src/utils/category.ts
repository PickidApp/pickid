import type { CategoryStatus } from '@pickid/supabase';
import { CATEGORY_STATUSES } from '@/constants/category';
import type { BadgeProps } from '@pickid/ui';

export function getCategoryStatusLabel(status: CategoryStatus): string {
	return CATEGORY_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getCategoryStatusVariant(status: CategoryStatus): BadgeProps['variant'] {
	switch (status) {
		case 'active':
			return 'green';
		case 'inactive':
			return 'gray';
		default:
			return 'outline';
	}
}
