import type { TestTheme } from '@pickid/supabase';

export type ThemeWithCount = TestTheme & { test_count: number };

export interface ThemeResponse {
	themes: ThemeWithCount[];
	count: number;
}

export interface IFetchThemesOptions {
	status?: ThemeStatusFilter;
	search?: string;
	page?: number;
	pageSize?: number;
}

export interface ThemePayload {
	name: string;
	slug: string;
	description?: string | null;
	thumbnail_url?: string | null;
	start_date?: string | null;
	end_date?: string | null;
	is_active?: boolean;
}

// 테마 상태 필터링용 타입
export type ThemeStatusFilter = 'active' | 'inactive' | 'ongoing' | 'upcoming' | 'ended';

// 테마 상태 계산 결과
export type ThemeStatus = 'inactive' | 'ongoing' | 'upcoming' | 'active' | 'ended';
