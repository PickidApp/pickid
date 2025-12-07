import { useState, useEffect } from 'react';
import type { TestType } from '@pickid/supabase';
import { Button, Input, Label, Textarea, Switch, FormField, IconButton } from '@pickid/ui';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { ImageUpload } from '@/components/common/image-upload';

interface Choice {
	id?: string;
	order: number;
	text: string;
	image_url?: string;
	score?: number;
	is_correct?: boolean;
	code?: string;
}

interface Question {
	id?: string;
	order: number;
	text: string;
	question_type: string;
	image_url?: string;
	choices: Choice[];
}

interface TestQuestionsFormProps {
	testType: TestType;
	initialQuestions?: Question[];
	onSubmit: (questions: Question[]) => void;
	onPrevious?: () => void;
	isSubmitting?: boolean;
	submitButtonText?: string;
}

export function TestQuestionsForm(props: TestQuestionsFormProps) {
	const { testType, initialQuestions, onSubmit, onPrevious, isSubmitting, submitButtonText } = props;
	const [questions, setQuestions] = useState<Question[]>(
		initialQuestions || [
			{
				order: 1,
				text: '',
				question_type: 'single_choice',
				choices: [
					{ order: 1, text: '' },
					{ order: 2, text: '' },
				],
			},
		]
	);

	useEffect(() => {
		if (initialQuestions && initialQuestions.length > 0) {
			setQuestions(initialQuestions);
		}
	}, [initialQuestions]);

	const addQuestion = () => {
		setQuestions([
			...questions,
			{
				order: questions.length + 1,
				text: '',
				question_type: 'single_choice',
				choices: [
					{ order: 1, text: '' },
					{ order: 2, text: '' },
				],
			},
		]);
	};

	const removeQuestion = (index: number) => {
		const newQuestions = questions.filter((_, i) => i !== index);
		setQuestions(newQuestions.map((q, i) => ({ ...q, order: i + 1 })));
	};

	const moveQuestion = (index: number, direction: 'up' | 'down') => {
		const newIndex = direction === 'up' ? index - 1 : index + 1;
		if (newIndex < 0 || newIndex >= questions.length) return;

		const newQuestions = [...questions];
		[newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
		setQuestions(newQuestions.map((q, i) => ({ ...q, order: i + 1 })));
	};

	const updateQuestion = (index: number, field: keyof Question, value: any) => {
		const newQuestions = [...questions];
		newQuestions[index] = { ...newQuestions[index], [field]: value };
		setQuestions(newQuestions);
	};

	const addChoice = (questionIndex: number) => {
		const newQuestions = [...questions];
		const choices = newQuestions[questionIndex].choices || [];
		newQuestions[questionIndex].choices = [
			...choices,
			{
				order: choices.length + 1,
				text: '',
			},
		];
		setQuestions(newQuestions);
	};

	const removeChoice = (questionIndex: number, choiceIndex: number) => {
		const newQuestions = [...questions];
		const choices = newQuestions[questionIndex].choices.filter((_, i) => i !== choiceIndex);
		newQuestions[questionIndex].choices = choices.map((c, i) => ({ ...c, order: i + 1 }));
		setQuestions(newQuestions);
	};

	const updateChoice = (questionIndex: number, choiceIndex: number, field: keyof Choice, value: any) => {
		const newQuestions = [...questions];
		const choice = newQuestions[questionIndex].choices[choiceIndex];
		newQuestions[questionIndex].choices[choiceIndex] = { ...choice, [field]: value };
		setQuestions(newQuestions);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(questions);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-4">
				{questions.map((question, qIndex) => (
					<div key={qIndex} className="p-6 bg-white border border-neutral-200 rounded-lg space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">질문 {qIndex + 1}</h3>
							<div className="flex items-center gap-2">
								<IconButton
									type="button"
									icon={<MoveUp className="w-4 h-4" />}
									onClick={() => moveQuestion(qIndex, 'up')}
									disabled={qIndex === 0}
									aria-label="위로 이동"
								/>
								<IconButton
									type="button"
									icon={<MoveDown className="w-4 h-4" />}
									onClick={() => moveQuestion(qIndex, 'down')}
									disabled={qIndex === questions.length - 1}
									aria-label="아래로 이동"
								/>
								<IconButton
									type="button"
									icon={<Trash2 className="w-4 h-4 text-red-500" />}
									onClick={() => removeQuestion(qIndex)}
									disabled={questions.length === 1}
									aria-label="질문 삭제"
								/>
							</div>
						</div>

						<FormField label="질문 텍스트" required>
							<Textarea
								value={question.text}
								onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
								placeholder="질문을 입력하세요"
								required
							/>
						</FormField>

						<ImageUpload
							label="질문 이미지 (선택)"
							value={question.image_url || null}
							onChange={(url) => updateQuestion(qIndex, 'image_url', url)}
							folder="questions"
							maxSizeMB={3}
							disabled={isSubmitting}
						/>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label>선택지</Label>
								<IconButton
									type="button"
									variant="outline"
									size="sm"
									onClick={() => addChoice(qIndex)}
									icon={<Plus className="w-4 h-4" />}
									text="선택지 추가"
									aria-label="선택지 추가"
								/>
							</div>

							{question.choices.map((choice, cIndex) => (
								<div key={cIndex} className="flex items-center gap-2">
									<span className="text-sm text-neutral-500 w-8">{cIndex + 1}.</span>
									<Input
										value={choice.text}
										onChange={(e) => updateChoice(qIndex, cIndex, 'text', e.target.value)}
										placeholder="선택지 텍스트"
										required
									/>

									{testType === 'quiz' && (
										<>
											<Input
												type="number"
												value={choice.score || 0}
												onChange={(e) => updateChoice(qIndex, cIndex, 'score', Number(e.target.value))}
												placeholder="점수"
												className="w-24"
											/>
											<Switch
												checked={choice.is_correct || false}
												onCheckedChange={(checked) => updateChoice(qIndex, cIndex, 'is_correct', checked)}
											/>
											<span className="text-xs text-neutral-500">정답</span>
										</>
									)}

									{testType === 'psychology' && (
										<Input
											value={choice.code || ''}
											onChange={(e) => updateChoice(qIndex, cIndex, 'code', e.target.value)}
											placeholder="코드 (A, B, C...)"
											className="w-32"
										/>
									)}

									<IconButton
										type="button"
										icon={<Trash2 className="w-4 h-4 text-red-500" />}
										onClick={() => removeChoice(qIndex, cIndex)}
										disabled={question.choices.length <= 2}
										aria-label="선택지 삭제"
									/>
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			<IconButton
				type="button"
				variant="outline"
				onClick={addQuestion}
				className="w-full"
				icon={<Plus className="w-4 h-4" />}
				text="질문 추가"
				aria-label="질문 추가"
			/>

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
