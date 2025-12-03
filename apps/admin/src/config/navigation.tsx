import {
  Home,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  TrendingUp,
  FolderOpen,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { PATH } from '@/constants/routes';

export type NavEntry =
  | { type: 'section'; name: string }
  | {
      type: 'item';
      name: string;
      href: string;
      icon: ReactNode;
      description?: string;
      badge?: string | number;
    };

export const navigation: NavEntry[] = [
  {
    type: 'item',
    name: '대시보드',
    href: PATH.INDEX,
    icon: <Home className="w-4 h-4" />,
    description: '전체 현황',
  },
  {
    type: 'section',
    name: '콘텐츠 관리',
  },
  {
    type: 'item',
    name: '테스트',
    href: PATH.TESTS,
    icon: <FileText className="w-4 h-4" />,
    description: '테스트 관리',
  },
  {
    type: 'item',
    name: '카테고리',
    href: PATH.CATEGORIES,
    icon: <FolderOpen className="w-4 h-4" />,
    description: '카테고리 관리',
  },
  {
    type: 'section',
    name: '사용자 & 피드백',
  },
  {
    type: 'item',
    name: '사용자',
    href: PATH.USERS,
    icon: <Users className="w-4 h-4" />,
    description: '사용자 관리',
  },
  {
    type: 'item',
    name: '응답',
    href: PATH.RESPONSES,
    icon: <MessageSquare className="w-4 h-4" />,
    description: '사용자 응답',
  },
  {
    type: 'item',
    name: '피드백',
    href: PATH.FEEDBACKS,
    icon: <MessageSquare className="w-4 h-4" />,
    description: '사용자 피드백',
  },
  {
    type: 'section',
    name: '분석',
  },
  {
    type: 'item',
    name: '분석',
    href: PATH.ANALYTICS,
    icon: <BarChart3 className="w-4 h-4" />,
    description: '테스트 분석',
  },
  {
    type: 'item',
    name: '성장',
    href: PATH.GROWTH,
    icon: <TrendingUp className="w-4 h-4" />,
    description: '성장 지표',
  },
];

export function isActivePath(currentPath: string, entry: NavEntry): boolean {
  if (entry.type !== 'item' || !entry.href) return false;
  if (entry.href === PATH.INDEX) return currentPath === PATH.INDEX;
  return currentPath.startsWith(entry.href);
}

