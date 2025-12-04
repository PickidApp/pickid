import { supabase } from '@/lib/supabase/client';
import type { User } from '@pickid/supabase';

// ========================================
// Service-specific types
// ========================================

export type UserStatus = 'active' | 'inactive' | 'deleted';
export type UserProvider = 'email' | 'google' | 'kakao';

export interface UsersResponse {
	users: User[];
	count: number;
}

export interface UserSummary {
	total: number;
	active: number;
	inactive: number;
	deleted: number;
}

export interface IFetchUsersOptions {
	status?: UserStatus;
	provider?: UserProvider;
	search?: string;
	page?: number;
	pageSize?: number;
}

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
		const { data, error } = await supabase.rpc('get_user_summary' as any);

		if (error) throw error;

		const result = (data as { total_count: number; active_count: number; inactive_count: number; deleted_count: number }[])[0];
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

	async updateUserStatus(userId: string, status: UserStatus): Promise<User> {
		const { data, error } = await supabase
			.from('users')
			.update({ status })
			.eq('id', userId)
			.select('id, auth_user_id, email, name, role, status, avatar_url, meta, created_at, updated_at')
			.single();

		if (error) throw error;
		return data;
	},

	async updateUsersStatus(userIds: string[], status: UserStatus): Promise<void> {
		const { error } = await supabase.from('users').update({ status }).in('id', userIds);

		if (error) throw error;
	},

	async deleteUser(userId: string): Promise<void> {
		// 실제 삭제 대신 상태를 deleted로 변경 (soft delete)
		const { error } = await supabase.from('users').update({ status: 'deleted' }).eq('id', userId);

		if (error) throw error;
	},
};
