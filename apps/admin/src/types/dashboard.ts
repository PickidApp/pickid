import type { FeedbackCategory, FeedbackStatus } from '@pickid/supabase';

export interface DailyGrowthPoint {
	date: string;
	web_sessions: number;
	new_users: number;
	test_sessions: number;
	completed_sessions: number;
}

export interface FeedbackListItem {
	id: string;
	category: FeedbackCategory;
	status: FeedbackStatus;
	content: string;
	created_at: string;
	tests: { id: string; title: string } | null;
	users: { id: string; email: string } | null;
}
