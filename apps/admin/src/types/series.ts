import type { TestSeries } from '@pickid/supabase';

export type SeriesWithCount = TestSeries & { test_count: number };

export interface SeriesResponse {
	series: SeriesWithCount[];
	count: number;
}

export interface IFetchSeriesOptions {
	is_active?: boolean;
	search?: string;
	page?: number;
	pageSize?: number;
}

export interface SeriesPayload {
	name: string;
	slug: string;
	description?: string | null;
	thumbnail_url?: string | null;
	sort_order?: number;
	is_active?: boolean;
}
