import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isActivePath, navigation } from '@/config/navigation';
import { IconButton, Button } from '@pickid/ui';
import { cn } from '@pickid/shared';
import 'dayjs/locale/ko';

interface AdminUser {
	email?: string;
}

interface AdminSidebarProps {
	sidebarCollapsed: boolean;
	onToggleSidebar: () => void;
	user: AdminUser | null;
	onLogout: () => void;
}

function NavSectionComponent({ name, isCollapsed }: { name: string; isCollapsed: boolean }) {
	if (isCollapsed) return null;
	return (
		<div className="px-2 py-1.5 text-xs font-medium text-neutral-500 tracking-wide uppercase transition-[margin,opacity] duration-200 ease-linear">
			{name}
		</div>
	);
}

function NavItemComponent({
	entry,
	isActive,
	isCollapsed,
}: {
	entry: {
		name: string;
		href: string;
		icon: React.ReactNode;
		description?: string;
		badge?: string | number;
	};
	isActive: boolean;
	isCollapsed: boolean;
}) {
	return (
		<Link
			to={entry.href}
			className={cn(
				'group/menu-item relative flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 py-2 text-sm outline-hidden transition-[width,height,padding] duration-200 ease-linear',
				'hover:bg-neutral-100 hover:text-neutral-900',
				'focus-visible:ring-2 focus-visible:ring-neutral-200',
				'active:bg-neutral-100 active:text-neutral-900',
				isActive && 'bg-neutral-100 font-medium text-neutral-900',
				isCollapsed && 'size-8 justify-center p-2'
			)}
			aria-current={isActive ? 'page' : undefined}
			title={isCollapsed ? entry.name : undefined}
		>
			<div className="flex shrink-0 items-center justify-center text-neutral-600 [&>svg]:size-4 [&>svg]:shrink-0">
				{entry.icon}
			</div>
			{!isCollapsed && (
				<div className="flex min-w-0 flex-1 items-center justify-between gap-2">
					<span className="truncate">{entry.name}</span>
					{entry.badge && (
						<span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-neutral-500 px-1 text-xs font-medium text-white tabular-nums">
							{entry.badge}
						</span>
					)}
				</div>
			)}
		</Link>
	);
}

export function AdminSidebar({ sidebarCollapsed, onToggleSidebar, user, onLogout }: AdminSidebarProps) {
	const location = useLocation();
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setUserMenuOpen(false);
			}
		};

		if (userMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [userMenuOpen]);

	const handleToggleMenu = () => {
		setUserMenuOpen((prev) => !prev);
	};

	const handleLogout = () => {
		setUserMenuOpen(false);
		onLogout();
	};

	const renderNavItems = () => {
		const items: React.ReactNode[] = [];
		let sectionIndex = 0;

		navigation.forEach((entry, idx) => {
			if (entry.type === 'section') {
				if (idx > 0) {
					items.push(<li key={`divider-${sectionIndex}`} className="my-2 border-t border-neutral-200" />);
				}
				items.push(
					<li key={`section-${entry.name}`}>
						<NavSectionComponent name={entry.name} isCollapsed={sidebarCollapsed} />
					</li>
				);
				sectionIndex++;
				return;
			}

			if (entry.type === 'item' && entry.href) {
				const isActive = isActivePath(location.pathname, entry);
				items.push(
					<li key={entry.name} className="group/menu-item relative">
						<NavItemComponent
							entry={{
								name: entry.name,
								href: entry.href,
								icon: entry.icon,
								description: entry.description,
								badge: entry.badge,
							}}
							isActive={isActive}
							isCollapsed={sidebarCollapsed}
						/>
					</li>
				);
			}
		});

		return items;
	};

	return (
		<aside
			className={cn(
				'group peer flex h-full flex-col border-r border-neutral-200 bg-white text-neutral-900 transition-[width] duration-200 ease-linear',
				sidebarCollapsed ? 'w-16' : 'w-56'
			)}
			data-state={sidebarCollapsed ? 'collapsed' : 'expanded'}
			aria-label="사이드바 내비게이션"
		>
			<div className="flex h-full flex-col">
				<div className="flex flex-col gap-2 border-b border-neutral-200 p-2">
					<div className="flex items-center justify-between gap-2 px-2 py-1.5">
						<div className="flex items-center gap-2 min-w-0">
							<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900">
								<span className="text-sm font-bold text-white">P</span>
							</div>
							{!sidebarCollapsed && (
								<div className="flex min-w-0 flex-col">
									<div className="truncate text-sm font-semibold text-neutral-900">PickID</div>
									<div className="truncate text-xs text-neutral-500">Admin</div>
								</div>
							)}
						</div>
						<IconButton
							icon={sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
							onClick={onToggleSidebar}
							variant="ghost"
							size="icon"
							className="shrink-0 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
							aria-label="사이드바 토글"
						/>
					</div>
				</div>

				<nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2">
					<ul className="flex min-w-0 flex-col gap-1">{renderNavItems()}</ul>
				</nav>

				<div className="flex flex-col gap-2 border-t border-neutral-200 p-2">
					<div className="relative" ref={menuRef}>
						<button
							onClick={handleToggleMenu}
							className={cn(
								'flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
								'hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300',
								sidebarCollapsed && 'justify-center'
							)}
							aria-haspopup="menu"
							aria-expanded={userMenuOpen}
							aria-label="사용자 메뉴"
						>
							<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
								{user?.email?.charAt(0).toUpperCase() || 'A'}
							</div>
							{!sidebarCollapsed && (
								<div className="flex min-w-0 flex-1 flex-col text-left">
									<p className="truncate text-xs font-medium text-neutral-900">관리자</p>
									<p className="truncate text-xs text-neutral-500">{user?.email}</p>
								</div>
							)}
						</button>

						{userMenuOpen && (
							<div
								role="menu"
								className={cn(
									'absolute bottom-full left-0 mb-2 w-full bg-white rounded-md shadow-lg py-1 z-50 border border-neutral-100',
									sidebarCollapsed && 'left-auto right-0 w-48'
								)}
							>
								<Button
									onClick={handleLogout}
									role="menuitem"
									variant="ghost"
									className="w-full justify-start text-red-600 hover:bg-neutral-50 hover:text-red-600"
									text="로그아웃"
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</aside>
	);
}
