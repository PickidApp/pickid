import type { TestInsert, TestType, TestStatus } from '@pickid/supabase';

export interface IFetchTestsOptions {
	type?: TestType;
	status?: TestStatus;
	search?: string;
	page?: number;
	pageSize?: number;
}

export type TestPayload = Omit<TestInsert, 'id' | 'created_at' | 'updated_at'> & {
	id?: string;
	category_ids?: string[];
};

// test tab types
export type TestTabType = 'basic' | 'questions' | 'results' | 'responses';
