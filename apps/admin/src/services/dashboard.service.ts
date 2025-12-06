import { supabase } from '@/lib/supabase/client';
import type {
	DashboardSummary,
	ChannelShare,
	GlobalFunnel,
	TestFunnel,
	FeaturedTest,
	CurrentTheme,
	ThemeTest,
} from '@pickid/supabase';
import type { DailyGrowthPoint, FeedbackListItem } from '@/types/dashboard';
import type { DateRangeParams } from '@/types/analytics';
import { toDateString } from '@/utils/format';

export const dashboardService = {
	async fetchDashboardSummary(params: DateRangeParams): Promise<DashboardSummary> {
		const { data, error } = (await supabase.rpc(
			'get_dashboard_summary' as any,
			{
				p_from: toDateString(params.from),
				p_to: toDateString(params.to),
			} as any
		)) as any;

		if (error) {
			console.error('[DashboardService] fetchDashboardSummary 에러:', error);
			throw error;
		}

		if (!data || (data as any[]).length === 0) {
			throw new Error('데이터가 없습니다');
		}

		return (data as any[])[0] as DashboardSummary;
	},

	async fetchDailyGrowth(params: DateRangeParams): Promise<DailyGrowthPoint[]> {
		const { data, error } = await supabase
			.from('daily_growth_view')
			.select('*')
			.gte('date', toDateString(params.from))
			.lte('date', toDateString(params.to))
			.order('date', { ascending: true });

		if (error) {
			console.error('[DashboardService] fetchDailyGrowth 에러:', error);
			throw error;
		}

		return data as DailyGrowthPoint[];
	},

	async fetchChannelShare(params: DateRangeParams): Promise<ChannelShare[]> {
		const { data, error } = (await supabase.rpc('get_channel_share' as any, {
			p_from: toDateString(params.from),
			p_to: toDateString(params.to),
		} as any)) as any;

		if (error) {
			console.error('[DashboardService] fetchChannelShare 에러:', error);
			throw error;
		}

		return data as ChannelShare[];
	},

	async fetchGlobalFunnel(params: DateRangeParams): Promise<GlobalFunnel[]> {
		const { data, error } = (await supabase.rpc('get_global_funnel' as any, {
			p_from: toDateString(params.from),
			p_to: toDateString(params.to),
		} as any)) as any;

		if (error) {
			console.error('[DashboardService] fetchGlobalFunnel 에러:', error);
			throw error;
		}

		return data as GlobalFunnel[];
	},

	async fetchTestFunnel(params: { testId: string; from: string; to: string }): Promise<TestFunnel[]> {
		const { data, error } = (await supabase.rpc(
			'get_test_funnel' as any,
			{
				p_test_id: params.testId,
				p_from: toDateString(params.from),
				p_to: toDateString(params.to),
			} as any
		)) as any;

		if (error) {
			console.error('[DashboardService] fetchTestFunnel 에러:', error);
			throw error;
		}

		return data as TestFunnel[];
	},

	async fetchRecentFeedback(limit = 10): Promise<FeedbackListItem[]> {
		const { data, error } = await supabase
			.from('feedback')
			.select(
				`
        id,
        category,
        status,
        content,
        created_at,
        tests (
          id,
          title
        ),
        users (
          id,
          email
        )
      `
			)
			.order('created_at', { ascending: false })
			.limit(limit);

		if (error) {
			console.error('[DashboardService] fetchRecentFeedback 에러:', error);
			throw error;
		}

		return data as FeedbackListItem[];
	},

	async fetchAllTests(): Promise<Array<{ id: string; title: string }>> {
		const { data, error } = await supabase
			.from('tests')
			.select('id, title')
			.eq('status', 'published')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('[DashboardService] fetchAllTests 에러:', error);
			throw error;
		}

		return data as Array<{ id: string; title: string }>;
	},

	async fetchFeaturedTest(): Promise<FeaturedTest | null> {
		const { data, error } = (await supabase.rpc('get_featured_test' as never)) as {
			data: FeaturedTest[] | null;
			error: unknown;
		};

		if (error) {
			console.error('[DashboardService] fetchFeaturedTest 에러:', error);
			throw error;
		}

		return data?.[0] || null;
	},

	async fetchCurrentTheme(): Promise<CurrentTheme | null> {
		const { data, error } = (await supabase.rpc('get_current_theme' as never)) as {
			data: CurrentTheme[] | null;
			error: unknown;
		};

		if (error) {
			console.error('[DashboardService] fetchCurrentTheme 에러:', error);
			throw error;
		}

		return data?.[0] || null;
	},

	async fetchThemeTests(themeId: string, limit = 3): Promise<ThemeTest[]> {
		const { data, error } = (await supabase.rpc('get_theme_tests' as never, {
			p_theme_id: themeId,
			p_limit: limit,
		} as never)) as { data: ThemeTest[] | null; error: unknown };

		if (error) {
			console.error('[DashboardService] fetchThemeTests 에러:', error);
			throw error;
		}

		return data || [];
	},
};
