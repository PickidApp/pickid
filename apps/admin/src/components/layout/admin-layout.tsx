import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';
import { PATH } from '@/constants/routes';

const HIDE_HEADER_PATHS = [PATH.TEST_CREATE, '/tests/'];

export function AdminLayout() {
	const navigate = useNavigate();
	const location = useLocation();
	const { adminUser, logout, loading } = useAdminAuth();

	const shouldHideHeader = HIDE_HEADER_PATHS.some((path) => location.pathname.startsWith(path));

	const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
		const saved = localStorage.getItem('admin.sidebarCollapsed');
		if (saved !== null) return saved === '1';
		return window.matchMedia('(max-width: 1024px)').matches;
	});

	useEffect(() => {
		localStorage.setItem('admin.sidebarCollapsed', sidebarCollapsed ? '1' : '0');
	}, [sidebarCollapsed]);

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

			<div className="flex-1 flex flex-col overflow-hidden">
				{!shouldHideHeader && <AdminHeader />}

				<main className="flex-1 overflow-auto bg-white">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
