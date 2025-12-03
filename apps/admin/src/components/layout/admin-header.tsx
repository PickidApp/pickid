import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { navigation, isActivePath, type NavEntry } from '@/config/navigation';
import { PATH } from '@/constants/routes';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Button } from '@pickid/ui';

interface AdminUser {
	email?: string;
}

interface IAdminHeaderProps {
	user: AdminUser | null;
	onLogout: () => void;
}

export function AdminHeader({ user, onLogout }: IAdminHeaderProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const menuRef = useRef<HTMLDivElement>(null);

	const currentMeta = navigation.find((n) => n.type === 'item' && isActivePath(location.pathname, n)) as
		| Extract<NavEntry, { type: 'item' }>
		| undefined;

	const meta = currentMeta ?? (navigation[0] as Extract<NavEntry, { type: 'item' }>);
	const showCreateTestCTA = location.pathname === PATH.TESTS || location.pathname.startsWith('/tests/');
	const isDashboard = location.pathname === PATH.INDEX || location.pathname === '/';

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

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const handleCreateTest = () => {
		navigate(PATH.TEST_CREATE);
	};

	const handleToggleMenu = () => {
		setUserMenuOpen((prev) => !prev);
	};

	const handleLogout = () => {
		setUserMenuOpen(false);
		onLogout();
	};

	return (
		<header className="bg-white border-b border-neutral-200 px-8 py-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl text-neutral-900">{meta.name}</h2>
					{isDashboard && (
						<p className="text-sm text-neutral-500 mt-1">테스트, 사용자, 응답 통계를 한눈에 확인하세요</p>
					)}
				</div>

				<div className="flex items-center gap-4">
					{showCreateTestCTA && (
						<Button onClick={handleCreateTest} className="hidden sm:inline-flex" title="테스트 만들기">
							<Plus className="w-4 h-4" />
							<span>테스트 만들기</span>
						</Button>
					)}

					<div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
						<div className="text-right">
							<p className="text-sm text-neutral-900">{dayjs(currentTime).locale('ko').format('YYYY년 M월 D일')}</p>
							<p className="text-xs text-neutral-500">{dayjs(currentTime).locale('ko').format('A h:mm')}</p>
						</div>
					</div>

					<div className="relative" ref={menuRef}>
						<button
							onClick={handleToggleMenu}
							className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300"
							aria-haspopup="menu"
							aria-expanded={userMenuOpen}
							aria-label="사용자 메뉴"
						>
							<div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center text-white font-semibold">
								{user?.email?.charAt(0).toUpperCase() || 'A'}
							</div>
							<div className="hidden sm:block text-left">
								<p className="text-sm font-medium text-neutral-900">관리자</p>
								<p className="text-xs text-neutral-500 truncate max-w-[120px]">{user?.email}</p>
							</div>
						</button>

						{userMenuOpen && (
							<div
								role="menu"
								className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-neutral-100"
							>
								<Button
									onClick={handleLogout}
									role="menuitem"
									variant="ghost"
									className="w-full justify-start text-red-600 hover:bg-neutral-50 hover:text-red-600"
								>
									로그아웃
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
