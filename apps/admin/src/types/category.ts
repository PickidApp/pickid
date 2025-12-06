import type { Category, CategoryStatus } from '@pickid/supabase';

export interface CategoriesResponse {
	categories: Category[];
	count: number;
}

export interface IFetchCategoriesOptions {
	status?: CategoryStatus;
	search?: string;
	page?: number;
	pageSize?: number;
}

export interface CategoryPayload {
	name: string;
	slug: string;
	sort_order?: number;
	status?: CategoryStatus;
}
