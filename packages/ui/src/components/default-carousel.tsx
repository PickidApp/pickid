'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@pickid/shared';
import { type LucideIcon } from 'lucide-react';

interface ICategoryItem {
	id: string;
	name: string;
	icon: LucideIcon;
	href?: string;
}

interface DefaultCarouselProps {
	items: ICategoryItem[];
	className?: string;
}

export function DefaultCarousel({ items, className }: DefaultCarouselProps) {
	const [emblaRef] = useEmblaCarousel({
		align: 'start',
		dragFree: true,
		containScroll: 'trimSnaps',
	});

	if (items.length === 0) return null;

	return (
		<div className={cn('w-full', className)}>
			<div ref={emblaRef} className="overflow-hidden">
				<div className="flex gap-2 px-4">
					{items.map((item) => {
						const Icon = item.icon;
						return (
							<a
								key={item.id}
								href={item.href ?? '#'}
								className="flex-shrink-0 flex flex-col items-center gap-1.5 w-16 active:scale-95 transition-transform"
							>
								<div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
									<Icon className="w-5 h-5 text-neutral-900" />
								</div>
								<span className="text-xs text-neutral-600 font-medium">{item.name}</span>
							</a>
						);
					})}
				</div>
			</div>
		</div>
	);
}
