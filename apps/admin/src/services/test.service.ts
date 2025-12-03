import { supabase } from '@/lib/supabase/client';
import type {
	Test,
	TestInsert,
	TestType,
	TestStatus,
	TestQuestion,
	TestChoice,
	TestResult,
} from '@pickid/supabase';

// ========================================
// Service-specific types
// ========================================

/**
 * Test 생성/수정용 폼 데이터
 */
export type TestPayload = Omit<TestInsert, 'id' | 'created_at' | 'updated_at'> & {
	id?: string;
};

/**
 * Test 목록 조회 API 응답
 */
export interface TestsResponse {
	tests: Test[];
	count: number;
}

/**
 * Test Question with Choices (관계 데이터 포함)
 */
export type TestQuestionWithChoices = Omit<TestQuestion, 'test_id' | 'created_at' | 'updated_at'> & {
	choices: TestChoiceData[];
	is_required?: boolean;
};

/**
 * Test Question Input (폼 입력용 - 선택적 필드들)
 */
export type TestQuestionInput = Partial<Omit<TestQuestion, 'test_id' | 'created_at' | 'updated_at'>> & {
	order: number;
	text: string;
	question_type: TestQuestion['question_type'];
	choices: TestChoiceInput[];
	is_required?: boolean;
};

/**
 * Test Choice (관계 필드 제거)
 */
export type TestChoiceData = Omit<TestChoice, 'question_id' | 'created_at'>;

/**
 * Test Choice Input (폼 입력용 - 선택적 필드들)
 */
export type TestChoiceInput = Partial<Omit<TestChoice, 'question_id' | 'created_at'>> & {
	order: number;
	text: string;
};

/**
 * Test Result (관계 필드 제거)
 */
export type TestResultData = Omit<TestResult, 'test_id' | 'created_at' | 'updated_at'>;

/**
 * Test Result Input (폼 입력용 - 선택적 필드들)
 */
export type TestResultInput = Partial<Omit<TestResult, 'test_id' | 'created_at' | 'updated_at'>> & {
	order: number;
	name: string;
	condition_type: TestResult['condition_type'];
	match_condition: Record<string, any>;
};

/**
 * 질문 동기화 API 요청 페이로드
 */
export interface SyncQuestionsPayload {
	test_id: string;
	questions: TestQuestionWithChoices[];
}

/**
 * 결과 동기화 API 요청 페이로드
 */
export interface SyncResultsPayload {
	test_id: string;
	results: TestResultData[];
}

export interface IFetchTestsOptions {
	type?: TestType;
	status?: TestStatus;
	search?: string;
	page?: number;
	pageSize?: number;
}

export const testService = {
	async fetchTests(options?: IFetchTestsOptions): Promise<TestsResponse> {
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
			tests: (data as Test[]) ?? [],
			count: count ?? 0,
		};
	},

	async fetchTest(testId: string): Promise<Test> {
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

	async upsertTest(payload: TestPayload): Promise<Test> {
		const { data, error } = await supabase.rpc('upsert_test_metadata', {
			p_test: payload,
		});

		if (error) throw error;
		return data as any;
	},

	async syncQuestions(payload: SyncQuestionsPayload): Promise<{ test_id: string; questions_count: number }> {
		const { data, error } = await supabase.rpc('sync_test_questions', {
			p_test_id: payload.test_id,
			p_questions: payload.questions,
		});

		if (error) throw error;
		return data as any;
	},

	async syncResults(payload: SyncResultsPayload): Promise<{ test_id: string; results_count: number }> {
		const { data, error } = await supabase.rpc('sync_test_results', {
			p_test_id: payload.test_id,
			p_results: payload.results,
		});

		if (error) throw error;
		return data as any;
	},

	async archiveTest(testId: string): Promise<Test> {
		const { data, error } = await supabase.rpc('archive_test', {
			p_test_id: testId,
		});

		if (error) throw error;
		return data as Test;
	},

	async publishTest(testId: string, scheduledAt?: string): Promise<Test> {
		const { data, error } = await supabase.rpc('publish_test', {
			p_test_id: testId,
			p_scheduled_at: (scheduledAt ?? null) as any,
		});

		if (error) throw error;
		return data as Test;
	},

	/**
	 * 테스트 전체 정보 조회 (질문/선택지/결과 포함)
	 * RPC: get_test_with_details 사용
	 */
	async fetchTestWithDetails(testId: string): Promise<any> {
		const { data, error } = await supabase.rpc('get_test_with_details', {
			p_test_id: testId,
		});

		if (error) throw error;
		return data;
	},

	async duplicateTest(testId: string, newTitle?: string, newSlug?: string): Promise<Test> {
		const { data, error } = await supabase.rpc('duplicate_test', {
			p_test_id: testId,
			p_new_title: (newTitle ?? null) as any,
			p_new_slug: (newSlug ?? null) as any,
		});

		if (error) throw error;
		return data as Test;
	},

	async fetchTestQuestions(testId: string): Promise<any[]> {
		const { data, error } = await supabase
			.from('test_questions')
			.select(
				`
				id,
				order,
				text,
				question_type,
				image_url,
				is_required,
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

	async fetchTestResults(testId: string): Promise<any[]> {
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
};
