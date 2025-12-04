import type { TestType, TestStatus, QuestionType } from '@pickid/supabase';

export const TEST_TABS = [
	{ id: 'basic', label: '기본 정보' },
	{ id: 'questions', label: '질문/선택지' },
	{ id: 'results', label: '결과 정의' },
];

export type TestTabType = (typeof TEST_TABS)[number]['id'];

export const TEST_TYPES: { value: TestType; label: string; description: string }[] = [
	{ value: 'psychology', label: '심리 테스트', description: '성격, 심리 유형 분석 테스트' },
	{ value: 'balance', label: '밸런스 게임', description: '두 가지 선택지 중 하나를 고르는 테스트' },
	{ value: 'quiz', label: '퀴즈', description: '지식 기반 정답 맞추기 테스트' },
	{ value: 'other', label: '기타', description: '기타 유형의 테스트' },
];

export const TEST_STATUSES: { value: TestStatus; label: string; color: string }[] = [
	{ value: 'draft', label: '초안', color: 'gray' },
	{ value: 'published', label: '발행됨', color: 'green' },
	{ value: 'scheduled', label: '예약됨', color: 'blue' },
	{ value: 'archived', label: '보관됨', color: 'red' },
];

export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
	{ value: 'single_choice', label: '단일 선택' },
	{ value: 'multiple_choice', label: '다중 선택' },
	{ value: 'short_answer', label: '단답형' },
];

export const RESULT_CONDITION_TYPES = [
	{ value: 'score_range', label: '점수 구간', description: '점수 범위로 결과 매칭' },
	{ value: 'choice_ratio', label: '선택 비율', description: '특정 선택지/코드 비율로 결과 매칭' },
	{ value: 'quiz_score', label: '퀴즈 점수', description: '정답 개수/점수로 결과 매칭' },
	{ value: 'custom', label: '커스텀', description: '커스텀 로직으로 결과 매칭' },
];
