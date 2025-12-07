import { z } from 'zod';

export const testFormSchema = z.object({
	title: z.string().min(1, '제목을 입력하세요'),
	description: z.string(),
	type: z.enum(['psychology', 'balance', 'quiz', 'other'] as const),
	status: z.enum(['draft', 'published', 'scheduled', 'archived'] as const),
	thumbnailUrl: z.string(),
	introText: z.string(),
	estimatedTime: z.number().min(1).max(60),
	requiresGender: z.boolean(),
	categoryId: z.string(),
	seriesId: z.string(),
	seriesOrder: z.number().nullable(),
	themeId: z.string(),
	recommendedSlot: z.enum(['none', 'today_pick', 'theme_pick'] as const),
	productionPriority: z.enum(['low', 'medium', 'high'] as const),
	targetReleaseDate: z.string(),
	operationMemo: z.string(),
});

export type TestFormData = z.infer<typeof testFormSchema>;
