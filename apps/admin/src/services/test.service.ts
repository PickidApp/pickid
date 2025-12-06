import { supabase } from '@/lib/supabase/client';
import type { Test } from '@pickid/supabase';
import type { IFetchTestsOptions, TestPayload } from '@/types/test';

export const testService = {
	async fetchTests(options?: IFetchTestsOptions) {
		const page = options?.page ?? 1;
		const pageSize = options?.pageSize ?? 20;
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = supabase
			.from('tests')
			.select('id, title, slug, type, status, thumbnail_url, published_at, created_at', {
				count: 'exact',
			});

		if (options?.type) {
			query = query.eq('type', options.type);
		}

		if (options?.status) {
			query = query.eq('status', options.status);
		}

		if (options?.search) {
			query = query.or(`title.ilike.%${options.search}%,slug.ilike.%${options.search}%`);
		}

		const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to);

		if (error) throw error;

		return {
			tests: (data ?? []) as Test[],
			count: count ?? 0,
		};
	},

	async fetchTest(testId: string) {
		const { data, error } = await supabase
			.from('tests')
			.select(
				'id, title, description, slug, type, status, thumbnail_url, intro_text, estimated_time_minutes, requires_gender, published_at, scheduled_at, settings, created_at, updated_at'
			)
			.eq('id', testId)
			.single();

		if (error) throw error;
		return data;
	},

	async upsertTest(payload: TestPayload) {
		const { data, error } = await supabase.rpc('upsert_test_metadata', {
			p_test: payload,
		});

		if (error) throw error;
		return data;
	},

	async syncQuestions(testId: string, questions: any[]) {
		const { data, error } = await supabase.rpc('sync_test_questions', {
			p_test_id: testId,
			p_questions: questions,
		});

		if (error) throw error;
		return data;
	},

	async syncResults(testId: string, results: any[]) {
		const { data, error } = await supabase.rpc('sync_test_results', {
			p_test_id: testId,
			p_results: results,
		});

		if (error) throw error;
		return data;
	},

	async publishTest(testId: string, scheduledAt?: string) {
		const { data, error } = await supabase.rpc('publish_test', {
			p_test_id: testId,
			p_scheduled_at: scheduledAt,
		});

		if (error) throw error;
		return data as Test;
	},

	async fetchTestWithDetails(testId: string) {
		const { data, error } = await supabase.rpc('get_test_with_details', {
			p_test_id: testId,
		});

		if (error) throw error;
		return data;
	},

	async duplicateTest(testId: string, newTitle?: string, newSlug?: string) {
		const { data, error } = await supabase.rpc('duplicate_test', {
			p_test_id: testId,
			p_new_title: newTitle,
			p_new_slug: newSlug,
		});

		if (error) throw error;
		return data as Test;
	},

	async fetchTestQuestions(testId: string) {
		const { data, error } = await supabase
			.from('test_questions')
			.select(
				`
				id,
				order,
				text,
				question_type,
				image_url,
				settings,
				test_choices (
					id,
					order,
					text,
					image_url,
					score,
					is_correct,
					code
				)
			`
			)
			.eq('test_id', testId)
			.order('order', { ascending: true });

		if (error) throw error;

		return (
			data?.map((q: any) => ({
				...q,
				choices: q.test_choices || [],
				test_choices: undefined,
			})) || []
		);
	},

	async fetchTestResults(testId: string) {
		const { data, error } = await supabase
			.from('test_results')
			.select(
				'id, order, name, slug, description, thumbnail_url, background_image_url, theme_color, condition_type, match_condition, metadata'
			)
			.eq('test_id', testId)
			.order('order', { ascending: true });

		if (error) throw error;
		return data || [];
	},

	async fetchTestCategoryIds(testId: string) {
		const { data, error } = await supabase.from('test_category_map').select('category_id').eq('test_id', testId);

		if (error) throw error;
		return data?.map((item) => item.category_id) || [];
	},

	async syncTestCategories(testId: string, categoryIds: string[]) {
		const { error: deleteError } = await supabase.from('test_category_map').delete().eq('test_id', testId);

		if (deleteError) throw deleteError;

		if (categoryIds.length > 0) {
			const mappings = categoryIds.map((categoryId) => ({
				test_id: testId,
				category_id: categoryId,
			}));

			const { error: insertError } = await supabase.from('test_category_map').insert(mappings);

			if (insertError) throw insertError;
		}
	},

	async fetchTestRecentResponses(testId: string, limit: number = 5) {
		const { data, error } = await supabase
			.from('test_sessions')
			.select(
				`
				id,
				status,
				started_at,
				completed_at,
				completion_time_seconds,
				result:test_results(name)
			`
			)
			.eq('test_id', testId)
			.order('started_at', { ascending: false })
			.limit(limit);

		if (error) throw error;

		return (data ?? []).map((row: any) => ({
			id: row.id,
			status: row.status,
			started_at: row.started_at,
			completed_at: row.completed_at,
			completion_time_seconds: row.completion_time_seconds,
			result_name: row.result?.name ?? null,
		}));
	},
};
