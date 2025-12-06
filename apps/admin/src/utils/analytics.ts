import { COMPLETION_RATE_THRESHOLDS, DROPOFF_RATE_THRESHOLDS } from '@/constants/analytics';
import type { RateColor } from '@/types/analytics';

export function getCompletionRateColor(rate: number): RateColor {
	if (rate >= COMPLETION_RATE_THRESHOLDS.high) return 'green';
	if (rate >= COMPLETION_RATE_THRESHOLDS.medium) return 'yellow';
	return 'red';
}

export function getDropoffRateColor(rate: number): RateColor {
	if (rate >= DROPOFF_RATE_THRESHOLDS.high) return 'red';
	if (rate >= DROPOFF_RATE_THRESHOLDS.medium) return 'yellow';
	return 'green';
}

export function getRetentionHeatmapStyle(value: number): string {
	if (value >= 50) return 'bg-green-600 text-white';
	if (value >= 30) return 'bg-green-500 text-white';
	if (value >= 20) return 'bg-green-400 text-white';
	if (value >= 10) return 'bg-green-200 text-neutral-700';
	if (value > 0) return 'bg-green-100 text-neutral-600';
	return 'bg-neutral-50 text-neutral-400';
}
