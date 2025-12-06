import type { Feedback as BaseFeedback, FeedbackStatus, FeedbackCategory } from '@pickid/supabase';

export interface Feedback extends BaseFeedback {
	users?: { email: string | null } | null;
	tests?: { title: string | null } | null;
}

export interface FeedbacksResponse {
	feedbacks: Feedback[];
	count: number;
}

export interface FeedbackSummary {
	total: number;
	new: number;
	in_progress: number;
	resolved: number;
	rejected: number;
}

export interface IFetchFeedbacksOptions {
	status?: FeedbackStatus;
	category?: FeedbackCategory;
	search?: string;
	page?: number;
	pageSize?: number;
}
