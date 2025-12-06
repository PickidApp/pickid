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
