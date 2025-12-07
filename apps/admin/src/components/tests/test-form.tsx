import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Test } from '@pickid/supabase';
import { TEST_TYPES, TEST_STATUSES, RECOMMENDED_SLOTS, PRODUCTION_PRIORITIES } from '@/constants/test';
import { Button, Input, Textarea, Switch, FormField, DefaultSelect } from '@pickid/ui';
import { ImageUpload } from '@/components/common/image-upload';
import { useCategoriesQuery, useSeriesListQuery, useThemesListQuery } from '@/api';
import { generateSlug } from '@/utils';
import { testFormSchema, type TestFormData } from '@/schema/test.schema';
import type { TestPayload } from '@/types/test';

interface TestFormProps {
	initialData?: Test | TestPayload;
	initialCategoryIds?: string[];
	onSubmit: (data: TestPayload) => void;
	isSubmitting?: boolean;
	submitButtonText?: string;
}

export function TestForm(props: TestFormProps) {
	const { initialData, initialCategoryIds, onSubmit, isSubmitting, submitButtonText } = props;

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<TestFormData>({
		resolver: zodResolver(testFormSchema),
		defaultValues: {
			title: initialData?.title ?? '',
			description: initialData?.description ?? '',
			type: initialData?.type ?? 'psychology',
			status: initialData?.status ?? 'published',
			thumbnailUrl: initialData?.thumbnail_url ?? '',
			introText: initialData?.intro_text ?? '',
			estimatedTime: initialData?.estimated_time_minutes ?? 5,
			requiresGender: initialData?.requires_gender ?? false,
			categoryId: initialCategoryIds?.[0] ?? '',
			seriesId: initialData?.series_id ?? '',
			seriesOrder: initialData?.series_order ?? null,
			themeId: initialData?.theme_id ?? '',
			recommendedSlot: initialData?.recommended_slot ?? 'none',
			productionPriority: initialData?.production_priority ?? 'medium',
			targetReleaseDate: initialData?.target_release_date ?? '',
			operationMemo: initialData?.operation_memo ?? '',
		},
	});

	const formValues = watch();

	const { data: categoriesData } = useCategoriesQuery({ status: 'active' });
	const categoryOptions = (categoriesData?.categories || []).map((cat) => ({
		value: cat.id,
		label: cat.name,
	}));

	const { data: seriesList } = useSeriesListQuery();
	const seriesOptions = (seriesList || []).map((s) => ({
		value: s.id,
		label: `${s.name}${s.is_active ? '' : ' (비활성)'}`,
	}));

	const { data: themesList } = useThemesListQuery();
	const themesOptions = (themesList || []).map((t) => ({
		value: t.id,
		label: `${t.name}${t.is_active ? '' : ' (비활성)'}`,
	}));

	const handleFormSubmit = (data: TestFormData) => {
		const slug = initialData?.slug || generateSlug(data.title, Date.now().toString(36));

		const payload: TestPayload = {
			id: initialData?.id,
			title: data.title,
			slug,
			type: data.type,
			status: data.status,
			description: data.description || undefined,
			thumbnail_url: data.thumbnailUrl || undefined,
			intro_text: data.introText || undefined,
			estimated_time_minutes: data.estimatedTime,
			requires_gender: data.requiresGender,
			category_ids: data.categoryId ? [data.categoryId] : [],
			series_id: data.seriesId || null,
			series_order: data.seriesOrder,
			theme_id: data.themeId || null,
			recommended_slot: data.recommendedSlot,
			production_priority: data.productionPriority,
			target_release_date: data.targetReleaseDate || null,
			operation_memo: data.operationMemo || null,
		};

		onSubmit(payload);
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
			<div className="space-y-4">
				<FormField label="제목" htmlFor="title" required>
					<Input
						id="title"
						{...register('title')}
						placeholder="테스트 제목을 입력하세요"
						className={errors.title ? 'border-red-500' : ''}
					/>
					{errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
				</FormField>

				<FormField label="설명" htmlFor="description">
					<Textarea id="description" {...register('description')} placeholder="테스트 설명을 입력하세요" rows={3} />
				</FormField>

				<div className="grid grid-cols-2 gap-4">
					<FormField label="타입" htmlFor="type" required>
						<DefaultSelect
							id="type"
							value={formValues.type}
							onValueChange={(v) => setValue('type', v as TestFormData['type'])}
							options={TEST_TYPES}
							placeholder="타입 선택"
						/>
					</FormField>

					<FormField label="카테고리" htmlFor="category">
						<DefaultSelect
							id="category"
							value={formValues.categoryId}
							onValueChange={(v) => setValue('categoryId', v)}
							options={categoryOptions}
							placeholder="카테고리 선택"
						/>
					</FormField>
				</div>

				<FormField label="상태" htmlFor="status">
					<DefaultSelect
						id="status"
						value={formValues.status}
						onValueChange={(v) => setValue('status', v as TestFormData['status'])}
						options={TEST_STATUSES}
						placeholder="상태 선택"
					/>
				</FormField>

				<ImageUpload
					label="썸네일"
					value={formValues.thumbnailUrl ?? null}
					onChange={(url) => setValue('thumbnailUrl', url || '')}
					folder="thumbnails"
					maxSizeMB={3}
					disabled={isSubmitting}
				/>

				<FormField label="소개 텍스트" htmlFor="introText">
					<Textarea
						id="introText"
						{...register('introText')}
						placeholder="테스트 시작 전 표시할 소개 텍스트"
						rows={2}
					/>
				</FormField>

				<FormField label="예상 소요 시간 (분)" htmlFor="estimatedTime">
					<Input
						id="estimatedTime"
						type="number"
						{...register('estimatedTime', { valueAsNumber: true })}
						min={1}
						max={60}
					/>
				</FormField>

				<FormField label="성별 입력 필요">
					<div className="flex justify-end">
						<Switch checked={formValues.requiresGender} onCheckedChange={(v) => setValue('requiresGender', v)} />
					</div>
				</FormField>
			</div>

			{/* 콘텐츠 메타데이터 섹션 */}
			<div className="space-y-4 pt-6 border-t border-neutral-200">
				<h3 className="text-sm font-medium text-neutral-700">콘텐츠 메타데이터</h3>

				<div className="grid grid-cols-2 gap-4">
					<FormField label="시리즈" htmlFor="series">
						<DefaultSelect
							id="series"
							value={formValues.seriesId}
							onValueChange={(v) => setValue('seriesId', v)}
							options={seriesOptions}
							placeholder="시리즈 선택 (선택사항)"
						/>
					</FormField>

					{formValues.seriesId && (
						<FormField label="시리즈 내 순서" htmlFor="seriesOrder">
							<Input
								id="seriesOrder"
								type="number"
								value={formValues.seriesOrder ?? ''}
								onChange={(e) => setValue('seriesOrder', e.target.value ? Number(e.target.value) : null)}
								placeholder="1, 2, 3..."
								min={1}
							/>
						</FormField>
					)}
				</div>

				<div className="grid grid-cols-2 gap-4">
					<FormField label="테마" htmlFor="theme">
						<DefaultSelect
							id="theme"
							value={formValues.themeId}
							onValueChange={(v) => setValue('themeId', v)}
							options={themesOptions}
							placeholder="테마 선택 (선택사항)"
						/>
					</FormField>

					<FormField label="추천 슬롯" htmlFor="recommendedSlot">
						<DefaultSelect
							id="recommendedSlot"
							value={formValues.recommendedSlot}
							onValueChange={(v) => setValue('recommendedSlot', v as TestFormData['recommendedSlot'])}
							options={RECOMMENDED_SLOTS}
							placeholder="추천 슬롯 선택"
						/>
					</FormField>
				</div>
			</div>

			{/* 운영/제작 파이프라인 섹션 */}
			<div className="space-y-4 pt-6 border-t border-neutral-200">
				<h3 className="text-sm font-medium text-neutral-700">운영 메모</h3>

				<div className="grid grid-cols-2 gap-4">
					<FormField label="제작 우선순위" htmlFor="productionPriority">
						<DefaultSelect
							id="productionPriority"
							value={formValues.productionPriority}
							onValueChange={(v) => setValue('productionPriority', v as TestFormData['productionPriority'])}
							options={PRODUCTION_PRIORITIES}
							placeholder="우선순위 선택"
						/>
					</FormField>

					<FormField label="목표 출시일" htmlFor="targetReleaseDate">
						<Input id="targetReleaseDate" type="date" {...register('targetReleaseDate')} />
					</FormField>
				</div>

				<FormField label="운영 메모" htmlFor="operationMemo">
					<Textarea
						id="operationMemo"
						{...register('operationMemo')}
						placeholder="내부 관리용 메모 (예: 시험기간 전까지 발행, 밈 교체 예정 등)"
						rows={2}
					/>
				</FormField>
			</div>

			<div className="flex items-center justify-end pt-6 border-t border-neutral-200">
				<Button
					type="submit"
					disabled={isSubmitting}
					loading={isSubmitting}
					text={submitButtonText || (initialData ? '수정하기' : '생성하기')}
				/>
			</div>
		</form>
	);
}
