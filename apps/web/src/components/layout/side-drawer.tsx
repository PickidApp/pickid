'use client';

import Link from 'next/link';
import { Drawer, DrawerContent, IconButton } from '@pickid/ui';
import { LogIn, LogOut, User } from 'lucide-react';
import { useAuthQuery, useLogoutMutation } from '@/api/auth';
import { SIDE_MENU_ITEMS } from '@/constants';

interface ISideDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SideDrawer({ open, onOpenChange }: ISideDrawerProps) {
	const { data: user, isLoading } = useAuthQuery();
	const logoutMutation = useLogoutMutation();

	const handleClose = () => onOpenChange(false);

	const handleLogout = () => {
		logoutMutation.mutate(undefined, {
			onSuccess: () => {
				handleClose();
			},
		});
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className="h-full">
				<div className="flex flex-col h-full bg-white">
					{user && (
						<div className="px-6 pt-8 pb-6 border-b border-neutral-200">
							{isLoading ? <ProfileSkeleton /> : <LoggedInProfile email={user.email ?? ''} />}
						</div>
					)}

					{!user && !isLoading && (
						<div className="px-6 pt-8 pb-6 border-b border-neutral-200">
							<IconButton
								asChild
								icon={<LogIn className="w-5 h-5" />}
								text="로그인하러 가기"
								variant="default"
								className="w-full rounded-xl h-12"
							>
								<Link href="/auth/login" onClick={handleClose}>
									<LogIn className="w-5 h-5" />
									로그인하러 가기
								</Link>
							</IconButton>
						</div>
					)}

					<nav className="flex-1 overflow-y-auto py-4">
						<div className="px-6 mb-6">
							<h3 className="text-xs text-neutral-500 uppercase tracking-wider mb-3 font-medium">메뉴</h3>
							<ul className="space-y-1">
								{SIDE_MENU_ITEMS.map((item) => {
									const Icon = item.icon;
									return (
										<li key={item.href}>
											<Link
												href={item.href}
												className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
												onClick={handleClose}
											>
												<Icon className="w-4 h-4 text-neutral-600" />
												<span className="text-sm text-neutral-800">{item.label}</span>
											</Link>
										</li>
									);
								})}
							</ul>
						</div>
					</nav>

					{user && (
						<div className="px-6 py-4 border-t border-neutral-200">
							<IconButton
								icon={<LogOut className="w-4 h-4" />}
								text="로그아웃"
								variant="ghost"
								className="w-full text-neutral-600"
								onClick={handleLogout}
								disabled={logoutMutation.isPending}
							/>
						</div>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
}

function ProfileSkeleton() {
	return (
		<div className="animate-pulse">
			<div className="flex items-center gap-4">
				<div className="w-14 h-14 rounded-full bg-neutral-200" />
				<div className="flex-1">
					<div className="h-5 bg-neutral-200 rounded w-24 mb-2" />
					<div className="h-4 bg-neutral-200 rounded w-32" />
				</div>
			</div>
		</div>
	);
}

function LoggedInProfile({ email }: { email: string }) {
	const displayName = email.split('@')[0];

	return (
		<>
			<div className="flex items-center gap-4 mb-4">
				<div className="w-14 h-14 rounded-full border-2 border-neutral-200 bg-neutral-100 flex items-center justify-center">
					<User className="w-7 h-7 text-neutral-400" />
				</div>
				<div className="flex-1 min-w-0">
					<h2 className="text-lg font-semibold text-neutral-900 truncate">{displayName}</h2>
					<p className="text-sm text-neutral-500 truncate">{email}</p>
				</div>
			</div>
			<div className="flex gap-2">
				<div className="flex-1 bg-neutral-50 rounded-lg px-3 py-2 text-center">
					<div className="text-lg font-semibold text-neutral-900">0</div>
					<div className="text-xs text-neutral-500">완료한 테스트</div>
				</div>
				<div className="flex-1 bg-neutral-50 rounded-lg px-3 py-2 text-center">
					<div className="text-lg font-semibold text-neutral-900">0</div>
					<div className="text-xs text-neutral-500">저장한 결과</div>
				</div>
			</div>
		</>
	);
}
