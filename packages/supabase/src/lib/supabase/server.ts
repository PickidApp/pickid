import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';
import { getSupabaseConfig } from './config';

const { url, anonKey } = getSupabaseConfig();

export function createServerClient() {
	if (!url || !anonKey) {
		throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
	}

	return createClient<Database>(url, anonKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
}
