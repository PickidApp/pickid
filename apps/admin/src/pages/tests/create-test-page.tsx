import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSaveTest, useSaveQuestions, useSaveResults, useSaveTestCategories } from '@/api/mutations';
import { TestForm } from '@/components/tests/test-form';
import { TestQuestionsForm } from '@/components/tests/test-questions-form';
import { TestResultsForm } from '@/components/tests/test-results-form';
import { PATH } from '@/constants/routes';
import { TEST_TABS, type TestTabType } from '@/constants/test';
import { IconButton, Tabs, TabsList, TabsTrigger } from '@pickid/ui';
import { ArrowLeft } from 'lucide-react';
import type { TestType } from '@pickid/supabase';

export function CreateTestPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<TestTabType>('basic');
	const [completedTabs, setCompletedTabs] = useState<TestTabType[]>([]);
	const [testType, setTestType] = useState<TestType>('psychology');

	const [basicData, setBasicData] = useState<any>(null);
	const [questionsData, setQuestionsData] = useState<any[]>([
		{
			order: 1,
			text: '',
			question_type: 'single_choice',
			choices: [
				{ order: 1, text: '' },
				{ order: 2, text: '' },
			],
		},
	]);
	const [resultsData, setResultsData] = useState<any[]>([
		{
			order: 1,
			name: '',
			condition_type: 'choice_ratio',
			match_condition: {},
			metadata: { features: [] },
		},
	]);

	const saveTest = useSaveTest();
	const saveQuestions = useSaveQuestions();
	const saveResults = useSaveResults();
	const saveCategories = useSaveTestCategories();

	const isSubmitting =
		saveTest.isPending || saveQuestions.isPending || saveResults.isPending || saveCategories.isPending;

	const isTabClickable = (tabId: TestTabType) => {
		if (tabId === 'basic') return true;
		if (tabId === 'questions') return completedTabs.includes('basic');
		if (tabId === 'results') return completedTabs.includes('questions');
		return false;
	};

	const handleTabClick = (tabId: TestTabType) => {
		if (isTabClickable(tabId)) {
			setActiveTab(tabId);
		}
	};

	const handleBasicSubmit = (data: any) => {
		setBasicData(data);
		setTestType(data.type);
		setCompletedTabs((prev) => (prev.includes('basic') ? prev : [...prev, 'basic']));
		setActiveTab('questions');
	};

	const handleQuestionsSubmit = (questions: any[]) => {
		setQuestionsData(questions);
		setCompletedTabs((prev) => (prev.includes('questions') ? prev : [...prev, 'questions']));
		setActiveTab('results');
	};

	const handleResultsSubmit = async (results: any[]) => {
		setResultsData(results);

		if (!basicData) {
			alert('기본 정보가 없습니다.');
			return;
		}

		try {
			const test = (await saveTest.mutateAsync(basicData)) as any;

			if (!test?.id) {
				throw new Error('테스트 생성 실패: ID를 받지 못했습니다.');
			}

			const testId = test.id as string;

			await Promise.all([
				saveQuestions.mutateAsync({
					testId,
					questions: questionsData,
				}),
				saveResults.mutateAsync({
					testId,
					results: results,
				}),
				basicData.category_ids && basicData.category_ids.length > 0
					? saveCategories.mutateAsync({
							testId,
							categoryIds: basicData.category_ids,
					  })
					: Promise.resolve(),
			]);

			alert('테스트가 성공적으로 생성되었습니다!');
			navigate(PATH.TESTS);
		} catch (error) {
			console.error('테스트 생성 실패:', error);
			alert('테스트 생성에 실패했습니다.');
		}
	};

	const handlePrevious = () => {
		if (activeTab === 'questions') setActiveTab('basic');
		if (activeTab === 'results') setActiveTab('questions');
	};

	const handleBack = () => {
		navigate(PATH.TESTS);
	};

	return (
		<div className="flex flex-col h-full">
			<header className="bg-white border-b border-neutral-200 px-6 py-4 shrink-0">
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-4">
						<IconButton
							variant="ghost"
							icon={<ArrowLeft className="w-5 h-5" />}
							onClick={handleBack}
							aria-label="뒤로가기"
						/>
						<h1 className="text-2xl text-neutral-900">새 테스트 만들기</h1>
					</div>
				</div>
			</header>

			<div className="bg-white border-b border-neutral-200 px-6 shrink-0">
				<Tabs value={activeTab} onValueChange={(value) => handleTabClick(value as TestTabType)}>
					<TabsList className="bg-transparent p-0 h-auto gap-8">
						{TEST_TABS.map((tab) => {
							const clickable = isTabClickable(tab.id);
							return (
								<TabsTrigger
									key={tab.id}
									value={tab.id}
									disabled={!clickable}
									className={`py-4 px-0 rounded-none border-b-2 text-sm data-[state=active]:shadow-none ${
										activeTab === tab.id
											? 'border-black text-black'
											: clickable
											? 'border-transparent text-neutral-500 hover:text-neutral-700'
											: 'border-transparent text-neutral-300 cursor-not-allowed'
									}`}
								>
									{tab.label}
								</TabsTrigger>
							);
						})}
					</TabsList>
				</Tabs>
			</div>

			<main className="flex-1 overflow-auto p-6 bg-neutral-50">
				<div className="max-w-4xl mx-auto">
					<div className="bg-white border border-neutral-200 rounded-lg p-8">
						{activeTab === 'basic' && (
							<TestForm
								onSubmit={handleBasicSubmit}
								isSubmitting={false}
								initialData={basicData || undefined}
								submitButtonText="다음 단계"
							/>
						)}

						{activeTab === 'questions' && (
							<TestQuestionsForm
								testType={testType}
								initialQuestions={questionsData}
								onSubmit={handleQuestionsSubmit}
								onPrevious={handlePrevious}
								isSubmitting={false}
								submitButtonText="다음 단계"
							/>
						)}

						{activeTab === 'results' && (
							<TestResultsForm
								testType={testType}
								initialResults={resultsData}
								onSubmit={handleResultsSubmit}
								onPrevious={handlePrevious}
								isSubmitting={isSubmitting}
								submitButtonText="생성 완료"
							/>
						)}
					</div>

					{isSubmitting && (
						<div className="mt-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
							<div className="flex items-center gap-3">
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-900" />
								<div>
									<p className="text-sm text-neutral-900">테스트를 생성하고 있습니다...</p>
									<p className="text-xs text-neutral-500 mt-1">잠시만 기다려주세요.</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
