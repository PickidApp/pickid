import type {
	TestInsert,
	TestType,
	TestStatus,
	RecommendedSlotType,
	ProductionPriority,
	TestChoice,
	TestSessionStatus,
} from '@pickid/supabase';

export interface IFetchTestsOptions {
	type?: TestType;
	status?: TestStatus;
	search?: string;
	page?: number;
	pageSize?: number;
}

export type TestPayload = Omit<TestInsert, 'id' | 'created_at' | 'updated_at'> & {
	id?: string;
	category_ids?: string[];
	series_id?: string | null;
	series_order?: number | null;
	theme_id?: string | null;
	recommended_slot?: RecommendedSlotType | null;
	production_priority?: ProductionPriority | null;
	target_release_date?: string | null;
	operation_memo?: string | null;
};

// test tab types
export type TestTabType = 'basic' | 'questions' | 'results' | 'responses';

// Question with choices for display
export interface QuestionWithChoices {
	id: string;
	order: number;
	text: string;
	question_type: string | null;
	image_url: string | null;
	settings: Record<string, unknown> | null;
	choices: TestChoice[];
}

// Result for display
export interface TestResultDisplay {
	id: string;
	order: number;
	name: string;
	slug: string;
	description: string | null;
	thumbnail_url: string | null;
	background_image_url: string | null;
	theme_color: string | null;
	condition_type: string;
	match_condition: Record<string, unknown> | null;
	metadata: Record<string, unknown> | null;
}

// Test with details from RPC
export interface TestWithDetails {
	id: string;
	title: string;
	description: string | null;
	slug: string;
	type: TestType;
	status: TestStatus;
	thumbnail_url: string | null;
	intro_text: string | null;
	estimated_time_minutes: number | null;
	series_id: string | null;
	theme_id: string | null;
	created_at: string;
	updated_at: string;
	questions: QuestionWithChoices[];
	results: TestResultDisplay[];
}

// Recent response for test detail modal
export interface TestRecentResponse {
	id: string;
	status: TestSessionStatus;
	started_at: string;
	completed_at: string | null;
	completion_time_seconds: number | null;
	result_name: string | null;
}
