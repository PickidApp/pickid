import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import type { AdminUser } from '@/types/auth';

interface AdminAuthContextType {
	adminUser: AdminUser | null;
	loading: boolean;
	isAdmin: boolean;
	login: (email: string, password: string) => Promise<{ success: boolean; error?: Error }>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
	const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async (): Promise<boolean> => {
		try {
			const user = await authService.getCurrentAdmin();

			setAdminUser(user);
			setIsAdmin(!!user);
			return !!user;
		} catch (error) {
			setAdminUser(null);
			setIsAdmin(false);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		try {
			await authService.login(email, password);

			await checkAuth();

			if (!isAdmin) {
				throw new Error('접근 권한이 없습니다. 관리자만 접근 가능합니다.');
			}

			return { success: true } as const;
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error : new Error('로그인에 실패했습니다'),
			} as const;
		}
	};

	const logout = async () => {
		try {
			await authService.logout();
		} finally {
			setAdminUser(null);
			setIsAdmin(false);
		}
	};

	return (
		<AdminAuthContext.Provider value={{ adminUser, loading, isAdmin, login, logout, checkAuth }}>
			{children}
		</AdminAuthContext.Provider>
	);
}

export function useAdminAuthContext() {
	const context = useContext(AdminAuthContext);
	if (!context) {
		throw new Error('useAdminAuthContext must be used within AdminAuthProvider');
	}
	return context;
}
