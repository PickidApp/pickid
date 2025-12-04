import { useState, useEffect } from 'react';
import type { TestType, ResultConditionType } from '@pickid/supabase';
import type { TestResultInput } from '@/services/test.service';
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
} from '@pickid/ui';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { RESULT_CONDITION_TYPES } from '@/constants/test';
import { ImageUpload } from '@/components/common/image-upload';

interface TestResultsFormProps {
	testType: TestType;
	initialResults?: TestResultInput[];
	onSubmit: (results: TestResultInput[]) => void;
	onCancel: () => void;
	isSubmitting?: boolean;
	submitButtonText?: string;
}

export function TestResultsForm(props: TestResultsFormProps) {
	const { testType, initialResults, onSubmit, onCancel, isSubmitting, submitButtonText } = props;
	const [results, setResults] = useState<TestResultInput[]>(
		initialResults || [
			{
				order: 1,
				name: '',
				condition_type: testType === 'quiz' ? 'quiz_score' : 'choice_ratio',
				match_condition: {},
			},
		]
	);

	useEffect(() => {
		if (initialResults && initialResults.length > 0) {
			setResults(initialResults);
		}
	}, [initialResults]);

	const addResult = () => {
		setResults([
			...results,
			{
				order: results.length + 1,
				name: '',
				condition_type: testType === 'quiz' ? 'quiz_score' : 'choice_ratio',
				match_condition: {},
			},
		]);
	};

	const removeResult = (index: number) => {
		const newResults = results.filter((_, i) => i !== index);
		setResults(newResults.map((r, i) => ({ ...r, order: i + 1 })));
	};

	const moveResult = (index: number, direction: 'up' | 'down') => {
		const newIndex = direction === 'up' ? index - 1 : index + 1;
		if (newIndex < 0 || newIndex >= results.length) return;

		const newResults = [...results];
		[newResults[index], newResults[newIndex]] = [newResults[newIndex], newResults[index]];
		setResults(newResults.map((r, i) => ({ ...r, order: i + 1 })));
	};

	const updateResult = (index: number, field: keyof TestResultInput, value: any) => {
		const newResults = [...results];
		newResults[index] = { ...newResults[index], [field]: value };
		setResults(newResults);
	};

	const updateMatchCondition = (index: number, field: string, value: any) => {
		const newResults = [...results];
		const currentCondition = newResults[index].match_condition || {};
		newResults[index].match_condition = {
			...(typeof currentCondition === 'object' && currentCondition !== null ? currentCondition : {}),
			[field]: value,
		};
		setResults(newResults);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(results);
	};

	const renderMatchConditionFields = (result: TestResultInput, index: number) => {
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
								placeholder="결과 설명"
								rows={2}
							/>
						</FormField>

						<FormField label="슬러그">
							<Input
								value={result.slug || ''}
								onChange={(e) => updateResult(index, 'slug', e.target.value)}
								placeholder="result-slug"
							/>
						</FormField>

						<ImageUpload
							label="썸네일"
							value={result.thumbnail_url || null}
							onChange={(url) => updateResult(index, 'thumbnail_url', url)}
							bucket="test-results"
							folder="thumbnails"
							maxSizeMB={3}
							disabled={isSubmitting}
						/>

						<ImageUpload
							label="배경 이미지 (선택)"
							value={result.background_image_url || null}
							onChange={(url) => updateResult(index, 'background_image_url', url)}
							bucket="test-results"
							folder="backgrounds"
							maxSizeMB={5}
							disabled={isSubmitting}
						/>

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

			<div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? '저장 중...' : submitButtonText || '저장하기'}
				</Button>
				<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} text="취소" />
			</div>
		</form>
	);
}
