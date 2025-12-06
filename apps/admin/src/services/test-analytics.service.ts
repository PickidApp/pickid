import { supabase } from '@/lib/supabase/client';
import type { TestType, TestStatus } from '@pickid/supabase';
import type { DateRangeParams } from '@/types/analytics';
import type {
	TestPerformanceSummary,
	TestPerformanceItem,
	TestDetailMetrics,
	DeviceDistribution,
	ResultDistributionItem,
	DailyTestMetric,
	QuestionMetric,
	IFetchTestPerformanceOptions,
} from '@/types/test-analytics';
import dayjs from 'dayjs';

// ========================================
// Helper Functions
// ========================================

function toDateString(isoString: string): string {
	return dayjs(isoString).format('YYYY-MM-DD');
}

// ========================================
// Service
// ========================================

export const testAnalyticsService = {
	/**
	 * 테스트 목록 성과 요약 통계
	 */
	async fetchTestPerformanceSummary(params: DateRangeParams): Promise<TestPerformanceSummary> {
		const fromDate = toDateString(params.from);
		const toDate = toDateString(params.to);

		// 테스트 상태별 개수
		const { data: tests, error: testsError } = await supabase.from('tests').select('id, status');

		if (testsError) throw testsError;

		const statusCounts = {
			published: 0,
			draft: 0,
			scheduled: 0,
			archived: 0,
		};

		(tests || []).forEach((test) => {
			const status = test.status as TestStatus;
			if (status in statusCounts) {
				statusCounts[status]++;
			}
		});

		// 기간 내 전체 응답 통계
		const { data: sessions, error: sessionsError } = await supabase
			.from('test_sessions')
			.select('id, status')
			.gte('started_at', `${fromDate}T00:00:00`)
			.lte('started_at', `${toDate}T23:59:59`);

		if (sessionsError) throw sessionsError;

		const totalResponses = sessions?.length || 0;
		const completedResponses = sessions?.filter((s) => s.status === 'completed').length || 0;
		const avgCompletionRate = totalResponses > 0 ? Math.round((completedResponses / totalResponses) * 100) : 0;

		return {
			totalTests: tests?.length || 0,
			publishedCount: statusCounts.published,
			draftCount: statusCounts.draft,
			scheduledCount: statusCounts.scheduled,
			archivedCount: statusCounts.archived,
			totalResponses,
			avgCompletionRate,
		};
	},

	/**
	 * 테스트 목록 성과 데이터 (페이지네이션 지원)
	 */
	async fetchTestPerformanceList(
		params: DateRangeParams,
		options?: IFetchTestPerformanceOptions
	): Promise<{ tests: TestPerformanceItem[]; count: number }> {
		const fromDate = toDateString(params.from);
		const toDate = toDateString(params.to);
		const page = options?.page ?? 1;
		const pageSize = options?.pageSize ?? 20;

		// 카테고리 필터가 있는 경우, 해당 카테고리에 속한 테스트 ID 먼저 조회
		let filteredTestIds: string[] | null = null;
		if (options?.categoryId) {
			const { data: categoryMaps, error: categoryError } = await supabase
				.from('test_category_map')
				.select('test_id')
				.eq('category_id', options.categoryId);

			if (categoryError) throw categoryError;
			filteredTestIds = (categoryMaps || []).map((m) => m.test_id);

			if (filteredTestIds.length === 0) {
				return { tests: [], count: 0 };
			}
		}

		// 1. 테스트 목록 조회
		let testsQuery = supabase.from('tests').select('id, title, description, type, status, thumbnail_url, created_at', {
			count: 'exact',
		});

		if (filteredTestIds) {
			testsQuery = testsQuery.in('id', filteredTestIds);
		}
		if (options?.type) {
			testsQuery = testsQuery.eq('type', options.type);
		}
		if (options?.status) {
			testsQuery = testsQuery.eq('status', options.status);
		}
		if (options?.search) {
			testsQuery = testsQuery.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
		}

		const { data: tests, error: testsError, count } = await testsQuery.order('created_at', { ascending: false });

		if (testsError) throw testsError;

		if (!tests || tests.length === 0) {
			return { tests: [], count: 0 };
		}

		// 2. 기간 내 세션 데이터 조회
		const testIds = tests.map((t) => t.id);
		const { data: sessions, error: sessionsError } = await supabase
			.from('test_sessions')
			.select('id, test_id, status, completion_time_seconds, completed_at, started_at')
			.in('test_id', testIds)
			.gte('started_at', `${fromDate}T00:00:00`)
			.lte('started_at', `${toDate}T23:59:59`);

		if (sessionsError) throw sessionsError;

		// 2.5 테스트별 카테고리 정보 조회
		const { data: categoryMaps, error: categoryMapsError } = await supabase
			.from('test_category_map')
			.select('test_id, category:test_categories(id, name)')
			.in('test_id', testIds);

		if (categoryMapsError) throw categoryMapsError;

		// 테스트별 카테고리 매핑
		const categoriesByTest = new Map<string, { id: string; name: string }[]>();
		(categoryMaps || []).forEach((map) => {
			const testId = map.test_id;
			if (!categoriesByTest.has(testId)) {
				categoriesByTest.set(testId, []);
			}
			if (map.category) {
				const category = map.category as unknown as { id: string; name: string };
				categoriesByTest.get(testId)!.push({ id: category.id, name: category.name });
			}
		});

		// 3. 테스트별 통계 집계
		const sessionsByTest = new Map<
			string,
			{
				total: number;
				completed: number;
				totalTime: number;
				timeCount: number;
				lastResponse: string | null;
			}
		>();

		(sessions || []).forEach((session) => {
			const testId = session.test_id;
			if (!sessionsByTest.has(testId)) {
				sessionsByTest.set(testId, {
					total: 0,
					completed: 0,
					totalTime: 0,
					timeCount: 0,
					lastResponse: null,
				});
			}

			const stats = sessionsByTest.get(testId)!;
			stats.total++;

			if (session.status === 'completed') {
				stats.completed++;
				if (session.completion_time_seconds) {
					stats.totalTime += session.completion_time_seconds;
					stats.timeCount++;
				}
			}

			const responseDate = session.completed_at || session.started_at;
			if (!stats.lastResponse || responseDate > stats.lastResponse) {
				stats.lastResponse = responseDate;
			}
		});

		// 4. 결과 매핑
		let result: TestPerformanceItem[] = tests.map((test) => {
			const stats = sessionsByTest.get(test.id) || {
				total: 0,
				completed: 0,
				totalTime: 0,
				timeCount: 0,
				lastResponse: null,
			};

			return {
				id: test.id,
				title: test.title,
				description: test.description,
				type: test.type as TestType,
				status: test.status as TestStatus,
				thumbnailUrl: test.thumbnail_url,
				createdAt: test.created_at,
				totalResponses: stats.total,
				completedResponses: stats.completed,
				completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
				avgCompletionTime: stats.timeCount > 0 ? Math.round(stats.totalTime / stats.timeCount) : null,
				lastResponseAt: stats.lastResponse,
				categories: categoriesByTest.get(test.id) || [],
			};
		});

		// 5. 정렬
		const sortBy = options?.sortBy || 'createdAt';
		const sortOrder = options?.sortOrder || 'desc';

		result.sort((a, b) => {
			let comparison = 0;
			switch (sortBy) {
				case 'responses':
					comparison = a.totalResponses - b.totalResponses;
					break;
				case 'completionRate':
					comparison = a.completionRate - b.completionRate;
					break;
				case 'lastResponse':
					comparison = (a.lastResponseAt || '').localeCompare(b.lastResponseAt || '');
					break;
				case 'createdAt':
				default:
					comparison = a.createdAt.localeCompare(b.createdAt);
					break;
			}
			return sortOrder === 'asc' ? comparison : -comparison;
		});

		// 6. 페이지네이션
		const startIndex = (page - 1) * pageSize;
		const paginatedResult = result.slice(startIndex, startIndex + pageSize);

		return { tests: paginatedResult, count: count || 0 };
	},

	/**
	 * 테스트 상세 - 핵심 지표
	 */
	async fetchTestDetailMetrics(testId: string, params: DateRangeParams): Promise<TestDetailMetrics> {
		const fromDate = toDateString(params.from);
		const toDate = toDateString(params.to);

		const { data: sessions, error } = await supabase
			.from('test_sessions')
			.select('id, status, completion_time_seconds, total_score')
			.eq('test_id', testId)
			.gte('started_at', `${fromDate}T00:00:00`)
			.lte('started_at', `${toDate}T23:59:59`);

		if (error) throw error;

		const total = sessions?.length || 0;
		const completed = sessions?.filter((s) => s.status === 'completed') || [];
		const completedCount = completed.length;

		let totalTime = 0;
		let timeCount = 0;
		let totalScore = 0;
		let scoreCount = 0;

		completed.forEach((s) => {
			if (s.completion_time_seconds) {
				totalTime += s.completion_time_seconds;
				timeCount++;
			}
			if (s.total_score !== null) {
				totalScore += s.total_score;
				scoreCount++;
			}
		});

		return {
			totalResponses: total,
			completedResponses: completedCount,
			completionRate: total > 0 ? Math.round((completedCount / total) * 100) : 0,
			avgCompletionTime: timeCount > 0 ? Math.round(totalTime / timeCount) : null,
			avgScore: scoreCount > 0 ? Math.round((totalScore / scoreCount) * 10) / 10 : null,
		};
	},

	/**
	 * 테스트 상세 - 디바이스 분포
	 */
	async fetchDeviceDistribution(testId: string, params: DateRangeParams): Promise<DeviceDistribution> {
		const fromDate = toDateString(params.from);
		const toDate = toDateString(params.to);

		const { data: sessions, error } = await supabase
			.from('test_sessions')
			.select('device_type')
			.eq('test_id', testId)
			.gte('started_at', `${fromDate}T00:00:00`)
			.lte('started_at', `${toDate}T23:59:59`);

		if (error) throw error;

		const total = sessions?.length || 0;
		let mobile = 0;
		let desktop = 0;
		let tablet = 0;

		(sessions || []).forEach((s) => {
			switch (s.device_type) {
				case 'mobile':
					mobile++;
					break;
				case 'desktop':
					desktop++;
					break;
				case 'tablet':
					tablet++;
					break;
			}
		});

		return {
			mobile,
			desktop,
			tablet,
			mobileRate: total > 0 ? Math.round((mobile / total) * 100) : 0,
			desktopRate: total > 0 ? Math.round((desktop / total) * 100) : 0,
			tabletRate: total > 0 ? Math.round((tablet / total) * 100) : 0,
		};
	},

	/**
	 * 테스트 상세 - 결과 분포
	 */
	async fetchResultDistribution(testId: string, params: DateRangeParams): Promise<ResultDistributionItem[]> {
		const fromDate = toDateString(params.from);
		const toDate = toDateString(params.to);

		// 결과 정보 조회
		const { data: results, error: resultsError } = await supabase
			.from('test_results')
			.select('id, name')
			.eq('test_id', testId);

		if (resultsError) throw resultsError;

		// 세션 데이터 조회
		const { data: sessions, error: sessionsError } = await supabase
			.from('test_sessions')
			.select('result_id, total_score')
			.eq('test_id', testId)
			.eq('status', 'completed')
			.gte('started_at', `${fromDate}T00:00:00`)
			.lte('started_at', `${toDate}T23:59:59`);

		if (sessionsError) throw sessionsError;

		const total = sessions?.length || 0;
		const resultMap = new Map<string, { count: number; totalScore: number; scoreCount: number }>();

		// 결과 맵 초기화
		(results || []).forEach((r) => {
			resultMap.set(r.id, { count: 0, totalScore: 0, scoreCount: 0 });
		});

		// 세션별 결과 집계
		(sessions || []).forEach((s) => {
			if (s.result_id && resultMap.has(s.result_id)) {
				const stats = resultMap.get(s.result_id)!;
				stats.count++;
				if (s.total_score !== null) {
					stats.totalScore += s.total_score;
					stats.scoreCount++;
				}
			}
		});

		// 결과 배열 생성
		return (results || [])
			.map((r) => {
				const stats = resultMap.get(r.id) || { count: 0, totalScore: 0, scoreCount: 0 };
				return {
					resultId: r.id,
					resultName: r.name,
					count: stats.count,
					percentage: total > 0 ? Math.round((stats.count / total) * 100) : 0,
					avgScore: stats.scoreCount > 0 ? Math.round((stats.totalScore / stats.scoreCount) * 10) / 10 : null,
				};
			})
			.sort((a, b) => b.count - a.count);
	},

	/**
	 * 테스트 상세 - 일별 트렌드
	 */
	async fetchDailyTrend(testId: string, params: DateRangeParams): Promise<DailyTestMetric[]> {
		const fromDate = toDateString(params.from);
		const toDate = toDateString(params.to);

		const { data: sessions, error } = await supabase
			.from('test_sessions')
			.select('started_at, status')
			.eq('test_id', testId)
			.gte('started_at', `${fromDate}T00:00:00`)
			.lte('started_at', `${toDate}T23:59:59`);

		if (error) throw error;

		// 날짜별 집계
		const dailyMap = new Map<string, { responses: number; completions: number }>();

		// 기간 내 모든 날짜 초기화
		let current = dayjs(fromDate);
		const end = dayjs(toDate);
		while (current.isBefore(end) || current.isSame(end, 'day')) {
			dailyMap.set(current.format('YYYY-MM-DD'), { responses: 0, completions: 0 });
			current = current.add(1, 'day');
		}

		// 세션 데이터 집계
		(sessions || []).forEach((s) => {
			const date = dayjs(s.started_at).format('YYYY-MM-DD');
			if (dailyMap.has(date)) {
				const stats = dailyMap.get(date)!;
				stats.responses++;
				if (s.status === 'completed') {
					stats.completions++;
				}
			}
		});

		// 배열로 변환
		return Array.from(dailyMap.entries())
			.map(([date, stats]) => ({
				date,
				responses: stats.responses,
				completions: stats.completions,
				completionRate: stats.responses > 0 ? Math.round((stats.completions / stats.responses) * 100) : 0,
			}))
			.sort((a, b) => a.date.localeCompare(b.date));
	},

	/**
	 * 테스트 상세 - 질문별 성과
	 */
	async fetchQuestionMetrics(testId: string, params: DateRangeParams): Promise<QuestionMetric[]> {
		const fromDate = toDateString(params.from);
		const toDate = toDateString(params.to);

		// 질문 목록 조회
		const { data: questions, error: questionsError } = await supabase
			.from('test_questions')
			.select('id, text, order')
			.eq('test_id', testId)
			.order('order', { ascending: true });

		if (questionsError) throw questionsError;

		if (!questions || questions.length === 0) {
			return [];
		}

		// 기간 내 완료된 세션 ID 조회
		const { data: completedSessions, error: sessionsError } = await supabase
			.from('test_sessions')
			.select('id')
			.eq('test_id', testId)
			.eq('status', 'completed')
			.gte('started_at', `${fromDate}T00:00:00`)
			.lte('started_at', `${toDate}T23:59:59`);

		if (sessionsError) throw sessionsError;

		const completedSessionIds = new Set((completedSessions || []).map((s) => s.id));

		// 기간 내 모든 세션의 답변 조회
		const { data: allSessions, error: allSessionsError } = await supabase
			.from('test_sessions')
			.select('id')
			.eq('test_id', testId)
			.gte('started_at', `${fromDate}T00:00:00`)
			.lte('started_at', `${toDate}T23:59:59`);

		if (allSessionsError) throw allSessionsError;

		const allSessionIds = (allSessions || []).map((s) => s.id);

		if (allSessionIds.length === 0) {
			return questions.map((q) => ({
				questionId: q.id,
				questionText: q.text,
				questionOrder: q.order,
				reached: 0,
				completed: 0,
				dropoffRate: 0,
			}));
		}

		// 답변 데이터 조회
		const { data: answers, error: answersError } = await supabase
			.from('test_session_answers')
			.select('session_id, question_id')
			.in('session_id', allSessionIds);

		if (answersError) throw answersError;

		// 질문별 도달/완료 집계
		const questionStats = new Map<string, { reached: Set<string>; completed: Set<string> }>();

		questions.forEach((q) => {
			questionStats.set(q.id, { reached: new Set(), completed: new Set() });
		});

		(answers || []).forEach((a) => {
			const stats = questionStats.get(a.question_id);
			if (stats) {
				stats.reached.add(a.session_id);
				if (completedSessionIds.has(a.session_id)) {
					stats.completed.add(a.session_id);
				}
			}
		});

		return questions.map((q) => {
			const stats = questionStats.get(q.id)!;
			const reached = stats.reached.size;
			const completed = stats.completed.size;
			const dropoffRate = reached > 0 ? Math.round(((reached - completed) / reached) * 100) : 0;

			return {
				questionId: q.id,
				questionText: q.text,
				questionOrder: q.order,
				reached,
				completed,
				dropoffRate,
			};
		});
	},

	/**
	 * 테스트 기본 정보 조회
	 */
	async fetchTestInfo(testId: string) {
		const { data, error } = await supabase
			.from('tests')
			.select('id, title, description, type, status, slug, thumbnail_url, created_at')
			.eq('id', testId)
			.single();

		if (error) throw error;
		return data;
	},
};
