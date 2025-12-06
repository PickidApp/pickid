import { Outlet, useNavigate } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks';
import { AdminSidebar } from './admin-sidebar';
import { PageLoadingSkeleton } from '@/components/common';
import { PATH } from '@/constants/routes';

export function AdminLayout() {
	const navigate = useNavigate();
	const { adminUser, logout, loading } = useAdminAuth();

	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	useEffect(() => {
		if (!loading && !adminUser) {
			navigate(PATH.AUTH, { replace: true });
		}
	}, [adminUser, loading, navigate]);

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
			</div>
		);
	}

	if (!adminUser) {
		return null;
	}

	const handleToggleSidebar = () => {
		setSidebarCollapsed((prev) => !prev);
	};

	return (
		<div className="flex h-screen bg-white">
			<AdminSidebar
				sidebarCollapsed={sidebarCollapsed}
				onToggleSidebar={handleToggleSidebar}
				user={adminUser}
				onLogout={logout}
			/>

			<main className="flex-1 overflow-auto bg-neutral-50">
				<Suspense fallback={<PageLoadingSkeleton />}>
					<Outlet />
				</Suspense>
			</main>
		</div>
	);
}
