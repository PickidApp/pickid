'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@pickid/shared';

interface IBannerItem {
	image: string;
	href?: string;
	alt?: string;
}

interface BannerCarouselProps {
	images: IBannerItem[];
	className?: string;
	autoPlay?: boolean;
	autoPlayInterval?: number;
	loop?: boolean;
	showDots?: boolean;
	dotsPosition?: 'bottom-center' | 'bottom-right';
	aspectRatio?: 'auto' | '3/2' | '16/9' | '4/3' | '1/1';
	onItemClick?: (index: number, item: IBannerItem) => void;
}

export function BannerCarousel(props: BannerCarouselProps) {
	const {
		images,
		className,
		autoPlay = false,
		autoPlayInterval = 5000,
		loop = true,
		showDots = true,
		dotsPosition = 'bottom-center',
		aspectRatio = 'auto',
		onItemClick,
	} = props;

	const [emblaRef, emblaApi] = useEmblaCarousel(
		{ loop, dragFree: false },
		autoPlay ? [Autoplay({ delay: autoPlayInterval, stopOnInteraction: false })] : []
	);

	const [selectedIndex, setSelectedIndex] = React.useState(0);

	const scrollTo = React.useCallback(
		(index: number) => {
			if (emblaApi) emblaApi.scrollTo(index);
		},
		[emblaApi]
	);

	const onSelect = React.useCallback(() => {
		if (!emblaApi) return;
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	React.useEffect(() => {
		if (!emblaApi) return;
		onSelect();
		emblaApi.on('select', onSelect);
		emblaApi.on('reInit', onSelect);

		return () => {
			emblaApi.off('select', onSelect);
			emblaApi.off('reInit', onSelect);
		};
	}, [emblaApi, onSelect]);

	const handleItemClick = (index: number, item: IBannerItem) => {
		if (onItemClick) {
			onItemClick(index, item);
		}
	};

	if (images.length === 0) return null;

	const aspectRatioClass = {
		auto: '',
		'3/2': 'aspect-[3/2]',
		'16/9': 'aspect-video',
		'4/3': 'aspect-[4/3]',
		'1/1': 'aspect-square',
	}[aspectRatio];

	const dotsPositionClass = {
		'bottom-center': 'bottom-3 left-1/2 -translate-x-1/2',
		'bottom-right': 'bottom-3 right-4',
	}[dotsPosition];

	return (
		<div className={cn('relative w-full overflow-hidden', aspectRatioClass, className)}>
			<div ref={emblaRef} className="overflow-hidden h-full">
				<div className="flex h-full">
					{images.map((item, index) => {
						const content = (
							<img
								src={item.image}
								alt={item.alt || `슬라이드 ${index + 1}`}
								className="w-full h-full object-cover"
							/>
						);

						return (
							<div
								key={index}
								className={cn(
									'flex-[0_0_100%] min-w-0 h-full',
									(item.href || onItemClick) && 'cursor-pointer'
								)}
								onClick={() => handleItemClick(index, item)}
							>
								{item.href ? (
									<a href={item.href} className="block w-full h-full">
										{content}
									</a>
								) : (
									content
								)}
							</div>
						);
					})}
				</div>
			</div>

			{showDots && images.length > 1 && (
				<div className={cn('absolute flex gap-1', dotsPositionClass)}>
					{images.map((_, index) => (
						<button
							key={index}
							onClick={() => scrollTo(index)}
							className={cn(
								'w-1.5 h-1.5 rounded-full transition-all duration-200',
								selectedIndex === index
									? 'bg-white/90 w-3'
									: 'bg-white/40 hover:bg-white/60'
							)}
							aria-label={`슬라이드 ${index + 1}로 이동`}
							type="button"
						/>
					))}
				</div>
			)}
		</div>
	);
}
