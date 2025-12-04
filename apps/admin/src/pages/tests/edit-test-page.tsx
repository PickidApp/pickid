import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTestQuery, useTestQuestionsQuery, useTestResultsQuery, useTestCategoryIdsQuery } from '@/api/queries';
import { useSaveTest, useSaveQuestions, useSaveResults, useSaveTestCategories } from '@/api/mutations';
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
	const [activeTab, setActiveTab] = useState<TestTabType>((location.state?.activeTab as TestTabType) || 'basic');

	const { data: test, isLoading } = useTestQuery(testId || '');
	const { data: questions } = useTestQuestionsQuery(testId || '');
	const { data: results } = useTestResultsQuery(testId || '');
	const { data: categoryIds } = useTestCategoryIdsQuery(testId || '');

	const saveTest = useSaveTest();
	const saveQuestions = useSaveQuestions();
	const saveResults = useSaveResults();
	const saveCategories = useSaveTestCategories();

	const handleBasicSubmit = async (data: any) => {
		try {
			await saveTest.mutateAsync({
				...data,
				id: testId,
			});

			if (testId && data.category_ids) {
				await saveCategories.mutateAsync({
					testId,
					categoryIds: data.category_ids,
				});
			}

			alert('테스트 기본 정보가 수정되었습니다.');
			navigate(PATH.TESTS);
		} catch (error) {
			console.error('테스트 수정 실패:', error);
			alert('테스트 수정에 실패했습니다.');
		}
	};

	const handleQuestionsSubmit = async (questionsData: any[]) => {
		try {
			await saveQuestions.mutateAsync({
				testId: testId || '',
				questions: questionsData,
			});
			alert('질문이 저장되었습니다.');
		} catch (error) {
			console.error('질문 저장 실패:', error);
			alert('질문 저장에 실패했습니다.');
		}
	};

	const handleResultsSubmit = async (resultsData: any[]) => {
		try {
			await saveResults.mutateAsync({
				testId: testId || '',
				results: resultsData,
			});
			alert('결과가 저장되었습니다.');
		} catch (error) {
			console.error('결과 저장 실패:', error);
			alert('결과 저장에 실패했습니다.');
		}
	};

	const handleBack = () => {
		navigate(PATH.TESTS);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<p className="text-neutral-500">로딩 중...</p>
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
