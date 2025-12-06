import type { FeedbackStatus, FeedbackCategory } from '@pickid/supabase';
import type { BadgeProps } from '@pickid/ui';
import { FEEDBACK_STATUSES, FEEDBACK_CATEGORIES } from '@/constants/feedback';

export function getFeedbackStatusLabel(status: FeedbackStatus): string {
	return FEEDBACK_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getFeedbackCategoryLabel(category: FeedbackCategory): string {
	return FEEDBACK_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

export function getFeedbackStatusColor(status: FeedbackStatus): string {
	return FEEDBACK_STATUSES.find((s) => s.value === status)?.color ?? '';
}

export function getFeedbackStatusVariant(status: FeedbackStatus): BadgeProps['variant'] {
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

export function getFeedbackCategoryVariant(category: FeedbackCategory): BadgeProps['variant'] {
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
