import { Home, FileText, FolderOpen, Users, MessageSquare, BarChart3, TrendingUp } from 'lucide-react';
import { PATH } from '@/constants/routes';

export const navigation = [
	{
		title: '',
		items: [{ name: '대시보드', href: PATH.INDEX, icon: <Home className="w-4 h-4" /> }],
	},
	{
		title: '콘텐츠',
		items: [
			{ name: '테스트 관리', href: PATH.TESTS, icon: <FileText className="w-4 h-4" /> },
			{ name: '카테고리 관리', href: PATH.CATEGORIES, icon: <FolderOpen className="w-4 h-4" /> },
		],
	},
	{
		title: '사용자',
		items: [
			{ name: '사용자 관리', href: PATH.USERS, icon: <Users className="w-4 h-4" /> },
			{ name: '피드백', href: PATH.FEEDBACKS, icon: <MessageSquare className="w-4 h-4" /> },
		],
	},
	{
		title: '분석',
		items: [
			{ name: '테스트 성과 분석', href: PATH.ANALYTICS, icon: <BarChart3 className="w-4 h-4" /> },
			{ name: '성장 지표 분석', href: PATH.GROWTH, icon: <TrendingUp className="w-4 h-4" /> },
		],
	},
];

export function isActivePath(currentPath: string, href: string): boolean {
	if (href === PATH.INDEX) return currentPath === PATH.INDEX;
	return currentPath.startsWith(href);
}
