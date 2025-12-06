import { supabase } from '@/lib/supabase/client';
import type {
	GrowthSummary as RpcGrowthSummary,
	FunnelAnalysis as RpcFunnelAnalysis,
	ChannelAnalysis as RpcChannelAnalysis,
	LandingPageAnalysis as RpcLandingPageAnalysis,
	CohortAnalysis as RpcCohortAnalysis,
} from '@pickid/supabase';
import type {
	DateRangeParams,
	GrowthSummary,
	DailyGrowth,
	FunnelStep,
	ChannelData,
	LandingPageData,
	CohortData,
} from '@/types/analytics';
import dayjs from 'dayjs';

function toDateString(isoString: string): string {
	return dayjs(isoString).format('YYYY-MM-DD');
}

export const analyticsService = {
	/**
	 * 성장 요약 KPI 조회 (변화율 포함)
	 */
	async fetchGrowthSummary(params: DateRangeParams): Promise<GrowthSummary> {
		const { data, error } = (await supabase.rpc('get_growth_summary' as never, {
			p_from: toDateString(params.from),
			p_to: toDateString(params.to),
		} as never)) as { data: RpcGrowthSummary[] | null; error: unknown };

		if (error) {
			console.error('[AnalyticsService] fetchGrowthSummary 에러:', error);
			throw error;
		}

		const row = data?.[0];

		if (!row) {
			return {
				totalVisits: 0,
				totalVisitsChange: 0,
				totalResponses: 0,
				totalResponsesChange: 0,
				completionRate: 0,
				completionRateChange: 0,
				avgResponseDuration: 0,
				avgResponseDurationChange: 0,
			};
		}

		return {
			totalVisits: Number(row.total_visits) || 0,
			totalVisitsChange: Number(row.total_visits_change) || 0,
			totalResponses: Number(row.total_sessions) || 0,
			totalResponsesChange: Number(row.total_sessions_change) || 0,
			completionRate: Number(row.completion_rate) || 0,
			completionRateChange: Number(row.completion_rate_change) || 0,
			avgResponseDuration: Number(row.avg_session_duration) || 0,
			avgResponseDurationChange: Number(row.avg_duration_change) || 0,
		};
	},

	/**
	 * 일별 성장 데이터 조회
	 */
	async fetchDailyGrowth(params: DateRangeParams): Promise<DailyGrowth[]> {
		const { data, error } = await supabase
			.from('daily_growth_view')
			.select('date, web_sessions, test_sessions, completed_sessions')
			.gte('date', toDateString(params.from))
			.lte('date', toDateString(params.to))
			.order('date', { ascending: true });

		if (error) {
			console.error('[AnalyticsService] fetchDailyGrowth 에러:', error);
			throw error;
		}

		return (data || []).map((row) => ({
			date: row.date || '',
			visits: Number(row.web_sessions) || 0,
			responses: Number(row.test_sessions) || 0,
			completions: Number(row.completed_sessions) || 0,
		}));
	},

	/**
	 * 퍼널 분석 데이터 조회
	 */
	async fetchFunnelAnalysis(params: DateRangeParams): Promise<FunnelStep[]> {
		const { data, error } = (await supabase.rpc('get_funnel_analysis' as never, {
			p_from: toDateString(params.from),
			p_to: toDateString(params.to),
		} as never)) as { data: RpcFunnelAnalysis[] | null; error: unknown };

		if (error) {
			console.error('[AnalyticsService] fetchFunnelAnalysis 에러:', error);
			throw error;
		}

		return (data || []).map((row) => ({
			step: row.step,
			label: row.label,
			count: Number(row.count) || 0,
			rate: Number(row.rate) || 0,
			dropoff: Number(row.dropoff) || 0,
		}));
	},

	/**
	 * 채널별 분석 데이터 조회
	 */
	async fetchChannelAnalysis(params: DateRangeParams): Promise<ChannelData[]> {
		const { data, error } = (await supabase.rpc('get_channel_analysis' as never, {
			p_from: toDateString(params.from),
			p_to: toDateString(params.to),
		} as never)) as { data: RpcChannelAnalysis[] | null; error: unknown };

		if (error) {
			console.error('[AnalyticsService] fetchChannelAnalysis 에러:', error);
			throw error;
		}

		return (data || []).map((row) => ({
			channel: row.channel,
			label: row.label,
			responses: Number(row.sessions) || 0,
			completions: Number(row.completions) || 0,
			conversionRate: Number(row.conversion_rate) || 0,
		}));
	},

	/**
	 * 랜딩 페이지별 분석 데이터 조회
	 */
	async fetchLandingPageAnalysis(params: DateRangeParams): Promise<LandingPageData[]> {
		const { data, error } = (await supabase.rpc('get_landing_page_analysis' as never, {
			p_from: toDateString(params.from),
			p_to: toDateString(params.to),
		} as never)) as { data: RpcLandingPageAnalysis[] | null; error: unknown };

		if (error) {
			console.error('[AnalyticsService] fetchLandingPageAnalysis 에러:', error);
			throw error;
		}

		return (data || []).map((row) => ({
			path: row.path,
			visits: Number(row.visits) || 0,
			responses: Number(row.sessions) || 0,
			completions: Number(row.completions) || 0,
			conversionRate: Number(row.conversion_rate) || 0,
		}));
	},

	/**
	 * 코호트 리텐션 분석 데이터 조회
	 */
	async fetchCohortAnalysis(weeks: number): Promise<CohortData[]> {
		const { data, error } = (await supabase.rpc('get_cohort_analysis' as never, {
			p_weeks: weeks,
		} as never)) as { data: RpcCohortAnalysis[] | null; error: unknown };

		if (error) {
			console.error('[AnalyticsService] fetchCohortAnalysis 에러:', error);
			throw error;
		}

		// RPC 결과를 코호트별로 그룹화
		const rows = data || [];
		const cohortMap = new Map<string, { users: number; weeks: number[] }>();

		for (const row of rows) {
			if (!cohortMap.has(row.cohort)) {
				cohortMap.set(row.cohort, {
					users: Number(row.users) || 0,
					weeks: [],
				});
			}
			const cohort = cohortMap.get(row.cohort)!;
			cohort.weeks[row.week_index] = Number(row.retention) || 0;
		}

		// Map을 배열로 변환
		return Array.from(cohortMap.entries()).map(([cohort, data]) => ({
			cohort,
			users: data.users,
			weeks: data.weeks,
		}));
	},
};

// ============================================================================
// TODO: 웹 앱에서 이벤트 트래킹 연결 필요
// ============================================================================
//
// 이 분석 데이터가 제대로 작동하려면 웹 앱에서 다음 이벤트들을 기록해야 합니다:
//
// 1. web_sessions 테이블 연동 (방문 추적)
//    - 사용자가 사이트에 접속할 때 web_sessions 레코드 생성
//    - landing_page: 첫 방문 페이지 URL
//    - channel: 유입 채널 (referrer 기반으로 판단)
//    - device_type: 디바이스 타입
//
//    예시 코드 (apps/web):
//    ```typescript
//    // lib/analytics/track-session.ts
//    export async function trackWebSession() {
//      const sessionId = localStorage.getItem('web_session_id');
//      if (sessionId) return sessionId;
//
//      const { data } = await supabase
//        .from('web_sessions')
//        .insert({
//          landing_page: window.location.pathname,
//          referrer: document.referrer,
//          channel: detectChannel(document.referrer), // 'direct' | 'search' | 'social' | etc
//          device_type: detectDeviceType(), // 'mobile' | 'desktop' | 'tablet'
//        })
//        .select('id')
//        .single();
//
//      if (data?.id) {
//        localStorage.setItem('web_session_id', data.id);
//      }
//      return data?.id;
//    }
//    ```
//
// 2. test_sessions.web_session_id 연결
//    - 테스트 시작 시 현재 web_session_id를 test_sessions에 연결
//
//    예시:
//    ```typescript
//    // 테스트 시작 시
//    const webSessionId = localStorage.getItem('web_session_id');
//    await supabase.from('test_sessions').insert({
//      test_id: testId,
//      web_session_id: webSessionId,
//      // ...
//    });
//    ```
//
// 3. web_sessions.converted 업데이트
//    - 테스트 완료 시 해당 web_session의 converted를 true로 업데이트
//
//    예시:
//    ```typescript
//    // 테스트 완료 시
//    const webSessionId = localStorage.getItem('web_session_id');
//    if (webSessionId) {
//      await supabase
//        .from('web_sessions')
//        .update({ converted: true, conversion_type: 'test_complete' })
//        .eq('id', webSessionId);
//    }
//    ```
//
// 4. 채널 감지 함수 구현
//    ```typescript
//    function detectChannel(referrer: string): ChannelType {
//      if (!referrer) return 'direct';
//      if (referrer.includes('google') || referrer.includes('naver') || referrer.includes('bing')) {
//        return 'search';
//      }
//      if (referrer.includes('instagram') || referrer.includes('facebook') || referrer.includes('twitter')) {
//        return 'social';
//      }
//      // ... 기타 채널 감지 로직
//      return 'external';
//    }
//    ```
//
// ============================================================================
