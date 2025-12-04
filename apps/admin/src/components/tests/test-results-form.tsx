import { useState, useEffect } from 'react';
import type { TestType, ResultConditionType } from '@pickid/supabase';
import {
	Button,
	Input,
	Textarea,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	FormField,
	IconButton,
} from '@pickid/ui';
import { Plus, Trash2, MoveUp, MoveDown, X } from 'lucide-react';
import { RESULT_CONDITION_TYPES } from '@/constants/test';
import { ImageUpload } from '@/components/common/image-upload';
import { generateSlug } from '@/utils';

interface Feature {
	title: string;
	content: string;
}

interface Result {
	id?: string;
	order: number;
	name: string;
	slug?: string;
	description?: string;
	thumbnail_url?: string;
	condition_type: ResultConditionType;
	match_condition: Record<string, any>;
	metadata?: { features?: Feature[] };
}

interface TestResultsFormProps {
	testType: TestType;
	initialResults?: Result[];
	onSubmit: (results: Result[]) => void;
	onPrevious?: () => void;
	isSubmitting?: boolean;
	submitButtonText?: string;
}

/** 결과에서 features 배열 추출 */
const getFeatures = (result: Result): Feature[] => {
	return result.metadata?.features ?? [];
};

/** 빈 결과 생성 */
const createEmptyResult = (order: number, testType: TestType): Result => ({
	order,
	name: '',
	condition_type: testType === 'quiz' ? 'quiz_score' : 'choice_ratio',
	match_condition: {},
	metadata: { features: [] },
});

export function TestResultsForm(props: TestResultsFormProps) {
	const { testType, initialResults, onSubmit, onPrevious, isSubmitting, submitButtonText } = props;
	const [results, setResults] = useState<Result[]>(initialResults ?? [createEmptyResult(1, testType)]);

	useEffect(() => {
		if (initialResults && initialResults.length > 0) {
			setResults(initialResults);
		}
	}, [initialResults]);

	// ===== 결과 CRUD =====
	const addResult = () => {
		setResults([...results, createEmptyResult(results.length + 1, testType)]);
	};

	const removeResult = (index: number) => {
		const updated = results.filter((_, i) => i !== index);
		setResults(updated.map((r, i) => ({ ...r, order: i + 1 })));
	};

	const moveResult = (index: number, direction: 'up' | 'down') => {
		const targetIndex = direction === 'up' ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= results.length) return;

		const updated = [...results];
		[updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
		setResults(updated.map((r, i) => ({ ...r, order: i + 1 })));
	};

	const updateResult = (index: number, field: keyof Result, value: any) => {
		const updated = [...results];
		updated[index] = { ...updated[index], [field]: value };
		setResults(updated);
	};

	const updateMatchCondition = (index: number, field: string, value: any) => {
		const updated = [...results];
		const currentCondition = (updated[index].match_condition as Record<string, any>) ?? {};
		updated[index].match_condition = { ...currentCondition, [field]: value };
		setResults(updated);
	};

	// ===== 특징(features) CRUD =====
	const addFeature = (resultIndex: number) => {
		const updated = [...results];
		const features = [...getFeatures(updated[resultIndex]), { title: '', content: '' }];
		updated[resultIndex].metadata = { features } as any;
		setResults(updated);
	};

	const updateFeature = (resultIndex: number, featureIndex: number, field: keyof Feature, value: string) => {
		const updated = [...results];
		const features = [...getFeatures(updated[resultIndex])];
		features[featureIndex] = { ...features[featureIndex], [field]: value };
		updated[resultIndex].metadata = { features } as any;
		setResults(updated);
	};

	const removeFeature = (resultIndex: number, featureIndex: number) => {
		const updated = [...results];
		const features = getFeatures(updated[resultIndex]).filter((_, i) => i !== featureIndex);
		updated[resultIndex].metadata = { features } as any;
		setResults(updated);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const timestamp = Date.now().toString(36);
		const resultsWithSlug = results.map((result, index) => ({
			...result,
			slug: result.slug || generateSlug(result.name, `${index + 1}-${timestamp}`),
		}));
		onSubmit(resultsWithSlug);
	};

	const renderMatchConditionFields = (result: Result, index: number) => {
		switch (result.condition_type) {
			case 'quiz_score':
				return (
					<div className="grid grid-cols-2 gap-4">
						<FormField label="최소 점수">
							<Input
								type="number"
								value={(result.match_condition as any).min || 0}
								onChange={(e) => updateMatchCondition(index, 'min', Number(e.target.value))}
								placeholder="0"
							/>
						</FormField>
						<FormField label="최대 점수">
							<Input
								type="number"
								value={(result.match_condition as any).max || 0}
								onChange={(e) => updateMatchCondition(index, 'max', Number(e.target.value))}
								placeholder="10"
							/>
						</FormField>
					</div>
				);

			case 'choice_ratio':
				return (
					<div className="grid grid-cols-2 gap-4">
						<FormField label="대상 코드">
							<Input
								value={(result.match_condition as any).target_code || ''}
								onChange={(e) => updateMatchCondition(index, 'target_code', e.target.value)}
								placeholder="A, B, C..."
							/>
						</FormField>
						<FormField label="최소 비율 (0-1)">
							<Input
								type="number"
								step="0.1"
								value={(result.match_condition as any).min_ratio || 0}
								onChange={(e) => updateMatchCondition(index, 'min_ratio', Number(e.target.value))}
								placeholder="0.5"
							/>
						</FormField>
					</div>
				);

			case 'score_range':
				return (
					<div className="grid grid-cols-2 gap-4">
						<FormField label="최소 점수">
							<Input
								type="number"
								value={(result.match_condition as any).min || 0}
								onChange={(e) => updateMatchCondition(index, 'min', Number(e.target.value))}
								placeholder="0"
							/>
						</FormField>
						<FormField label="최대 점수">
							<Input
								type="number"
								value={(result.match_condition as any).max || 0}
								onChange={(e) => updateMatchCondition(index, 'max', Number(e.target.value))}
								placeholder="100"
							/>
						</FormField>
					</div>
				);

			case 'custom':
				return (
					<FormField label="커스텀 조건 (JSON)">
						<Textarea
							value={JSON.stringify(result.match_condition, null, 2)}
							onChange={(e) => {
								try {
									const parsed = JSON.parse(e.target.value);
									updateResult(index, 'match_condition', parsed);
								} catch {
									// Invalid JSON, ignore
								}
							}}
							placeholder='{"required": {"A": {"min_count": 2}}}'
							rows={4}
						/>
					</FormField>
				);

			default:
				return null;
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-4">
				{results.map((result, index) => (
					<div key={index} className="p-6 bg-white border border-neutral-200 rounded-lg space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">결과 {index + 1}</h3>
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => moveResult(index, 'up')}
									disabled={index === 0}
								>
									<MoveUp className="w-4 h-4" />
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => moveResult(index, 'down')}
									disabled={index === results.length - 1}
								>
									<MoveDown className="w-4 h-4" />
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => removeResult(index)}
									disabled={results.length === 1}
								>
									<Trash2 className="w-4 h-4 text-red-500" />
								</Button>
							</div>
						</div>

						<FormField label="결과 이름" required>
							<Input
								value={result.name}
								onChange={(e) => updateResult(index, 'name', e.target.value)}
								placeholder="결과 이름"
								required
							/>
						</FormField>

						<FormField label="결과 설명">
							<Textarea
								value={result.description || ''}
								onChange={(e) => updateResult(index, 'description', e.target.value)}
								placeholder="결과에 대한 상세한 설명을 입력하세요"
								rows={3}
							/>
						</FormField>

						<ImageUpload
							label="썸네일"
							value={result.thumbnail_url || null}
							onChange={(url) => updateResult(index, 'thumbnail_url', url)}
							folder="results/thumbnails"
							maxSizeMB={3}
							disabled={isSubmitting}
						/>

						{/* 결과 특징 섹션 */}
						<div>
							<div className="flex items-center justify-between mb-3">
								<label className="block text-sm text-neutral-700">결과 특징</label>
								<Button type="button" variant="ghost" size="sm" onClick={() => addFeature(index)}>
									<Plus className="w-4 h-4 mr-1" />
									특징 추가
								</Button>
							</div>
							<div className="space-y-3">
								{getFeatures(result).length === 0 ? (
									<div className="text-center py-6 text-neutral-400 text-sm border border-dashed border-neutral-300 rounded-lg">
										특징을 추가해주세요
									</div>
								) : (
									getFeatures(result).map((feature, fIndex) => (
										<div key={fIndex} className="border border-neutral-200 rounded-lg p-4 space-y-3">
											<div className="flex items-center gap-2">
												<Input
													value={feature.title}
													onChange={(e) => updateFeature(index, fIndex, 'title', e.target.value)}
													placeholder="특징 제목 (예: 잘 어울리는 유형)"
													className="flex-1"
												/>
												<IconButton
													type="button"
													variant="ghost"
													icon={<X className="w-4 h-4" />}
													onClick={() => removeFeature(index, fIndex)}
													className="text-neutral-400 hover:text-red-500 flex-shrink-0"
													aria-label="특징 삭제"
												/>
											</div>
											<Textarea
												value={feature.content}
												onChange={(e) => updateFeature(index, fIndex, 'content', e.target.value)}
												placeholder="특징 내용을 입력하세요"
												rows={2}
											/>
										</div>
									))
								)}
							</div>
						</div>

						<FormField label="조건 타입">
							<Select
								value={result.condition_type}
								onValueChange={(value) => updateResult(index, 'condition_type', value as ResultConditionType)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{RESULT_CONDITION_TYPES.map((type) => (
										<SelectItem key={type.value} value={type.value}>
											{type.label} - {type.description}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormField>

						{renderMatchConditionFields(result, index)}
					</div>
				))}
			</div>

			<Button type="button" variant="outline" onClick={addResult} className="w-full">
				<Plus className="w-4 h-4 mr-2" />
				결과 추가
			</Button>

			<div className="flex items-center justify-between pt-6 border-t border-neutral-200">
				{onPrevious ? (
					<Button type="button" variant="outline" text="이전 단계" onClick={onPrevious} disabled={isSubmitting} />
				) : (
					<div />
				)}
				<Button type="submit" loading={isSubmitting} text={submitButtonText || '저장하기'} />
			</div>
		</form>
	);
}
