export interface DateRangeParams {
	from: string;
	to: string;
}

export interface GrowthSummary {
	totalVisits: number;
	totalVisitsChange: number;
	totalResponses: number;
	totalResponsesChange: number;
	completionRate: number;
	completionRateChange: number;
	avgResponseDuration: number;
	avgResponseDurationChange: number;
}

export interface DailyGrowth {
	date: string;
	visits: number;
	responses: number;
	completions: number;
}

export interface FunnelStep {
	step: string;
	label: string;
	count: number;
	rate: number;
	dropoff: number;
}

export interface ChannelData {
	channel: string;
	label: string;
	responses: number;
	completions: number;
	conversionRate: number;
}

export interface LandingPageData {
	path: string;
	visits: number;
	responses: number;
	completions: number;
	conversionRate: number;
}

export interface CohortData {
	cohort: string;
	users: number;
	weeks: number[];
}

// analytics constants types
export type DateRangeOption = '7d' | '14d' | '30d' | '90d';
export type AnalyticsTab = 'list' | 'comparison' | 'category' | 'series' | 'theme';
export type AnalyticsSortOption = 'responses' | 'completionRate' | 'avgTime' | 'lastResponse' | 'createdAt';
export type TestDetailTab = 'overview' | 'trend' | 'questions' | 'results';
export type RateColor = 'green' | 'yellow' | 'red';

// growth constants types
export type GrowthTab = 'overview' | 'funnel' | 'channel' | 'landing' | 'cohort' | 'viral';

// analysis guide types
export interface AnalysisGuide {
	title: string;
	purpose: string;
	keyQuestions: readonly string[];
	actionTip: string;
}
