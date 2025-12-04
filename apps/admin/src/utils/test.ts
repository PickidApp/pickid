import type { TestType, TestStatus } from '@pickid/supabase';
import { TEST_TYPES, TEST_STATUSES } from '@/constants/test';
import type { BadgeProps } from '@pickid/ui';

export function getTestTypeLabel(type: TestType): string {
	return TEST_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function getTestStatusLabel(status: TestStatus): string {
	return TEST_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getTestStatusVariant(status: TestStatus): BadgeProps['variant'] {
	switch (status) {
		case 'published':
			return 'green';
		case 'scheduled':
			return 'blue';
		case 'archived':
			return 'gray';
		case 'draft':
		default:
			return 'outline';
	}
}
