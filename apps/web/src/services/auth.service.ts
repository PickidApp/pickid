import { createClient } from '@/lib/supabase/client';

export const authService = {
	async getUser() {
		const supabase = createClient();
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error) throw error;
		return user;
	},

	async signOut() {
		const supabase = createClient();
		const { error } = await supabase.auth.signOut();

		if (error) throw error;
	},
};
