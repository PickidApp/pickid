'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollVisibility(threshold = 50) {
	const [isVisible, setIsVisible] = useState(true);
	const lastScrollY = useRef(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > lastScrollY.current && currentScrollY > threshold) {
				setIsVisible(false);
			} else if (currentScrollY < lastScrollY.current) {
				setIsVisible(true);
			}

			lastScrollY.current = currentScrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [threshold]);

	return isVisible;
}
