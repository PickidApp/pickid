import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';
import { getSupabaseConfig } from './config';

function createSupabaseClient() {
	const { url, anonKey } = getSupabaseConfig();

	if (!url || !anonKey) {
		if (typeof window === 'undefined') {
			return createClient<Database>('https://placeholder.supabase.co', 'placeholder-key', {
				auth: {
					storageKey: 'pickid-auth',
					persistSession: true,
					autoRefreshToken: true,
					detectSessionInUrl: true,
				},
			});
		}
		throw new Error('Supabase URL과 Anon Key가 설정되지 않았습니다.');
	}

	return createClient<Database>(url, anonKey, {
		auth: {
			storageKey: 'pickid-auth',
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: true,
		},
	});
}

export const supabase = createSupabaseClient();

export type SupabaseClient = typeof supabase;
