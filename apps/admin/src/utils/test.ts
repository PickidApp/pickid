import type { TestType, TestStatus } from '@pickid/supabase';
import { TEST_TYPES, TEST_STATUSES } from '@/constants/test';

export function getTestTypeLabel(type: TestType): string {
	return TEST_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function getTestStatusLabel(status: TestStatus): string {
	return TEST_STATUSES.find((s) => s.value === status)?.label ?? status;
}

// TODO: 색상 관리 필요
export function getTestStatusColor(status: TestStatus): string {
	return TEST_STATUSES.find((s) => s.value === status)?.color ?? 'gray';
}

export function getTestStatusVariant(
	status: TestStatus
): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' {
	const color = getTestStatusColor(status);

	if (color === 'red') {
		return 'destructive';
	} else if (color === 'green') {
		return 'success';
	} else if (color === 'blue') {
		return 'info';
	} else if (color === 'yellow') {
		return 'warning';
	} else {
		return 'outline';
	}
}
