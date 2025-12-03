/**
 * Dashboard Utilities
 * 대시보드 관련 유틸리티 함수
 */

/**
 * 날짜 범위로부터 활성 필터 일수 계산
 */
export function getActiveFilterDays(dateRange: { from: Date; to: Date }): number {
	const daysDiff = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));

	if (daysDiff <= 7) return 7;
	if (daysDiff <= 30) return 30;
	if (daysDiff <= 90) return 90;
	return 365;
}
