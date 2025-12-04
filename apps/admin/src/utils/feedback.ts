import { FEEDBACK_STATUSES, FEEDBACK_CATEGORIES } from '@/constants/feedback';
import type { BadgeProps } from '@pickid/ui';

export function getFeedbackStatusLabel(status: string): string {
	return FEEDBACK_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getFeedbackCategoryLabel(category: string): string {
	return FEEDBACK_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

export function getFeedbackStatusVariant(status: string): BadgeProps['variant'] {
	switch (status) {
		case 'new':
			return 'red';
		case 'in_progress':
			return 'amber';
		case 'resolved':
			return 'green';
		case 'rejected':
			return 'gray';
		default:
			return 'outline';
	}
}

export function getFeedbackCategoryVariant(category: string): BadgeProps['variant'] {
	switch (category) {
		case 'bug':
			return 'red';
		case 'feature':
			return 'blue';
		case 'ui':
			return 'amber';
		case 'etc':
		default:
			return 'gray';
	}
}
