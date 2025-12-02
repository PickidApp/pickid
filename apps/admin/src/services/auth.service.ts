import { supabase } from '@/lib/supabase/client';

export interface AdminUser {
	email?: string;
	id?: string;
}

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
			const { data, error } = await supabase.rpc('is_admin', { uid: userId } as any);

			if (error) {
				const session = await supabase.auth.getSession();
				const token = session.data.session?.access_token;

				if (!token) {
					return false;
				}

				const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/is_admin`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ uid: userId }),
				});

				if (!response.ok) {
					return false;
				}

				const result = await response.json();
				return result === true;
			}

			return data === true;
		} catch (error) {
			console.error('[AuthService] checkIsAdmin 에러:', error);
			return false;
		}
	},
};
