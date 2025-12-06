export const FEEDBACK_STATUSES = [
	{ value: 'new', label: '신규', color: 'bg-red-50 text-red-700 border-red-200' },
	{ value: 'in_progress', label: '처리중', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
	{ value: 'resolved', label: '완료', color: 'bg-green-50 text-green-700 border-green-200' },
	{ value: 'rejected', label: '보류', color: 'bg-neutral-50 text-neutral-700 border-neutral-200' },
];

export const FEEDBACK_CATEGORIES = [
	{ value: 'bug', label: '버그' },
	{ value: 'feature', label: '기능 제안' },
	{ value: 'ui', label: 'UI/UX' },
	{ value: 'etc', label: '기타' },
];
