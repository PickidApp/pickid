import { supabase } from '@/lib/supabase/client';
import dayjs from 'dayjs';

// ============================================================================
// Types
// ============================================================================

export interface DashboardSummary {
	total_sessions: number;
	completed_sessions: number;
	completion_rate: number;
	total_web_sessions: number;
	web_conversion_rate: number;
	new_users: number;
	new_feedback: number;
}

export interface DailyGrowthPoint {
	date: string; // '2025-12-03'
	web_sessions: number;
	new_users: number;
	test_sessions: number;
	completed_sessions: number;
}

export interface ChannelSharePoint {
	channel: string; // text로 반환됨
	sessions: number;
	converted_sessions: number;
}

export interface FunnelStepPoint {
	funnel_step: 'visit' | 'test_start' | 'test_complete';
	count: number;
}

export interface FeedbackListItem {
	id: string;
	category: 'bug' | 'feature' | 'ui' | 'etc';
	status: 'new' | 'in_progress' | 'resolved' | 'rejected';
	content: string;
	created_at: string;
	tests: { id: string; title: string } | null;
	users: { id: string; email: string } | null;
}

export interface DateRangeParams {
	from: string; // ISO string
	to: string; // ISO string
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * ISO string을 YYYY-MM-DD 형식으로 변환
 */
function toDateString(isoString: string): string {
	return dayjs(isoString).format('YYYY-MM-DD');
}

// ============================================================================
// Dashboard Service
// ============================================================================

export const dashboardService = {
	/**
	 * 대시보드 요약 KPI 조회
	 */
	async fetchDashboardSummary(params: DateRangeParams): Promise<DashboardSummary> {
		const { data, error } = await supabase.rpc('get_dashboard_summary' as any, {
			p_from: toDateString(params.from),
			p_to: toDateString(params.to),
		} as any) as any;

		if (error) {
			console.error('[DashboardService] fetchDashboardSummary 에러:', error);
			throw error;
		}

		// RPC가 returns table이므로 배열로 반환됨, 첫 번째 요소 반환
		if (!data || (data as any[]).length === 0) {
			throw new Error('데이터가 없습니다');
		}

		return (data as any[])[0] as DashboardSummary;
	},

	/**
	 * 일별 성장 차트 데이터 조회 (VIEW)
	 */
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

	/**
	 * 채널별 유입 비율 조회
	 */
	async fetchChannelShare(params: DateRangeParams): Promise<ChannelSharePoint[]> {
		const { data, error } = await supabase.rpc('get_channel_share' as any, {
			p_from: toDateString(params.from),
			p_to: toDateString(params.to),
		} as any) as any;

		if (error) {
			console.error('[DashboardService] fetchChannelShare 에러:', error);
			throw error;
		}

		return data as ChannelSharePoint[];
	},

	/**
	 * 전체 퍼널 데이터 조회
	 */
	async fetchGlobalFunnel(params: DateRangeParams): Promise<FunnelStepPoint[]> {
		const { data, error } = await supabase.rpc('get_global_funnel' as any, {
			p_from: toDateString(params.from),
			p_to: toDateString(params.to),
		} as any) as any;

		if (error) {
			console.error('[DashboardService] fetchGlobalFunnel 에러:', error);
			throw error;
		}

		return data as FunnelStepPoint[];
	},

	/**
	 * 테스트별 퍼널 데이터 조회
	 */
	async fetchTestFunnel(params: {
		testId: string;
		from: string;
		to: string;
	}): Promise<FunnelStepPoint[]> {
		const { data, error } = await supabase.rpc('get_test_funnel' as any, {
			p_test_id: params.testId,
			p_from: toDateString(params.from),
			p_to: toDateString(params.to),
		} as any) as any;

		if (error) {
			console.error('[DashboardService] fetchTestFunnel 에러:', error);
			throw error;
		}

		return data as FunnelStepPoint[];
	},

	/**
	 * 최근 피드백 리스트 조회
	 */
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

	/**
	 * 피드백 상태 업데이트
	 */
	async updateFeedbackStatus(params: {
		id: string;
		status: 'new' | 'in_progress' | 'resolved' | 'rejected';
		adminNote?: string;
	}): Promise<void> {
		// @ts-ignore - Supabase types not yet generated for feedback table
		const result = await supabase.from('feedback').update({
			// @ts-ignore
			status: params.status,
			// @ts-ignore
			admin_note: params.adminNote ?? null,
			// @ts-ignore
			updated_at: new Date().toISOString(),
		}).eq('id', params.id);

		if (result.error) {
			console.error('[DashboardService] updateFeedbackStatus 에러:', result.error);
			throw result.error;
		}
	},

	/**
	 * 전체 테스트 리스트 조회 (테스트 선택 드롭다운용)
	 */
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
};
