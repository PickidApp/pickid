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
	CategoryPerformance,
	SeriesPerformance,
	SeriesTestPerformance,
	SeriesFunnelStep,
	ThemePerformance,
	ThemeDailyTrend,
} from '@/types/test-analytics';
import { toDateString } from '@/utils/format';
import dayjs from 'dayjs';

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

	// ========================================
	// 카테고리/시리즈/테마 단위 성과 분석
	// ========================================

	/**
	 * 카테고리별 성과 지표 조회
	 */
	async fetchCategoryPerformance(params: DateRangeParams): Promise<CategoryPerformance[]> {
		const fromDate = toDateString(params.from);
		const toDate = toDateString(params.to);

		// 1. 활성 카테고리 목록 조회
		const { data: categories, error: categoriesError } = await supabase
			.from('test_categories')
			.select('id, name, slug')
			.eq('status', 'active')
			.order('sort_order', { ascending: true });

		if (categoriesError) throw categoriesError;

		if (!categories || categories.length === 0) {
			return [];
		}

		// 2. 카테고리-테스트 매핑 조회
		const { data: categoryMaps, error: mapsError } = await supabase
			.from('test_category_map')
			.select('category_id, test_id');

		if (mapsError) throw mapsError;

		// 카테고리별 테스트 ID 매핑
		const testsByCategory = new Map<string, string[]>();
		categories.forEach((c) => testsByCategory.set(c.id, []));

		(categoryMaps || []).forEach((map) => {
			const testIds = testsByCategory.get(map.category_id);
			if (testIds) {
				testIds.push(map.test_id);
			}
		});

		// 3. 기간 내 세션 데이터 조회
		const allTestIds = Array.from(new Set((categoryMaps || []).map((m) => m.test_id)));

		if (allTestIds.length === 0) {
			return categories.map((c) => ({
				categoryId: c.id,
				categoryName: c.name,
				categorySlug: c.slug,
				testsCount: 0,
				totalResponses: 0,
				completedResponses: 0,
				completionRate: 0,
				avgCompletionTime: null,
				resultSkew: null,
			}));
		}

		const { data: sessions, error: sessionsError } = await supabase
			.from('test_sessions')
			.select('test_id, status, completion_time_seconds, result_id')
			.in('test_id', allTestIds)
			.gte('started_at', `${fromDate}T00:00:00`)
			.lte('started_at', `${toDate}T23:59:59`);

		if (sessionsError) throw sessionsError;

		// 테스트별 세션 통계 집계
		const sessionsByTest = new Map<
			string,
			{
				total: number;
				completed: number;
				totalTime: number;
				timeCount: number;
				resultCounts: Map<string, number>;
			}
		>();

		(sessions || []).forEach((s) => {
			if (!sessionsByTest.has(s.test_id)) {
				sessionsByTest.set(s.test_id, {
					total: 0,
					completed: 0,
					totalTime: 0,
					timeCount: 0,
					resultCounts: new Map(),
				});
			}

			const stats = sessionsByTest.get(s.test_id)!;
			stats.total++;

			if (s.status === 'completed') {
				stats.completed++;
				if (s.completion_time_seconds) {
					stats.totalTime += s.completion_time_seconds;
					stats.timeCount++;
				}
				if (s.result_id) {
					stats.resultCounts.set(s.result_id, (stats.resultCounts.get(s.result_id) || 0) + 1);
				}
			}
		});

		// 4. 카테고리별 집계
		return categories.map((category) => {
			const testIds = testsByCategory.get(category.id) || [];
			let totalResponses = 0;
			let completedResponses = 0;
			let totalTime = 0;
			let timeCount = 0;
			let maxResultPercentage = 0;

			testIds.forEach((testId) => {
				const stats = sessionsByTest.get(testId);
				if (stats) {
					totalResponses += stats.total;
					completedResponses += stats.completed;
					totalTime += stats.totalTime;
					timeCount += stats.timeCount;

					// 결과 편중도 계산 (가장 많이 나온 결과 비율)
					if (stats.completed > 0) {
						const maxCount = Math.max(...Array.from(stats.resultCounts.values()), 0);
						const percentage = (maxCount / stats.completed) * 100;
						if (percentage > maxResultPercentage) {
							maxResultPercentage = percentage;
						}
					}
				}
			});

			return {
				categoryId: category.id,
				categoryName: category.name,
				categorySlug: category.slug,
				testsCount: testIds.length,
				totalResponses,
				completedResponses,
				completionRate: totalResponses > 0 ? Math.round((completedResponses / totalResponses) * 100) : 0,
				avgCompletionTime: timeCount > 0 ? Math.round(totalTime / timeCount) : null,
				resultSkew: completedResponses > 0 ? Math.round(maxResultPercentage) : null,
			};
		});
	},

	/**
	 * 시리즈별 성과 지표 조회
	 */
	async fetchSeriesPerformance(params: DateRangeParams): Promise<SeriesPerformance[]> {
		const fromDate = toDateString(params.from);
		const toDate = toDateString(params.to);

		// 1. 시리즈 목록 조회
		const { data: seriesList, error: seriesError } = await supabase
			.from('test_series')
			.select('id, name, slug')
			.eq('is_active', true)
			.order('sort_order', { ascending: true });

		if (seriesError) throw seriesError;
		if (!seriesList || seriesList.length === 0) return [];

		// 2. 시리즈별 테스트 조회
		const seriesIds = seriesList.map((s) => s.id);
		const { data: tests, error: testsError } = await supabase
			.from('tests')
			.select('id, series_id, series_order')
			.in('series_id', seriesIds)
			.order('series_order', { ascending: true });

		if (testsError) throw testsError;

		// 시리즈별 테스트 매핑
		const testsBySeries = new Map<string, { id: string; order: number }[]>();
		seriesList.forEach((s) => testsBySeries.set(s.id, []));

		(tests || []).forEach((t) => {
			if (t.series_id) {
				const seriesTests = testsBySeries.get(t.series_id);
				if (seriesTests) {
					seriesTests.push({ id: t.id, order: t.series_order || 1 });
				}
			}
		});

		// 3. 기간 내 세션 데이터 조회
		const allTestIds = (tests || []).map((t) => t.id);

		if (allTestIds.length === 0) {
			return seriesList.map((s) => ({
				seriesId: s.id,
				seriesName: s.name,
				seriesSlug: s.slug,
				testsCount: 0,
				entryTestId: null,
				entryResponses: 0,
				entryCompletionRate: 0,
				seriesCompletionRate: 0,
				avgTestsPerSession: 0,
			}));
		}

		const { data: sessions, error: sessionsError } = await supabase
			.from('test_sessions')
			.select('id, test_id, status, user_id')
			.in('test_id', allTestIds)
			.gte('started_at', `${fromDate}T00:00:00`)
			.lte('started_at', `${toDate}T23:59:59`);

		if (sessionsError) throw sessionsError;

		// 테스트별 세션 통계
		const sessionsByTest = new Map<string, { total: number; completed: number }>();
		// 사용자별 완료한 테스트 추적 (시리즈 완주율 계산용)
		const userCompletedTests = new Map<string, Set<string>>();

		(sessions || []).forEach((s) => {
			if (!sessionsByTest.has(s.test_id)) {
				sessionsByTest.set(s.test_id, { total: 0, completed: 0 });
			}
			const stats = sessionsByTest.get(s.test_id)!;
			stats.total++;

			if (s.status === 'completed') {
				stats.completed++;

				// 사용자별 완료 테스트 추적
				const userId = s.user_id || s.id; // user_id가 없으면 session_id 사용
				if (!userCompletedTests.has(userId)) {
					userCompletedTests.set(userId, new Set());
				}
				userCompletedTests.get(userId)!.add(s.test_id);
			}
		});

		// 4. 시리즈별 집계
		return seriesList.map((series) => {
			const seriesTests = testsBySeries.get(series.id) || [];
			const seriesTestIds = new Set(seriesTests.map((t) => t.id));

			// 입구 테스트 (order가 가장 낮은 테스트)
			const entryTest = seriesTests.length > 0 ? seriesTests.sort((a, b) => a.order - b.order)[0] : null;

			const entryStats = entryTest ? sessionsByTest.get(entryTest.id) : null;
			const entryResponses = entryStats?.total || 0;
			const entryCompleted = entryStats?.completed || 0;

			// 시리즈 완주율: 2개 이상 완료한 사용자 비율
			let usersWithMultiple = 0;
			let totalSeriesUsers = 0;

			userCompletedTests.forEach((completedTests) => {
				const seriesCompletedCount = Array.from(completedTests).filter((id) => seriesTestIds.has(id)).length;
				if (seriesCompletedCount > 0) {
					totalSeriesUsers++;
					if (seriesCompletedCount >= 2) {
						usersWithMultiple++;
					}
				}
			});

			// 세션당 평균 완료 테스트 수
			let totalTestsCompleted = 0;
			userCompletedTests.forEach((completedTests) => {
				totalTestsCompleted += Array.from(completedTests).filter((id) => seriesTestIds.has(id)).length;
			});

			return {
				seriesId: series.id,
				seriesName: series.name,
				seriesSlug: series.slug,
				testsCount: seriesTests.length,
				entryTestId: entryTest?.id || null,
				entryResponses,
				entryCompletionRate: entryResponses > 0 ? Math.round((entryCompleted / entryResponses) * 100) : 0,
				seriesCompletionRate: totalSeriesUsers > 0 ? Math.round((usersWithMultiple / totalSeriesUsers) * 100) : 0,
				avgTestsPerSession:
					totalSeriesUsers > 0 ? Math.round((totalTestsCompleted / totalSeriesUsers) * 10) / 10 : 0,
			};
		});
	},

	/**
	 * 시리즈 내 테스트별 성과 조회
	 */
	async fetchSeriesTestsPerformance(seriesId: string, params: DateRangeParams): Promise<SeriesTestPerformance[]> {
		const fromDate = toDateString(params.from);
		const toDate = toDateString(params.to);

		// 시리즈 내 테스트 조회
		const { data: tests, error: testsError } = await supabase
			.from('tests')
			.select('id, title, series_order')
			.eq('series_id', seriesId)
			.order('series_order', { ascending: true });

		if (testsError) throw testsError;

		if (!tests || tests.length === 0) {
			return [];
		}

		// 세션 데이터 조회
		const testIds = tests.map((t) => t.id);
		const { data: sessions, error: sessionsError } = await supabase
			.from('test_sessions')
			.select('test_id, status, completion_time_seconds')
			.in('test_id', testIds)
			.gte('started_at', `${fromDate}T00:00:00`)
			.lte('started_at', `${toDate}T23:59:59`);

		if (sessionsError) throw sessionsError;

		// 테스트별 통계 집계
		const sessionsByTest = new Map<
			string,
			{ total: number; completed: number; totalTime: number; timeCount: number }
		>();

		(sessions || []).forEach((s) => {
			if (!sessionsByTest.has(s.test_id)) {
				sessionsByTest.set(s.test_id, { total: 0, completed: 0, totalTime: 0, timeCount: 0 });
			}
			const stats = sessionsByTest.get(s.test_id)!;
			stats.total++;

			if (s.status === 'completed') {
				stats.completed++;
				if (s.completion_time_seconds) {
					stats.totalTime += s.completion_time_seconds;
					stats.timeCount++;
				}
			}
		});

		return tests.map((test) => {
			const stats = sessionsByTest.get(test.id) || { total: 0, completed: 0, totalTime: 0, timeCount: 0 };
			return {
				testId: test.id,
				testTitle: test.title,
				seriesOrder: test.series_order || 1,
				totalResponses: stats.total,
				completedResponses: stats.completed,
				completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
				avgCompletionTime: stats.timeCount > 0 ? Math.round(stats.totalTime / stats.timeCount) : null,
			};
		});
	},

	/**
	 * 시리즈 완주 퍼널 조회
	 */
	async fetchSeriesFunnel(seriesId: string, params: DateRangeParams): Promise<SeriesFunnelStep[]> {
		const fromDate = toDateString(params.from);
		const toDate = toDateString(params.to);

		// 시리즈 내 테스트 조회
		const { data: tests, error: testsError } = await supabase
			.from('tests')
			.select('id, title, series_order')
			.eq('series_id', seriesId)
			.order('series_order', { ascending: true });

		if (testsError) throw testsError;

		if (!tests || tests.length === 0) {
			return [];
		}

		// 세션 데이터 조회
		const testIds = tests.map((t) => t.id);
		const { data: sessions, error: sessionsError } = await supabase
			.from('test_sessions')
			.select('test_id, status, user_id, id')
			.in('test_id', testIds)
			.gte('started_at', `${fromDate}T00:00:00`)
			.lte('started_at', `${toDate}T23:59:59`);

		if (sessionsError) throw sessionsError;

		// 사용자별 도달/완료 테스트 추적
		const userProgress = new Map<string, { reached: Set<string>; completed: Set<string> }>();

		(sessions || []).forEach((s) => {
			const userId = s.user_id || s.id;
			if (!userProgress.has(userId)) {
				userProgress.set(userId, { reached: new Set(), completed: new Set() });
			}
			const progress = userProgress.get(userId)!;
			progress.reached.add(s.test_id);
			if (s.status === 'completed') {
				progress.completed.add(s.test_id);
			}
		});

		// 테스트별 도달/완료 집계
		return tests.map((test, index) => {
			let reached = 0;
			let completed = 0;

			userProgress.forEach((progress) => {
				// 해당 테스트까지 도달했는지 (이전 테스트를 모두 완료했는지)
				const previousTestsCompleted = tests.slice(0, index).every((t) => progress.completed.has(t.id));
				const hasReached = index === 0 || previousTestsCompleted;

				if (hasReached && progress.reached.has(test.id)) {
					reached++;
				}
				if (hasReached && progress.completed.has(test.id)) {
					completed++;
				}
			});

			return {
				seriesOrder: test.series_order || index + 1,
				testId: test.id,
				testTitle: test.title,
				reached,
				completed,
				dropoffRate: reached > 0 ? Math.round(((reached - completed) / reached) * 100) : 0,
			};
		});
	},

	/**
	 * 테마별 성과 지표 조회
	 */
	async fetchThemePerformance(params: DateRangeParams): Promise<ThemePerformance[]> {
		const fromDate = toDateString(params.from);
		const toDate = toDateString(params.to);

		// 1. 테마 목록 조회
		const { data: themes, error: themesError } = await supabase
			.from('test_themes')
			.select('id, name, slug, start_date, end_date')
			.eq('is_active', true)
			.order('start_date', { ascending: false });

		if (themesError) throw themesError;
		if (!themes || themes.length === 0) return [];

		// 2. 테마별 테스트 조회
		const themeIds = themes.map((t) => t.id);
		const { data: tests, error: testsError } = await supabase
			.from('tests')
			.select('id, theme_id')
			.in('theme_id', themeIds);

		if (testsError) throw testsError;

		// 테마별 테스트 매핑
		const testsByTheme = new Map<string, string[]>();
		themes.forEach((t) => testsByTheme.set(t.id, []));

		(tests || []).forEach((t) => {
			if (t.theme_id) {
				const themeTests = testsByTheme.get(t.theme_id);
				if (themeTests) {
					themeTests.push(t.id);
				}
			}
		});

		// 3. 기간 내 세션 데이터 조회
		const allTestIds = (tests || []).map((t) => t.id);

		if (allTestIds.length === 0) {
			return themes.map((t) => ({
				themeId: t.id,
				themeName: t.name,
				themeSlug: t.slug,
				testsCount: 0,
				totalResponses: 0,
				completedResponses: 0,
				completionRate: 0,
				startDate: t.start_date,
				endDate: t.end_date,
			}));
		}

		const { data: sessions, error: sessionsError } = await supabase
			.from('test_sessions')
			.select('test_id, status')
			.in('test_id', allTestIds)
			.gte('started_at', `${fromDate}T00:00:00`)
			.lte('started_at', `${toDate}T23:59:59`);

		if (sessionsError) throw sessionsError;

		// 테스트별 세션 통계
		const sessionsByTest = new Map<string, { total: number; completed: number }>();

		(sessions || []).forEach((s) => {
			if (!sessionsByTest.has(s.test_id)) {
				sessionsByTest.set(s.test_id, { total: 0, completed: 0 });
			}
			const stats = sessionsByTest.get(s.test_id)!;
			stats.total++;
			if (s.status === 'completed') {
				stats.completed++;
			}
		});

		// 4. 테마별 집계
		return themes.map((theme) => {
			const themeTestIds = testsByTheme.get(theme.id) || [];
			let totalResponses = 0;
			let completedResponses = 0;

			themeTestIds.forEach((testId) => {
				const stats = sessionsByTest.get(testId);
				if (stats) {
					totalResponses += stats.total;
					completedResponses += stats.completed;
				}
			});

			return {
				themeId: theme.id,
				themeName: theme.name,
				themeSlug: theme.slug,
				testsCount: themeTestIds.length,
				totalResponses,
				completedResponses,
				completionRate: totalResponses > 0 ? Math.round((completedResponses / totalResponses) * 100) : 0,
				startDate: theme.start_date,
				endDate: theme.end_date,
			};
		});
	},

	/**
	 * 테마 일별 트렌드 조회
	 */
	async fetchThemeDailyTrend(themeId: string, params: DateRangeParams): Promise<ThemeDailyTrend[]> {
		const fromDate = toDateString(params.from);
		const toDate = toDateString(params.to);

		// 테마 내 테스트 조회
		const { data: tests, error: testsError } = await supabase.from('tests').select('id').eq('theme_id', themeId);

		if (testsError) throw testsError;

		if (!tests || tests.length === 0) {
			return [];
		}

		// 세션 데이터 조회
		const testIds = tests.map((t) => t.id);
		const { data: sessions, error: sessionsError } = await supabase
			.from('test_sessions')
			.select('started_at, status')
			.in('test_id', testIds)
			.gte('started_at', `${fromDate}T00:00:00`)
			.lte('started_at', `${toDate}T23:59:59`);

		if (sessionsError) throw sessionsError;

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

		return Array.from(dailyMap.entries())
			.map(([date, stats]) => ({
				date,
				responses: stats.responses,
				completions: stats.completions,
				completionRate: stats.responses > 0 ? Math.round((stats.completions / stats.responses) * 100) : 0,
			}))
			.sort((a, b) => a.date.localeCompare(b.date));
	},
};
