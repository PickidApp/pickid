import { supabase } from '@/lib/supabase/client';
import type { Category } from '@pickid/supabase';

export type CategoryStatus = 'active' | 'inactive';

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

export const categoryService = {
	async fetchCategories(options?: IFetchCategoriesOptions): Promise<CategoriesResponse> {
		const page = options?.page ?? 1;
		const pageSize = options?.pageSize ?? 20;
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		let query = supabase
			.from('test_categories')
			.select('id, name, slug, description, status, sort_order, created_at, updated_at', {
				count: 'exact',
			});

		if (options?.status) {
			query = query.eq('status', options.status);
		}

		if (options?.search) {
			query = query.or(`name.ilike.%${options.search}%,slug.ilike.%${options.search}%`);
		}

		const { data, error, count } = await query.order('sort_order', { ascending: true }).range(from, to);

		if (error) throw error;

		// 목록 조회용으로 필요한 컬럼만 select하므로 타입 단언 필요
		return {
			categories: (data ?? []) as Category[],
			count: count ?? 0,
		};
	},

	async fetchCategory(categoryId: string): Promise<Category> {
		const { data, error } = await supabase
			.from('test_categories')
			.select('id, name, slug, description, status, sort_order, created_at, updated_at')
			.eq('id', categoryId)
			.single();

		if (error) throw error;
		return data;
	},

	async updateCategoryStatus(categoryId: string, status: CategoryStatus): Promise<Category> {
		const { data, error } = await supabase
			.from('test_categories')
			.update({ status })
			.eq('id', categoryId)
			.select('id, name, slug, description, status, sort_order, created_at, updated_at')
			.single();

		if (error) throw error;
		return data;
	},

	async deleteCategory(categoryId: string): Promise<void> {
		const { error } = await supabase.from('test_categories').delete().eq('id', categoryId);

		if (error) throw error;
	},

	async updateCategorySortOrder(categoryId: string, sortOrder: number): Promise<Category> {
		const { data, error } = await supabase
			.from('test_categories')
			.update({ sort_order: sortOrder })
			.eq('id', categoryId)
			.select('id, name, slug, description, status, sort_order, created_at, updated_at')
			.single();

		if (error) throw error;
		return data;
	},

	async reorderCategories(orders: { id: string; sort_order: number }[]): Promise<void> {
		const promises = orders.map(({ id, sort_order }) =>
			supabase.from('test_categories').update({ sort_order }).eq('id', id)
		);

		const results = await Promise.all(promises);
		const error = results.find((r) => r.error)?.error;

		if (error) throw error;
	},

	async createCategory(payload: CategoryPayload): Promise<Category> {
		const { data, error } = await supabase
			.from('test_categories')
			.insert({
				name: payload.name,
				slug: payload.slug,
				sort_order: payload.sort_order ?? 100,
				status: payload.status ?? 'active',
			})
			.select('id, name, slug, description, status, sort_order, created_at, updated_at')
			.single();

		if (error) throw error;
		return data;
	},

	async updateCategory(categoryId: string, payload: CategoryPayload): Promise<Category> {
		const { data, error } = await supabase
			.from('test_categories')
			.update({
				name: payload.name,
				slug: payload.slug,
				sort_order: payload.sort_order,
				status: payload.status,
			})
			.eq('id', categoryId)
			.select('id, name, slug, description, status, sort_order, created_at, updated_at')
			.single();

		if (error) throw error;
		return data;
	},
};
