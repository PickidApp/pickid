export const FEEDBACK_STATUSES = [
	{ value: 'new', label: '신규' },
	{ value: 'in_progress', label: '처리중' },
	{ value: 'resolved', label: '완료' },
	{ value: 'rejected', label: '보류' },
];

export const FEEDBACK_CATEGORIES = [
	{ value: 'bug', label: '버그' },
	{ value: 'feature', label: '기능 제안' },
	{ value: 'ui', label: 'UI/UX' },
	{ value: 'etc', label: '기타' },
];

export const FEEDBACK_CATEGORY_LABELS = {
	bug: '버그',
	feature: '기능 제안',
	ui: 'UI/UX',
	etc: '기타',
};

export const FEEDBACK_STATUS_LABELS = {
	new: '신규',
	in_progress: '처리중',
	resolved: '완료',
	rejected: '보류',
};

export const FEEDBACK_STATUS_COLORS = {
	new: 'bg-red-50 text-red-700 border-red-200',
	in_progress: 'bg-yellow-50 text-yellow-700 border-yellow-200',
	resolved: 'bg-green-50 text-green-700 border-green-200',
	rejected: 'bg-neutral-50 text-neutral-700 border-neutral-200',
};
