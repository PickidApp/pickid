export function getActiveFilterDays(dateRange: string): number {
	const days = parseInt(dateRange);
	if (days <= 7) return 7;
	if (days <= 30) return 30;
	if (days <= 90) return 90;
	return 365;
}
