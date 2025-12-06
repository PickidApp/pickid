import type { TestType, TestStatus } from '@pickid/supabase';

export interface TestPerformanceSummary {
	totalTests: number;
	publishedCount: number;
	draftCount: number;
	scheduledCount: number;
	archivedCount: number;
	totalResponses: number;
	avgCompletionRate: number;
}

export interface TestPerformanceItem {
	id: string;
	title: string;
	description: string | null;
	type: TestType;
	status: TestStatus;
	thumbnailUrl: string | null;
	createdAt: string;
	totalResponses: number;
	completedResponses: number;
	completionRate: number;
	avgCompletionTime: number | null;
	lastResponseAt: string | null;
	categories: { id: string; name: string }[];
}

export interface TestDetailMetrics {
	totalResponses: number;
	completedResponses: number;
	completionRate: number;
	avgCompletionTime: number | null;
	avgScore: number | null;
}

export interface DeviceDistribution {
	mobile: number;
	desktop: number;
	tablet: number;
	mobileRate: number;
	desktopRate: number;
	tabletRate: number;
}

export interface ResultDistributionItem {
	resultId: string;
	resultName: string;
	count: number;
	percentage: number;
	avgScore: number | null;
}

export interface DailyTestMetric {
	date: string;
	responses: number;
	completions: number;
	completionRate: number;
}

export interface QuestionMetric {
	questionId: string;
	questionText: string;
	questionOrder: number;
	reached: number;
	completed: number;
	dropoffRate: number;
}

export interface IFetchTestPerformanceOptions {
	type?: TestType;
	status?: TestStatus;
	categoryId?: string;
	search?: string;
	sortBy?: 'responses' | 'completionRate' | 'lastResponse' | 'createdAt';
	sortOrder?: 'asc' | 'desc';
	page?: number;
	pageSize?: number;
}

// ============================================================================
// 카테고리/시리즈/테마 단위 성과 분석 타입
// ============================================================================

/**
 * 카테고리별 성과 지표
 */
export interface CategoryPerformance {
	categoryId: string;
	categoryName: string;
	categorySlug: string;
	testsCount: number;
	totalResponses: number;
	completedResponses: number;
	completionRate: number;
	avgCompletionTime: number | null;
	/** 결과 편중도 (최대 비율 결과의 비중, 0-100) */
	resultSkew: number | null;
}

/**
 * 시리즈별 성과 지표
 */
export interface SeriesPerformance {
	seriesId: string;
	seriesName: string;
	seriesSlug: string;
	testsCount: number;
	/** 시리즈 1편(입구 테스트) ID */
	entryTestId: string | null;
	/** 시리즈 1편 응답수 */
	entryResponses: number;
	/** 시리즈 1편 완료율 */
	entryCompletionRate: number;
	/** 시리즈 전체 완주율 (2개 이상 완료한 세션 비율) */
	seriesCompletionRate: number;
	/** 세션당 평균 완료 테스트 수 */
	avgTestsPerSession: number;
}

/**
 * 시리즈 내 테스트별 성과 (비교용)
 */
export interface SeriesTestPerformance {
	testId: string;
	testTitle: string;
	seriesOrder: number;
	totalResponses: number;
	completedResponses: number;
	completionRate: number;
	avgCompletionTime: number | null;
}

/**
 * 시리즈 퍼널 단계 (시리즈 완주 퍼널용)
 */
export interface SeriesFunnelStep {
	seriesOrder: number;
	testId: string;
	testTitle: string;
	reached: number;
	completed: number;
	dropoffRate: number;
}

/**
 * 테마(캠페인)별 성과 지표
 */
export interface ThemePerformance {
	themeId: string;
	themeName: string;
	themeSlug: string;
	testsCount: number;
	totalResponses: number;
	completedResponses: number;
	completionRate: number;
	startDate: string | null;
	endDate: string | null;
}

/**
 * 테마 일별 트렌드
 */
export interface ThemeDailyTrend {
	date: string;
	responses: number;
	completions: number;
	completionRate: number;
}
