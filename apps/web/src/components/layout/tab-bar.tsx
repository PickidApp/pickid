'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@pickid/shared';
import { BOTTOM_NAV_ITEMS } from '@/constants';

export function TabBar() {
	const pathname = usePathname();

	const isActive = (href: string) => {
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	};

	return (
		<nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-neutral-100 z-50">
			<div className="flex items-center h-14 px-2">
				{BOTTOM_NAV_ITEMS.map((item) => {
					const active = isActive(item.href);
					const Icon = item.icon;

					return (
						<Link
							key={item.href}
							href={item.href}
							className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 group"
						>
							<span
								className={cn(
									'flex items-center justify-center w-10 h-7',
									'transition-transform duration-150 ease-out',
									'group-active:scale-90'
								)}
							>
								<Icon
									className={cn(
										'w-[22px] h-[22px] transition-colors duration-150',
										active ? 'text-neutral-900' : 'text-neutral-400'
									)}
									strokeWidth={active ? 2 : 1.5}
								/>
							</span>
							<span
								className={cn(
									'text-[10px] transition-colors duration-150',
									active ? 'text-neutral-900 font-semibold' : 'text-neutral-400 font-medium'
								)}
							>
								{item.label}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
