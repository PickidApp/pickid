import { supabase } from '@/lib/supabase/client';
import type { AdminTestSession } from '@pickid/supabase';
import type { IFetchResponsesOptions, ResponseStats } from '@/types/response';

export const responseService = {
	async fetchResponses(options?: IFetchResponsesOptions) {
		const { data, error } = (await supabase.rpc('get_admin_test_sessions' as never, {
			p_test_id: options?.testId || null,
			p_status: options?.status || null,
			p_device_type: options?.deviceType || null,
			p_result_id: options?.resultId || null,
			p_search: options?.search || null,
			p_start_date: options?.startDate || null,
			p_end_date: options?.endDate || null,
			p_page: options?.page || 1,
			p_page_size: options?.pageSize || 20,
		} as never)) as { data: AdminTestSession[] | null; error: unknown };

		if (error) throw error;

		const responses = data || [];
		const totalCount = responses.length > 0 ? responses[0].total_count : 0;

		return {
			responses,
			count: totalCount as number,
		};
	},

	async fetchResponseStats(options?: Omit<IFetchResponsesOptions, 'page' | 'pageSize'>) {
		const { data, error } = await (supabase.rpc as any)('get_admin_session_stats', {
			p_test_id: options?.testId || null,
			p_status: options?.status || null,
			p_device_type: options?.deviceType || null,
			p_result_id: options?.resultId || null,
			p_search: options?.search || null,
			p_start_date: options?.startDate || null,
			p_end_date: options?.endDate || null,
		});

		if (error) throw error;
		return data as ResponseStats;
	},

	async fetchResponseDetail(responseId: string) {
		const { data, error } = await (supabase.rpc as any)('get_admin_session_detail', {
			p_session_id: responseId,
		});

		if (error) throw error;
		return data as { session: any; answers: any[] };
	},

};
