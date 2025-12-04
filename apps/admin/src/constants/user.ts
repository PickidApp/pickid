import type { UserStatus, UserProvider } from '@/services/user.service';

export const USER_STATUSES: { value: UserStatus; label: string }[] = [
	{ value: 'active', label: '활성' },
	{ value: 'inactive', label: '비활성' },
	{ value: 'deleted', label: '탈퇴' },
];

export const USER_PROVIDERS: { value: UserProvider; label: string }[] = [
	{ value: 'email', label: '이메일' },
	{ value: 'google', label: '구글' },
	{ value: 'kakao', label: '카카오' },
];
