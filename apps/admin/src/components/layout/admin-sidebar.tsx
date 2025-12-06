import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { navigation, isActivePath } from '@/config/navigation';
import { IconButton, Button } from '@pickid/ui';
import { cn } from '@pickid/shared';

interface AdminSidebarProps {
	sidebarCollapsed: boolean;
	onToggleSidebar: () => void;
	user: { email?: string } | null;
	onLogout: () => void;
}

export function AdminSidebar({ sidebarCollapsed, onToggleSidebar, user, onLogout }: AdminSidebarProps) {
	const location = useLocation();
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	const handleLogout = () => {
		setUserMenuOpen(false);
		onLogout();
	};

	const renderNavItem = (item: (typeof navigation)[number]['items'][number]) => {
		const isActive = isActivePath(location.pathname, item.href);

		return (
			<Link
				key={item.href}
				to={item.href}
				className={cn(
					'flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
					'hover:bg-neutral-100',
					isActive && 'bg-neutral-100 font-medium text-neutral-900',
					sidebarCollapsed && 'justify-center'
				)}
				title={sidebarCollapsed ? item.name : undefined}
			>
				<span className="text-neutral-600">{item.icon}</span>
				{!sidebarCollapsed && <span>{item.name}</span>}
			</Link>
		);
	};

	return (
		<aside
			className={cn(
				'flex h-full flex-col border-r border-neutral-200 bg-white transition-[width] duration-200',
				sidebarCollapsed ? 'w-16' : 'w-56'
			)}
		>
			{/* 헤더 */}
			<div
				className={cn(
					'border-b border-neutral-200 p-3',
					sidebarCollapsed ? 'flex flex-col items-center gap-2' : 'flex items-center justify-between gap-2'
				)}
			>
				<div className="flex items-center gap-2">
					<div className="flex size-8 items-center justify-center rounded-lg bg-neutral-900">
						<span className="text-sm font-bold text-white">P</span>
					</div>
					{!sidebarCollapsed && (
						<div>
							<div className="text-sm font-semibold">PickID</div>
							<div className="text-xs text-neutral-500">Admin</div>
						</div>
					)}
				</div>
				<IconButton
					icon={sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
					onClick={onToggleSidebar}
					variant="ghost"
					size="icon"
					aria-label="사이드바 토글"
				/>
			</div>

			<nav className="flex-1 overflow-auto p-2">
				{navigation.map((section, idx) => (
					<div key={section.title || idx} className={idx > 0 ? 'mt-4 border-t border-neutral-200 pt-4' : ''}>
						{section.title && !sidebarCollapsed && (
							<div className="mb-2 px-2 text-xs font-medium uppercase text-neutral-500">{section.title}</div>
						)}
						<div className="space-y-1">{section.items.map(renderNavItem)}</div>
					</div>
				))}
			</nav>

			<div className="border-t border-neutral-200 p-2">
				<button
					onClick={() => setUserMenuOpen(!userMenuOpen)}
					className={cn(
						'flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-neutral-100',
						sidebarCollapsed && 'justify-center'
					)}
				>
					<div className="flex size-8 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
						{user?.email?.charAt(0).toUpperCase() || 'A'}
					</div>
					{!sidebarCollapsed && (
						<div className="flex-1 text-left">
							<p className="text-xs font-medium">관리자</p>
							<p className="truncate text-xs text-neutral-500">{user?.email}</p>
						</div>
					)}
				</button>

				{userMenuOpen && (
					<div className="absolute bottom-16 left-2 right-2 rounded-md border bg-white py-1 shadow-lg">
						<Button
							onClick={handleLogout}
							variant="ghost"
							className="w-full justify-start text-red-600 hover:text-red-600"
							text="로그아웃"
						/>
					</div>
				)}
			</div>
		</aside>
	);
}
