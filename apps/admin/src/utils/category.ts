import type { CategoryStatus } from '@/services/category.service';
import { CATEGORY_STATUSES } from '@/constants/category';

export function getCategoryStatusLabel(status: CategoryStatus): string {
	return CATEGORY_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getCategoryStatusColor(status: CategoryStatus): string {
	return CATEGORY_STATUSES.find((s) => s.value === status)?.color ?? 'gray';
}

export function getCategoryStatusVariant(
	status: CategoryStatus
): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' {
	const color = getCategoryStatusColor(status);

	if (color === 'green') {
		return 'success';
	} else if (color === 'red') {
		return 'destructive';
	} else {
		return 'outline';
	}
}
