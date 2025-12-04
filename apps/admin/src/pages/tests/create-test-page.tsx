import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpsertTestMutation, useSyncQuestionsMutation, useSyncResultsMutation } from '@/api/mutations';
import { TestForm } from '@/components/tests/test-form';
import { TestQuestionsForm } from '@/components/tests/test-questions-form';
import { TestResultsForm } from '@/components/tests/test-results-form';
import { PATH } from '@/constants/routes';
import { Button } from '@pickid/ui';
import type { TestType } from '@pickid/supabase';
import type { TestPayload, TestQuestionInput, TestResultInput } from '@/services/test.service';
import { ChevronLeft, Check } from 'lucide-react';

type Step = 1 | 2 | 3;

export function CreateTestPage() {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState<Step>(1);
	const [testType, setTestType] = useState<TestType>('psychology');

	// 각 스텝의 데이터
	const [basicData, setBasicData] = useState<TestPayload | null>(null);
	const [questionsData, setQuestionsData] = useState<TestQuestionInput[]>([
		{
			order: 1,
			text: '',
			question_type: 'single_choice',
			is_required: true,
			choices: [
				{ order: 1, text: '' },
				{ order: 2, text: '' },
			],
		},
	]);
	const [resultsData, setResultsData] = useState<TestResultInput[]>([
		{
			order: 1,
			name: '',
			condition_type: 'choice_ratio',
			match_condition: {},
		},
	]);

	const upsertTestMutation = useUpsertTestMutation();
	const syncQuestionsMutation = useSyncQuestionsMutation();
	const syncResultsMutation = useSyncResultsMutation();

	const isSubmitting =
		upsertTestMutation.isPending || syncQuestionsMutation.isPending || syncResultsMutation.isPending;

	// Step 1: 기본 정보 저장 후 다음 스텝
	const handleBasicSubmit = (data: TestPayload) => {
		setBasicData(data);
		setTestType(data.type);
		setCurrentStep(2);
	};

	// Step 2: 질문 저장 후 다음 스텝
	const handleQuestionsSubmit = (questions: TestQuestionInput[]) => {
		setQuestionsData(questions);
		setCurrentStep(3);
	};

	// Step 3: 결과 저장 후 API 병렬 호출
	const handleResultsSubmit = async (results: TestResultInput[]) => {
		setResultsData(results);

		if (!basicData) {
			alert('기본 정보가 없습니다.');
			return;
		}

		try {
			// 1단계: 기본 정보 저장 (testId 획득)
			const test = await upsertTestMutation.mutateAsync(basicData);

			if (!test?.id) {
				throw new Error('테스트 생성 실패: ID를 받지 못했습니다.');
			}

			// 2단계: 질문과 결과를 병렬로 저장
			await Promise.all([
				syncQuestionsMutation.mutateAsync({
					test_id: test.id,
					questions: questionsData as any,
				}),
				syncResultsMutation.mutateAsync({
					test_id: test.id,
					results: results as any,
				}),
			]);

			alert('테스트가 성공적으로 생성되었습니다!');
			navigate(PATH.TESTS);
		} catch (error) {
			console.error('테스트 생성 실패:', error);
			alert('테스트 생성에 실패했습니다.');
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep((currentStep - 1) as Step);
		}
	};

	const handleCancel = () => {
		if (confirm('작성 중인 내용이 모두 사라집니다. 취소하시겠습니까?')) {
			navigate(PATH.TESTS);
		}
	};

	const steps = [
		{ number: 1, title: '기본 정보', description: '테스트의 기본 정보를 입력하세요' },
		{ number: 2, title: '질문 관리', description: '테스트 질문과 선택지를 추가하세요' },
		{ number: 3, title: '결과 정의', description: '테스트 결과 조건을 설정하세요' },
	];

	return (
		<div className="p-6 max-w-5xl mx-auto">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-neutral-900 mb-2">새 테스트 만들기</h1>
				<p className="text-sm text-neutral-500">3단계로 테스트를 생성합니다</p>
			</div>

			{/* Step Indicator */}
			<div className="mb-8">
				<div className="flex items-center justify-between">
					{steps.map((step, index) => (
						<div key={step.number} className="flex items-center flex-1">
							<div className="flex items-center">
								<div
									className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
										currentStep === step.number
											? 'border-neutral-900 bg-neutral-900 text-white'
											: currentStep > step.number
												? 'border-green-500 bg-green-500 text-white'
												: 'border-neutral-300 bg-white text-neutral-400'
									}`}
								>
									{currentStep > step.number ? (
										<Check className="w-5 h-5" />
									) : (
										<span className="text-sm font-semibold">{step.number}</span>
									)}
								</div>
								<div className="ml-3">
									<div className="text-sm font-medium text-neutral-900">{step.title}</div>
									<div className="text-xs text-neutral-500">{step.description}</div>
								</div>
							</div>
							{index < steps.length - 1 && (
								<div className="flex-1 h-0.5 bg-neutral-200 mx-4 min-w-[40px]" />
							)}
						</div>
					))}
				</div>
			</div>

			{/* Step Content */}
			<div className="bg-white rounded-lg border border-neutral-200 p-6">
				{currentStep === 1 && (
					<TestForm
						onSubmit={handleBasicSubmit}
						onCancel={handleCancel}
						isSubmitting={false}
						initialData={basicData || undefined}
						submitButtonText="다음"
					/>
				)}

				{currentStep === 2 && (
					<div>
						<div className="mb-4">
							<Button type="button" variant="ghost" onClick={handlePrevious}>
								<ChevronLeft className="w-4 h-4 mr-1" />
								이전
							</Button>
						</div>
						<TestQuestionsForm
							testType={testType}
							initialQuestions={questionsData}
							onSubmit={handleQuestionsSubmit}
							onCancel={handleCancel}
							isSubmitting={false}
							submitButtonText="다음"
						/>
					</div>
				)}

				{currentStep === 3 && (
					<div>
						<div className="mb-4">
							<Button type="button" variant="ghost" onClick={handlePrevious}>
								<ChevronLeft className="w-4 h-4 mr-1" />
								이전
							</Button>
						</div>
						<TestResultsForm
							testType={testType}
							initialResults={resultsData}
							onSubmit={handleResultsSubmit}
							onCancel={handleCancel}
							isSubmitting={isSubmitting}
							submitButtonText="생성 완료"
						/>
					</div>
				)}
			</div>

			{/* Progress Info */}
			{isSubmitting && (
				<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<div className="flex items-center gap-3">
						<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
						<div>
							<p className="text-sm font-medium text-blue-900">테스트를 생성하고 있습니다...</p>
							<p className="text-xs text-blue-700 mt-1">
								기본 정보, 질문, 결과를 저장 중입니다. 잠시만 기다려주세요.
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

