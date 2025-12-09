import { LayoutGrid, Bookmark, User, Brain, Scale, Flame, Home } from 'lucide-react';

export const BOTTOM_NAV_ITEMS = [
	{ href: '/', label: '홈', icon: Home },
	{ href: '/category', label: '카테고리', icon: LayoutGrid },
	{ href: '/collection', label: '모아보기', icon: Bookmark },
	{ href: '/mypage', label: '마이', icon: User },
];

export const SIDE_MENU_ITEMS = [
	{ href: '/tests?type=psychology', label: '심리 테스트', icon: Brain },
	{ href: '/tests?type=balance', label: '밸런스 게임', icon: Scale },
	{ href: '/tests?sort=popular', label: '인기 테스트', icon: Flame },
];
