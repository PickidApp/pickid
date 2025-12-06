export { DATE_RANGE_OPTIONS } from './analytics';
export type { GrowthTab } from '@/types/analytics';

export const GROWTH_TABS = [
	{ value: 'overview', label: '성장 요약' },
	{ value: 'funnel', label: '퍼널 분석' },
	{ value: 'channel', label: '채널 분석' },
	{ value: 'landing', label: '랜딩 페이지' },
	{ value: 'cohort', label: '코호트 분석' },
];

export const CHANNEL_LABELS: Record<string, string> = {
	direct: '직접 방문',
	search: '검색',
	social: '소셜 미디어',
	referral: '외부 링크',
	email: '이메일',
	other: '기타',
};

export const GROWTH_ANALYSIS_GUIDES = {
	overview: {
		title: '성장 요약이란?',
		purpose:
			'서비스 전체의 건강 상태를 한눈에 파악합니다. 방문자, 테스트 참여, 완료율 등 핵심 지표의 추세를 확인하세요.',
		keyQuestions: [
			'이번 주/달 방문자가 늘었나, 줄었나?',
			'테스트 완료율이 개선되고 있나?',
			'전환율에 이상 징후가 있나?',
		],
		actionTip: '수치가 떨어지면 원인을 파악하러 퍼널/채널 탭으로 이동하세요.',
	},
	funnel: {
		title: '퍼널 분석이란?',
		purpose: '사용자가 "방문 → 테스트 시작 → 완료"까지 가는 과정에서 어디서 이탈하는지 찾아냅니다.',
		keyQuestions: [
			'방문자 중 몇 %가 테스트를 시작하나? (낮으면 → 랜딩페이지 문제)',
			'시작한 사람 중 몇 %가 완료하나? (낮으면 → 테스트 길이/난이도 문제)',
			'가장 이탈이 큰 단계는 어디인가?',
		],
		actionTip: '이탈률이 가장 높은 단계를 먼저 개선하면 전체 전환율이 올라갑니다.',
	},
	channel: {
		title: '채널 분석이란?',
		purpose: '사용자가 어디서 들어오는지 파악하고, 어떤 채널이 효과적인지 판단합니다.',
		keyQuestions: [
			'어떤 채널에서 가장 많이 유입되나?',
			'유입은 많지만 전환이 안 되는 채널은?',
			'전환율 높은 "황금 채널"은 어디인가?',
		],
		actionTip: '세션은 많은데 전환율 낮으면 "양만 많고 질이 낮은" 채널. 전환율 높은 채널에 마케팅 비용을 집중하세요.',
	},
	landing: {
		title: '랜딩 페이지 분석이란?',
		purpose: '사용자가 처음 도착하는 페이지(입구)가 얼마나 효과적인지 측정합니다.',
		keyQuestions: [
			'어떤 페이지가 가장 전환율이 높은가?',
			'전환율 낮은 페이지는 왜 그런가?',
			'메인 vs 개별 테스트 페이지 중 어디가 나은가?',
		],
		actionTip: '전환율 높은 페이지 구성을 벤치마킹하고, 낮은 페이지는 제목/썸네일/CTA 버튼을 개선하세요.',
	},
	cohort: {
		title: '코호트 분석이란?',
		purpose: '가입 시점별로 사용자를 묶어 "얼마나 오래 살아남는지(리텐션)"를 추적합니다.',
		keyQuestions: [
			'Week 1 리텐션이 몇 %인가? (낮으면 → 온보딩 문제)',
			'장기 리텐션이 유지되는가?',
			'최근 코호트가 과거보다 나은가?',
		],
		actionTip: '신규 유치보다 기존 유저 유지가 5배 저렴합니다. 리텐션 개선이 성장의 핵심!',
	},
};
