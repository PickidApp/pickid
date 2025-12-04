import { useState, useEffect } from 'react';
import type { Test, TestType, TestStatus } from '@pickid/supabase';
import type { TestPayload } from '@/services/test.service';
import { TEST_TYPES, TEST_STATUSES } from '@/constants/test';
import { Button, Input, Textarea, Switch, FormField, BaseSelect } from '@pickid/ui';
import { ImageUpload } from '@/components/common/image-upload';

interface TestFormProps {
	initialData?: Test | TestPayload;
	onSubmit: (data: TestPayload) => void;
	onCancel: () => void;
	isSubmitting?: boolean;
	submitButtonText?: string;
}

export function TestForm(props: TestFormProps) {
	const { initialData, onSubmit, onCancel, isSubmitting, submitButtonText } = props;

	const [title, setTitle] = useState(initialData?.title || '');
	const [description, setDescription] = useState(initialData?.description || '');
	const [slug, setSlug] = useState(initialData?.slug || '');
	const [type, setType] = useState<TestType>(initialData?.type || 'psychology');
	const [status, setStatus] = useState<TestStatus>(initialData?.status || 'draft');
	const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || '');
	const [introText, setIntroText] = useState(initialData?.intro_text || '');
	const [estimatedTime, setEstimatedTime] = useState<number>(initialData?.estimated_time_minutes || 5);
	const [requiresGender, setRequiresGender] = useState(initialData?.requires_gender || false);

	useEffect(() => {
		if (!initialData && title && !slug) {
			const generatedSlug = title
				.toLowerCase()
				.replace(/[^a-z0-9가-힣\s-]/g, '')
				.replace(/\s+/g, '-')
				.substring(0, 50);
			setSlug(generatedSlug);
		}
	}, [title, initialData, slug]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

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
		};

		onSubmit(payload);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-neutral-200">
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

					<FormField label="상태" htmlFor="status">
						<BaseSelect
							id="status"
							value={status}
							onValueChange={(value: string) => setStatus(value as TestStatus)}
							options={TEST_STATUSES}
							placeholder="상태를 선택해주세요"
						/>
					</FormField>
				</div>

				<FormField label="슬러그 (URL)" htmlFor="slug">
					<Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="test-slug" />
					<p className="text-xs text-neutral-500 mt-1">비워두면 제목에서 자동 생성됩니다</p>
				</FormField>

				<ImageUpload
					label="썸네일"
					value={thumbnailUrl}
					onChange={(url) => setThumbnailUrl(url || '')}
					bucket="test-thumbnails"
					folder="tests"
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

			<div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
				<Button type="submit" disabled={isSubmitting || !title}>
					{isSubmitting ? '저장 중...' : submitButtonText || (initialData ? '수정하기' : '생성하기')}
				</Button>
				<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} text="취소" />
			</div>
		</form>
	);
}
