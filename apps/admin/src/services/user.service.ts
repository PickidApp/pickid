import { supabase } from '@/lib/supabase/client';
import type { User, UserSummary as RpcUserSummary } from '@pickid/supabase';
import type { UsersResponse, UserSummary, IFetchUsersOptions } from '@/types/user';

export const userService = {
	async fetchUsers(options?: IFetchUsersOptions): Promise<UsersResponse> {
		const page = options?.page ?? 1;
		const pageSize = options?.pageSize ?? 20;
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = supabase
			.from('users')
			.select('id, auth_user_id, email, name, role, status, avatar_url, meta, created_at, updated_at', {
				count: 'exact',
			});

		if (options?.status) {
			query = query.eq('status', options.status);
		}

		// provider는 meta 컬럼에 저장됨 (JSONB)
		// email의 경우 meta가 null이거나 provider가 없는 경우도 포함
		if (options?.provider) {
			if (options.provider === 'email') {
				// meta가 null이거나, provider가 'email'이거나, provider 키가 없는 경우
				query = query.or(`meta.is.null,meta->>provider.is.null,meta->>provider.eq.${options.provider}`);
			} else {
				// ->> 연산자로 text 추출 후 비교
				query = query.filter('meta->>provider', 'eq', options.provider);
			}
		}

		if (options?.search) {
			query = query.or(`email.ilike.%${options.search}%,name.ilike.%${options.search}%`);
		}

		const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to);

		if (error) throw error;

		return {
			users: data ?? [],
			count: count ?? 0,
		};
	},

	async fetchUserSummary(): Promise<UserSummary> {
		const { data, error } = (await supabase.rpc('get_user_summary' as never)) as {
			data: RpcUserSummary[] | null;
			error: unknown;
		};

		if (error) throw error;

		const result = data?.[0];
		if (!result) {
			return { total: 0, active: 0, inactive: 0, deleted: 0 };
		}

		return {
			total: result.total_count,
			active: result.active_count,
			inactive: result.inactive_count,
			deleted: result.deleted_count,
		};
	},

	async fetchUser(userId: string): Promise<User> {
		const { data, error } = await supabase
			.from('users')
			.select('id, auth_user_id, email, name, role, status, avatar_url, meta, created_at, updated_at')
			.eq('id', userId)
			.single();

		if (error) throw error;
		return data;
	},

	async fetchUserResponses(userId: string, limit: number = 10) {
		const { data, error } = await supabase
			.from('test_sessions')
			.select(
				`
				id,
				status,
				total_score,
				started_at,
				completed_at,
				completion_time_seconds,
				device_type,
				tests (
					id,
					title,
					type
				),
				test_results (
					id,
					name
				)
			`
			)
			.eq('user_id', userId)
			.order('started_at', { ascending: false })
			.limit(limit);

		if (error) throw error;
		return data ?? [];
	},

	async fetchUserStats(userId: string) {
		const { data, error, count } = await supabase
			.from('test_sessions')
			.select('id, status, completion_time_seconds', { count: 'exact' })
			.eq('user_id', userId);

		if (error) throw error;

		const responses = data ?? [];
		const total = count ?? 0;
		const completed = responses.filter((s) => s.status === 'completed').length;
		const avgTime =
			responses.filter((s) => s.completion_time_seconds).reduce((sum, s) => sum + (s.completion_time_seconds ?? 0), 0) /
				(completed || 1) || 0;

		return {
			totalResponses: total,
			completedResponses: completed,
			completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
			avgCompletionTime: Math.round(avgTime),
		};
	},
};
