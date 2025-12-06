export type { UserTabType } from '@/types/user';

export const USER_STATUSES = [
	{ value: 'active', label: '활성' },
	{ value: 'inactive', label: '비활성' },
	{ value: 'deleted', label: '탈퇴' },
];

export const USER_PROVIDERS = [
	{ value: 'email', label: '이메일' },
	{ value: 'google', label: '구글' },
	{ value: 'kakao', label: '카카오' },
];

export const USER_TABS = [
	{ id: 'basic', label: '기본 정보' },
	{ id: 'responses', label: '테스트 참여' },
];

