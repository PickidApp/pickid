import { useState } from 'react';
import type { Test, TestType, TestStatus, TestInsert } from '@pickid/supabase';
import { TEST_TYPES, TEST_STATUSES } from '@/constants/test';
import { Button, Input, Textarea, Switch, FormField, BaseSelect } from '@pickid/ui';
import { ImageUpload } from '@/components/common/image-upload';
import { useCategoriesQuery } from '@/api/queries';
import { generateSlug } from '@/utils';

type TestPayload = Omit<TestInsert, 'id' | 'created_at' | 'updated_at'> & {
	id?: string;
	category_ids?: string[];
};

interface TestFormProps {
	initialData?: Test | TestPayload;
	initialCategoryIds?: string[];
	onSubmit: (data: TestPayload) => void;
	isSubmitting?: boolean;
	submitButtonText?: string;
}

export function TestForm(props: TestFormProps) {
	const { initialData, initialCategoryIds, onSubmit, isSubmitting, submitButtonText } = props;

	const [title, setTitle] = useState(initialData?.title || '');
	const [description, setDescription] = useState(initialData?.description || '');
	const [type, setType] = useState<TestType>(initialData?.type || 'psychology');
	const [status, setStatus] = useState<TestStatus>(initialData?.status || 'draft');
	const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || '');
	const [introText, setIntroText] = useState(initialData?.intro_text || '');
	const [estimatedTime, setEstimatedTime] = useState<number>(initialData?.estimated_time_minutes || 5);
	const [requiresGender, setRequiresGender] = useState(initialData?.requires_gender || false);
	const [categoryId, setCategoryId] = useState<string>(initialCategoryIds?.[0] || '');

	const { data: categoriesData } = useCategoriesQuery({ status: 'active' });
	const categoryOptions = (categoriesData?.categories || []).map((cat) => ({
		value: cat.id,
		label: cat.name,
	}));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const timestamp = Date.now().toString(36);
		const slug = initialData?.slug || generateSlug(title, timestamp);

		const payload: TestPayload = {
			id: initialData?.id,
			title,
			description: description || undefined,
			slug,
			type,
			status,
			thumbnail_url: thumbnailUrl || undefined,
			intro_text: introText || undefined,
			estimated_time_minutes: estimatedTime,
			requires_gender: requiresGender,
			category_ids: categoryId ? [categoryId] : [],
		};

		onSubmit(payload);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-4">
				<FormField label="제목" htmlFor="title" required>
					<Input
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="테스트 제목을 입력하세요"
						required
					/>
				</FormField>

				<FormField label="설명" htmlFor="description">
					<Textarea
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="테스트 설명을 입력하세요"
						rows={3}
					/>
				</FormField>

				<div className="grid grid-cols-2 gap-4">
					<FormField label="타입" htmlFor="type" required>
						<BaseSelect
							id="type"
							value={type}
							onValueChange={(value: string) => setType(value as TestType)}
							options={TEST_TYPES}
							placeholder="타입을 선택해주세요"
						/>
					</FormField>

					<FormField label="카테고리" htmlFor="category">
						<BaseSelect
							id="category"
							value={categoryId}
							onValueChange={(value: string) => setCategoryId(value)}
							options={categoryOptions}
							placeholder="카테고리를 선택해주세요"
						/>
					</FormField>
				</div>

				<FormField label="상태" htmlFor="status">
					<BaseSelect
						id="status"
						value={status}
						onValueChange={(value: string) => setStatus(value as TestStatus)}
						options={TEST_STATUSES}
						placeholder="상태를 선택해주세요"
					/>
				</FormField>

				<ImageUpload
					label="썸네일"
					value={thumbnailUrl}
					onChange={(url) => setThumbnailUrl(url || '')}
					folder="thumbnails"
					maxSizeMB={3}
					disabled={isSubmitting}
				/>

				<FormField label="소개 텍스트" htmlFor="introText">
					<Textarea
						id="introText"
						value={introText}
						onChange={(e) => setIntroText(e.target.value)}
						placeholder="테스트 시작 전 표시할 소개 텍스트"
						rows={2}
					/>
				</FormField>

				<FormField label="예상 소요 시간 (분)" htmlFor="estimatedTime">
					<Input
						id="estimatedTime"
						type="number"
						value={estimatedTime}
						onChange={(e) => setEstimatedTime(Number(e.target.value))}
						min={1}
						max={60}
					/>
				</FormField>

				<FormField label="성별 입력 필요">
					<div className="flex justify-end">
						<Switch checked={requiresGender} onCheckedChange={setRequiresGender} />
					</div>
				</FormField>
			</div>

			<div className="flex items-center justify-end pt-6 border-t border-neutral-200">
				<Button
					type="submit"
					disabled={isSubmitting || !title}
					loading={isSubmitting}
					text={submitButtonText || (initialData ? '수정하기' : '생성하기')}
				/>
			</div>
		</form>
	);
}
