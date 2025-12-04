import { FEEDBACK_STATUSES, FEEDBACK_CATEGORIES } from '@/constants/feedback';

export function getFeedbackStatusLabel(status: string): string {
	return FEEDBACK_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getFeedbackCategoryLabel(category: string): string {
	return FEEDBACK_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}
