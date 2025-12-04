import { supabase } from '@/lib/supabase/client';

// ========================================
// Service-specific types (기존 DB 스키마 기준)
// ========================================

export type FeedbackStatus = 'new' | 'in_progress' | 'resolved' | 'rejected';
export type FeedbackCategory = 'bug' | 'feature' | 'ui' | 'etc';

export interface Feedback {
	id: string;
	content: string;
	category: FeedbackCategory;
	status: FeedbackStatus;
	admin_note: string | null;
	test_id: string | null;
	user_id: string | null;
	created_at: string;
	updated_at: string;
	// Relations
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

export const feedbackService = {
	async fetchFeedbacks(options?: IFetchFeedbacksOptions): Promise<FeedbacksResponse> {
		const page = options?.page ?? 1;
		const pageSize = options?.pageSize ?? 20;
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = supabase
			.from('feedback')
			.select(
				'id, content, category, status, admin_note, test_id, user_id, created_at, updated_at, users(email), tests(title)',
				{ count: 'exact' }
			);

		if (options?.status) {
			query = query.eq('status', options.status);
		}

		if (options?.category) {
			query = query.eq('category', options.category);
		}

		if (options?.search) {
			query = query.ilike('content', `%${options.search}%`);
		}

		const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to);

		if (error) throw error;

		return {
			feedbacks: (data ?? []) as unknown as Feedback[],
			count: count ?? 0,
		};
	},

	async fetchFeedbackSummary(): Promise<FeedbackSummary> {
		const { data, error } = await supabase
			.from('feedback')
			.select('status');

		if (error) throw error;

		const summary: FeedbackSummary = {
			total: data.length,
			new: 0,
			in_progress: 0,
			resolved: 0,
			rejected: 0,
		};

		data.forEach((item) => {
			const status = item.status as FeedbackStatus;
			if (status in summary) {
				summary[status]++;
			}
		});

		return summary;
	},

	async fetchFeedback(feedbackId: string): Promise<Feedback> {
		const { data, error } = await supabase
			.from('feedback')
			.select(
				'id, content, category, status, admin_note, test_id, user_id, created_at, updated_at, users(email), tests(title)'
			)
			.eq('id', feedbackId)
			.single();

		if (error) throw error;
		return data as unknown as Feedback;
	},

	async updateFeedbackStatus(feedbackId: string, status: FeedbackStatus, adminNote?: string): Promise<Feedback> {
		const { data, error } = await supabase
			.from('feedback')
			.update({ status, admin_note: adminNote })
			.eq('id', feedbackId)
			.select(
				'id, content, category, status, admin_note, test_id, user_id, created_at, updated_at'
			)
			.single();

		if (error) throw error;
		return data as unknown as Feedback;
	},

	async updateFeedbacksStatus(feedbackIds: string[], status: FeedbackStatus): Promise<void> {
		const { error } = await supabase.from('feedback').update({ status }).in('id', feedbackIds);

		if (error) throw error;
	},

	async deleteFeedback(feedbackId: string): Promise<void> {
		const { error } = await supabase.from('feedback').delete().eq('id', feedbackId);

		if (error) throw error;
	},
};
