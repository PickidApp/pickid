export const FEEDBACK_CATEGORY_LABELS: Record<string, string> = {
	bug: '버그',
	feature: '기능 제안',
	ui: 'UI/UX',
	etc: '기타',
} as const;

export const FEEDBACK_STATUS_LABELS: Record<string, string> = {
	new: '신규',
	in_progress: '처리중',
	resolved: '완료',
	rejected: '보류',
} as const;

export const FEEDBACK_STATUS_COLORS: Record<string, string> = {
	new: 'bg-red-50 text-red-700 border-red-200',
	in_progress: 'bg-yellow-50 text-yellow-700 border-yellow-200',
	resolved: 'bg-green-50 text-green-700 border-green-200',
	rejected: 'bg-neutral-50 text-neutral-700 border-neutral-200',
} as const;
