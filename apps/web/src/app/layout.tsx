'use client';

import { useState } from 'react';
import './globals.css';
import { Providers } from './providers';
import { Header, SideDrawer, TabBar } from '@/components/layout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

	const handleMenuOpen = () => {
		setIsSideMenuOpen(true);
	};

	return (
		<html lang="ko">
			<body className="bg-gradient-to-br from-slate-100 via-blue-100/40 to-indigo-100/50">
				<Providers>
					<div className="relative mx-auto max-w-[430px] min-h-screen bg-white shadow-2xl shadow-slate-200/50">
						<Header onMenuClick={handleMenuOpen} />
						<main className="pt-12 pb-14">{children}</main>
						<TabBar />
						<SideDrawer open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen} />
					</div>
				</Providers>
			</body>
		</html>
	);
}
