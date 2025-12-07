import { supabase } from '@/lib/supabase/client';
import type { TestSeries } from '@pickid/supabase';
import type { SeriesResponse, IFetchSeriesOptions, SeriesPayload, SeriesWithCount } from '@/types/series';

export const seriesService = {
	async fetchSeries(options?: IFetchSeriesOptions): Promise<SeriesResponse> {
		const page = options?.page ?? 1;
		const pageSize = options?.pageSize ?? 20;
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = supabase
			.from('test_series')
			.select('id, name, slug, description, thumbnail_url, is_active, sort_order, created_at, updated_at, tests(count)', {
				count: 'exact',
			});

		if (options?.is_active !== undefined) {
			query = query.eq('is_active', options.is_active);
		}

		if (options?.search) {
			query = query.or(`name.ilike.%${options.search}%,slug.ilike.%${options.search}%`);
		}

		const { data, error, count } = await query.order('sort_order', { ascending: true }).range(from, to);

		if (error) throw error;

		// Supabase 쿼리 결과 타입 정의
		type SeriesQueryResult = Omit<TestSeries, 'tests'> & {
			tests: { count: number }[] | null;
		};

		// 테스트 수를 test_count 필드로 변환
		const seriesWithCount: SeriesWithCount[] = (data as SeriesQueryResult[] ?? []).map((s) => ({
			id: s.id,
			name: s.name,
			slug: s.slug,
			description: s.description,
			thumbnail_url: s.thumbnail_url,
			is_active: s.is_active,
			sort_order: s.sort_order,
			created_at: s.created_at,
			updated_at: s.updated_at,
			test_count: s.tests?.[0]?.count ?? 0,
		}));

		return {
			series: seriesWithCount,
			count: count ?? 0,
		};
	},

	async createSeries(payload: SeriesPayload): Promise<TestSeries> {
		const { data, error } = await supabase
			.from('test_series')
			.insert({
				name: payload.name,
				slug: payload.slug,
				description: payload.description ?? null,
				thumbnail_url: payload.thumbnail_url ?? null,
				sort_order: payload.sort_order ?? 100,
				is_active: payload.is_active ?? true,
			})
			.select('id, name, slug, description, thumbnail_url, is_active, sort_order, created_at, updated_at')
			.single();

		if (error) throw error;
		return data;
	},

	async updateSeries(seriesId: string, payload: SeriesPayload): Promise<TestSeries> {
		const { data, error } = await supabase
			.from('test_series')
			.update({
				name: payload.name,
				slug: payload.slug,
				description: payload.description,
				thumbnail_url: payload.thumbnail_url,
				sort_order: payload.sort_order,
				is_active: payload.is_active,
			})
			.eq('id', seriesId)
			.select('id, name, slug, description, thumbnail_url, is_active, sort_order, created_at, updated_at')
			.single();

		if (error) throw error;
		return data;
	},

	async updateSeriesStatus(seriesId: string, is_active: boolean): Promise<TestSeries> {
		const { data, error } = await supabase
			.from('test_series')
			.update({ is_active })
			.eq('id', seriesId)
			.select('id, name, slug, description, thumbnail_url, is_active, sort_order, created_at, updated_at')
			.single();

		if (error) throw error;
		return data;
	},

	async deleteSeries(seriesId: string): Promise<void> {
		// 먼저 연결된 테스트들의 series_id를 null로 업데이트
		const { error: updateError } = await supabase
			.from('tests')
			.update({ series_id: null })
			.eq('series_id', seriesId);

		if (updateError) throw updateError;

		// 시리즈 삭제
		const { error } = await supabase.from('test_series').delete().eq('id', seriesId);

		if (error) throw error;
	},

	async getSeriesTestCount(seriesId: string): Promise<number> {
		const { count, error } = await supabase
			.from('tests')
			.select('id', { count: 'exact', head: true })
			.eq('series_id', seriesId);

		if (error) throw error;
		return count ?? 0;
	},

	async fetchSeriesTests(seriesId: string) {
		const { data, error } = await supabase
			.from('tests')
			.select('id, title, slug, type, status, thumbnail_url, series_order, created_at')
			.eq('series_id', seriesId)
			.order('series_order', { ascending: true });

		if (error) throw error;
		return data ?? [];
	},

	async addTestsToSeries(seriesId: string, testIds: string[]): Promise<void> {
		// 현재 시리즈의 최대 series_order 가져오기
		const { data: existingTests } = await supabase
			.from('tests')
			.select('series_order')
			.eq('series_id', seriesId)
			.order('series_order', { ascending: false })
			.limit(1);

		const maxOrder = existingTests?.[0]?.series_order ?? 0;

		// 각 테스트에 순서 부여하면서 추가
		for (let i = 0; i < testIds.length; i++) {
			const { error } = await supabase
				.from('tests')
				.update({ series_id: seriesId, series_order: maxOrder + i + 1 })
				.eq('id', testIds[i]);

			if (error) throw error;
		}
	},

	async removeTestFromSeries(testId: string): Promise<void> {
		const { error } = await supabase
			.from('tests')
			.update({ series_id: null, series_order: null })
			.eq('id', testId);

		if (error) throw error;
	},

	async updateSeriesTestOrder(seriesId: string, testIds: string[]): Promise<void> {
		// 순서대로 series_order 업데이트
		for (let i = 0; i < testIds.length; i++) {
			const { error } = await supabase
				.from('tests')
				.update({ series_order: i + 1 })
				.eq('id', testIds[i])
				.eq('series_id', seriesId);

			if (error) throw error;
		}
	},
};
