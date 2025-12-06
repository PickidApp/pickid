import type { User } from '@pickid/supabase';

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

export type UserTabType = 'basic' | 'responses';
