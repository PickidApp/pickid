import { supabase } from '@/lib/supabase/client';
import type { AdminUser } from '@/types/auth';

export const authService = {
	async getCurrentAdmin(): Promise<AdminUser | null> {
		try {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			if (error || !user) {
				return null;
			}

			const isAdmin = await this.checkIsAdmin(user.id);

			if (!isAdmin) {
				await this.logout();
				return null;
			}

			return {
				email: user.email,
				id: user.id,
			};
		} catch (error) {
			console.error('[AuthService] getCurrentAdmin 에러:', error);
			return null;
		}
	},

	async login(email: string, password: string): Promise<void> {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			throw error;
		}
	},

	async logout(): Promise<void> {
		const { error } = await supabase.auth.signOut();

		if (error) {
			throw error;
		}
	},

	async checkIsAdmin(userId: string): Promise<boolean> {
		try {
			const { data, error } = await supabase.rpc('is_admin' as any, { uid: userId } as any) as any;

			if (error) {
				console.error('[AuthService] is_admin RPC 에러:', error);
				return false;
			}

			return data === true;
		} catch (error) {
			console.error('[AuthService] checkIsAdmin 에러:', error);
			return false;
		}
	},
};
