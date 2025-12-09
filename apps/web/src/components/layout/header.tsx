'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { cn } from '@pickid/shared';
import { IconButton } from '@pickid/ui';
import { useScrollVisibility } from '@/hooks/use-scroll-visibility';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
	const isVisible = useScrollVisibility();

	return (
		<header
			className={cn(
				'fixed top-0 left-0 right-0 max-w-[430px] mx-auto',
				'bg-white border-b border-neutral-100 z-50',
				'transition-transform duration-300 ease-out',
				isVisible ? 'translate-y-0' : '-translate-y-full'
			)}
		>
			<div className="flex items-center justify-between px-4 h-12">
				<Link href="/">
					<Image
						src="/images/logo.svg"
						alt="PickID"
						width={56}
						height={18}
						priority
						className="h-[18px] w-auto"
					/>
				</Link>
				<IconButton
					icon={<Menu className="w-5 h-5" />}
					onClick={onMenuClick}
					aria-label="메뉴 열기"
					className="rounded-full"
				/>
			</div>
		</header>
	);
}
