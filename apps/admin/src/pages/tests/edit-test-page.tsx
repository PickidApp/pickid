import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTestQuery, useTestQuestionsQuery, useTestResultsQuery } from '@/api/queries';
import {
	useUpsertTestMutation,
	useSyncQuestionsMutation,
	useSyncResultsMutation,
	useArchiveTestMutation,
} from '@/api/mutations';
import { TestForm } from '@/components/tests/test-form';
import { TestQuestionsForm } from '@/components/tests/test-questions-form';
import { TestResultsForm } from '@/components/tests/test-results-form';
import { PATH } from '@/constants/routes';
import { Button } from '@pickid/ui';
import type { TestPayload, TestQuestionInput, TestResultInput } from '@/services/test.service';

type TabType = 'basic' | 'questions' | 'results';

export function EditTestPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { testId } = useParams<{ testId: string }>();
	const [activeTab, setActiveTab] = useState<TabType>('basic');

	// 생성 직후 진입 시 질문 탭으로 이동
	useEffect(() => {
		if (location.state?.activeTab) {
			setActiveTab(location.state.activeTab as TabType);
		}
	}, [location.state]);

	const { data: test, isLoading, isError } = useTestQuery(testId || '');
	const { data: questions } = useTestQuestionsQuery(testId || '');
	const { data: results } = useTestResultsQuery(testId || '');

	const upsertTestMutation = useUpsertTestMutation();
	const syncQuestionsMutation = useSyncQuestionsMutation();
	const syncResultsMutation = useSyncResultsMutation();
	const archiveTestMutation = useArchiveTestMutation();

	const handleBasicSubmit = async (data: TestPayload) => {
		try {
			await upsertTestMutation.mutateAsync({
				...data,
				id: testId,
			});
			alert('테스트 기본 정보가 수정되었습니다.');
		} catch (error) {
			console.error('테스트 수정 실패:', error);
			alert('테스트 수정에 실패했습니다.');
		}
	};

	const handleQuestionsSubmit = async (questionsData: TestQuestionInput[]) => {
		try {
			await syncQuestionsMutation.mutateAsync({
				test_id: testId || '',
				questions: questionsData as any,
			});
			alert('질문이 저장되었습니다.');
		} catch (error) {
			console.error('질문 저장 실패:', error);
			alert('질문 저장에 실패했습니다.');
		}
	};

	const handleResultsSubmit = async (resultsData: TestResultInput[]) => {
		try {
			await syncResultsMutation.mutateAsync({
				test_id: testId || '',
				results: resultsData as any,
			});
			alert('결과가 저장되었습니다.');
		} catch (error) {
			console.error('결과 저장 실패:', error);
			alert('결과 저장에 실패했습니다.');
		}
	};

	const handleArchive = async () => {
		if (!confirm('정말 이 테스트를 아카이브하시겠습니까?')) return;

		try {
			await archiveTestMutation.mutateAsync(testId || '');
			alert('테스트가 아카이브되었습니다.');
			navigate(PATH.TESTS);
		} catch (error) {
			console.error('아카이브 실패:', error);
			alert('아카이브에 실패했습니다.');
		}
	};

	const handleCancel = () => {
		navigate(PATH.TESTS);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<p className="text-neutral-500">로딩 중...</p>
			</div>
		);
	}

	if (isError || !test) {
		return (
			<div className="flex items-center justify-center py-12">
				<p className="text-red-500">테스트를 불러오는데 실패했습니다.</p>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-neutral-900">테스트 수정</h1>
					<p className="text-sm text-neutral-500 mt-1">{test.title}</p>
				</div>
				<Button variant="destructive" onClick={handleArchive}>
					아카이브
				</Button>
			</div>

			<div className="mb-6 border-b border-neutral-200">
				<nav className="flex gap-4">
					<button
						onClick={() => setActiveTab('basic')}
						className={`pb-3 px-1 text-sm font-medium transition-colors ${
							activeTab === 'basic'
								? 'text-neutral-900 border-b-2 border-neutral-900'
								: 'text-neutral-500 hover:text-neutral-700'
						}`}
					>
						기본 정보
					</button>
					<button
						onClick={() => setActiveTab('questions')}
						className={`pb-3 px-1 text-sm font-medium transition-colors ${
							activeTab === 'questions'
								? 'text-neutral-900 border-b-2 border-neutral-900'
								: 'text-neutral-500 hover:text-neutral-700'
						}`}
					>
						질문 관리
					</button>
					<button
						onClick={() => setActiveTab('results')}
						className={`pb-3 px-1 text-sm font-medium transition-colors ${
							activeTab === 'results'
								? 'text-neutral-900 border-b-2 border-neutral-900'
								: 'text-neutral-500 hover:text-neutral-700'
						}`}
					>
						결과 정의
					</button>
				</nav>
			</div>

			{activeTab === 'basic' && (
				<TestForm
					initialData={test}
					onSubmit={handleBasicSubmit}
					onCancel={handleCancel}
					isSubmitting={upsertTestMutation.isPending}
				/>
			)}

			{activeTab === 'questions' && (
				<TestQuestionsForm
					testType={test.type}
					initialQuestions={questions as any}
					onSubmit={handleQuestionsSubmit}
					onCancel={handleCancel}
					isSubmitting={syncQuestionsMutation.isPending}
				/>
			)}

			{activeTab === 'results' && (
				<TestResultsForm
					testType={test.type}
					initialResults={results as any}
					onSubmit={handleResultsSubmit}
					onCancel={handleCancel}
					isSubmitting={syncResultsMutation.isPending}
				/>
			)}
		</div>
	);
}

