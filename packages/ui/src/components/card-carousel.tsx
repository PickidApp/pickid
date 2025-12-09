'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@pickid/shared';

interface CardCarouselProps<T> {
	items: T[];
	renderItem: (item: T, index: number) => React.ReactNode;
	className?: string;
}

export function CardCarousel<T>(props: CardCarouselProps<T>) {
	const { items, renderItem, className } = props;

	const [emblaRef] = useEmblaCarousel({
		align: 'start',
		dragFree: true,
		containScroll: 'trimSnaps',
	});

	if (items.length === 0) return null;

	return (
		<div className={cn('w-full', className)}>
			<div ref={emblaRef} className="overflow-hidden">
				<div className="flex gap-3 px-4">
					{items.map((item, index) => (
						<div key={index} className="flex-shrink-0 basis-[70%]">
							{renderItem(item, index)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
