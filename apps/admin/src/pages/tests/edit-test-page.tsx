import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTestQuery, useTestQuestionsQuery, useTestResultsQuery, useTestCategoryIdsQuery, useSaveTest, useSaveQuestions, useSaveResults, useSaveTestCategories } from '@/api';
import { FormLoadingSkeleton } from '@/components/common';
import { TestForm } from '@/components/tests/test-form';
import { TestQuestionsForm } from '@/components/tests/test-questions-form';
import { TestResultsForm } from '@/components/tests/test-results-form';
import { PATH } from '@/constants/routes';
import { TEST_TABS, type TestTabType } from '@/constants/test';
import { IconButton, Tabs, TabsList, TabsTrigger } from '@pickid/ui';
import { ArrowLeft } from 'lucide-react';

export function EditTestPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { testId } = useParams<{ testId: string }>();
	const [activeTab, setActiveTab] = useState<TestTabType>(
		(location.state?.activeTab as TestTabType) ?? 'basic'
	);

	const { data: test, isLoading } = useTestQuery(testId || '');
	const { data: questions } = useTestQuestionsQuery(testId || '');
	const { data: results } = useTestResultsQuery(testId || '');
	const { data: categoryIds } = useTestCategoryIdsQuery(testId || '');

	const saveTest = useSaveTest();
	const saveQuestions = useSaveQuestions();
	const saveResults = useSaveResults();
	const saveCategories = useSaveTestCategories();

	const handleBasicSubmit = (data: any) => {
		saveTest.mutate(
			{ ...data, id: testId },
			{
				onSuccess: () => {
					if (testId && data.category_ids) {
						saveCategories.mutate(
							{ testId, categoryIds: data.category_ids },
							{ onSuccess: () => navigate(PATH.TESTS) }
						);
					} else {
						navigate(PATH.TESTS);
					}
				},
			}
		);
	};

	const handleQuestionsSubmit = (questionsData: any[]) => {
		saveQuestions.mutate({
			testId: testId || '',
			questions: questionsData,
		});
	};

	const handleResultsSubmit = (resultsData: any[]) => {
		saveResults.mutate({
			testId: testId || '',
			results: resultsData,
		});
	};

	const handleBack = () => {
		navigate(PATH.TESTS);
	};

	if (isLoading) {
		return (
			<div className="p-6">
				<FormLoadingSkeleton />
			</div>
		);
	}

	if (!test) return null;

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
						<h1 className="text-2xl text-neutral-900">테스트 수정</h1>
						<div className="text-sm text-neutral-500">{test.title}</div>
					</div>
				</div>
			</header>

			<div className="bg-white border-b border-neutral-200 px-6 shrink-0">
				<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TestTabType)}>
					<TabsList className="bg-transparent p-0 h-auto gap-8">
						{TEST_TABS.map((tab) => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className={`py-4 px-0 rounded-none border-b-2 text-sm data-[state=active]:shadow-none ${
									activeTab === tab.id
										? 'border-black text-black'
										: 'border-transparent text-neutral-500 hover:text-neutral-700'
								}`}
							>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>

			<main className="flex-1 overflow-auto p-6 bg-neutral-50">
				<div className="max-w-4xl mx-auto">
					<div className="bg-white border border-neutral-200 rounded-lg p-8">
						{activeTab === 'basic' && (
							<TestForm
								initialData={test}
								initialCategoryIds={categoryIds}
								onSubmit={handleBasicSubmit}
								isSubmitting={saveTest.isPending || saveCategories.isPending}
							/>
						)}

						{activeTab === 'questions' && (
							<TestQuestionsForm
								testType={test.type}
								initialQuestions={questions as any}
								onSubmit={handleQuestionsSubmit}
								isSubmitting={saveQuestions.isPending}
							/>
						)}

						{activeTab === 'results' && (
							<TestResultsForm
								testType={test.type}
								initialResults={results as any}
								onSubmit={handleResultsSubmit}
								isSubmitting={saveResults.isPending}
							/>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
