import { supabase } from '@/lib/supabase/client';
import type { TestTheme } from '@pickid/supabase';
import type { ThemeResponse, IFetchThemesOptions, ThemePayload, ThemeStatusFilter, ThemeWithCount } from '@/types/theme';

export const themeService = {
	async fetchThemes(options?: IFetchThemesOptions): Promise<ThemeResponse> {
		const page = options?.page ?? 1;
		const pageSize = options?.pageSize ?? 20;
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = supabase
			.from('test_themes')
			.select('id, name, slug, description, thumbnail_url, is_active, start_date, end_date, created_at, updated_at, tests(count)', {
				count: 'exact',
			});

		// 상태 필터링
		if (options?.status) {
			query = applyStatusFilter(query, options.status);
		}

		if (options?.search) {
			query = query.or(`name.ilike.%${options.search}%,slug.ilike.%${options.search}%`);
		}

		const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to);

		if (error) throw error;

		// Supabase 쿼리 결과 타입 정의
		type ThemeQueryResult = Omit<TestTheme, 'tests'> & {
			tests: { count: number }[] | null;
		};

		// 테스트 수를 test_count 필드로 변환
		const themesWithCount: ThemeWithCount[] = (data as ThemeQueryResult[] ?? []).map((theme) => ({
			id: theme.id,
			name: theme.name,
			slug: theme.slug,
			description: theme.description,
			thumbnail_url: theme.thumbnail_url,
			is_active: theme.is_active,
			start_date: theme.start_date,
			end_date: theme.end_date,
			created_at: theme.created_at,
			updated_at: theme.updated_at,
			test_count: theme.tests?.[0]?.count ?? 0,
		}));

		return {
			themes: themesWithCount,
			count: count ?? 0,
		};
	},

	async createTheme(payload: ThemePayload): Promise<TestTheme> {
		const { data, error } = await supabase
			.from('test_themes')
			.insert({
				name: payload.name,
				slug: payload.slug,
				description: payload.description ?? null,
				thumbnail_url: payload.thumbnail_url ?? null,
				start_date: payload.start_date ?? null,
				end_date: payload.end_date ?? null,
				is_active: payload.is_active ?? true,
			})
			.select('id, name, slug, description, thumbnail_url, is_active, start_date, end_date, created_at, updated_at')
			.single();

		if (error) throw error;
		return data;
	},

	async updateTheme(themeId: string, payload: ThemePayload): Promise<TestTheme> {
		const { data, error } = await supabase
			.from('test_themes')
			.update({
				name: payload.name,
				slug: payload.slug,
				description: payload.description,
				thumbnail_url: payload.thumbnail_url,
				start_date: payload.start_date,
				end_date: payload.end_date,
				is_active: payload.is_active,
			})
			.eq('id', themeId)
			.select('id, name, slug, description, thumbnail_url, is_active, start_date, end_date, created_at, updated_at')
			.single();

		if (error) throw error;
		return data;
	},

	async updateThemeStatus(themeId: string, is_active: boolean): Promise<TestTheme> {
		const { data, error } = await supabase
			.from('test_themes')
			.update({ is_active })
			.eq('id', themeId)
			.select('id, name, slug, description, thumbnail_url, is_active, start_date, end_date, created_at, updated_at')
			.single();

		if (error) throw error;
		return data;
	},

	async deleteTheme(themeId: string): Promise<void> {
		// 먼저 연결된 테스트들의 theme_id를 null로 업데이트
		const { error: updateError } = await supabase.from('tests').update({ theme_id: null }).eq('theme_id', themeId);

		if (updateError) throw updateError;

		// 테마 삭제
		const { error } = await supabase.from('test_themes').delete().eq('id', themeId);

		if (error) throw error;
	},

	async getThemeTestCount(themeId: string): Promise<number> {
		const { count, error } = await supabase
			.from('tests')
			.select('id', { count: 'exact', head: true })
			.eq('theme_id', themeId);

		if (error) throw error;
		return count ?? 0;
	},

	async fetchThemeTests(themeId: string) {
		const { data, error } = await supabase
			.from('tests')
			.select('id, title, slug, type, status, thumbnail_url, created_at')
			.eq('theme_id', themeId)
			.order('created_at', { ascending: false });

		if (error) throw error;
		return data ?? [];
	},

	async addTestsToTheme(themeId: string, testIds: string[]): Promise<void> {
		const { error } = await supabase
			.from('tests')
			.update({ theme_id: themeId })
			.in('id', testIds);

		if (error) throw error;
	},

	async removeTestFromTheme(testId: string): Promise<void> {
		const { error } = await supabase
			.from('tests')
			.update({ theme_id: null })
			.eq('id', testId);

		if (error) throw error;
	},
};

// 상태 필터 적용 헬퍼 함수
// Supabase 쿼리 빌더 타입은 복잡하므로 제네릭으로 처리
function applyStatusFilter<T extends { eq: Function; is: Function; gt: Function; lte: Function; gte: Function; lt: Function }>(
	query: T,
	status: ThemeStatusFilter
): T {
	const today = new Date().toISOString().split('T')[0];

	switch (status) {
		case 'inactive':
			return query.eq('is_active', false);
		case 'ongoing':
			// 활성 상태이면서 기간이 없는 경우 (상시 진행)
			return query.eq('is_active', true).is('start_date', null).is('end_date', null);
		case 'upcoming':
			// 활성 상태이면서 시작일이 미래인 경우
			return query.eq('is_active', true).gt('start_date', today);
		case 'active':
			// 활성 상태이면서 현재 기간 내인 경우
			return query.eq('is_active', true).lte('start_date', today).gte('end_date', today);
		case 'ended':
			// 활성 상태이면서 종료일이 과거인 경우
			return query.eq('is_active', true).lt('end_date', today);
		default:
			return query;
	}
}
