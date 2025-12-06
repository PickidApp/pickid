export { CHART_DEFAULT_COLORS as RESULT_COLORS, CHART_ACCENT_COLORS as CHART_COLORS, DEVICE_COLORS } from './chart';
export type { DateRangeOption, AnalyticsTab, AnalyticsSortOption, TestDetailTab } from '@/types/analytics';

export const DATE_RANGE_OPTIONS = [
	{ value: '7d', label: '최근 7일' },
	{ value: '14d', label: '최근 14일' },
	{ value: '30d', label: '최근 30일' },
	{ value: '90d', label: '최근 90일' },
];

export const ANALYTICS_TABS = [
	{ value: 'list', label: '테스트별 성과' },
	{ value: 'comparison', label: '테스트 비교' },
];

export const ANALYTICS_SORT_OPTIONS = [
	{ value: 'responses', label: '응답수순' },
	{ value: 'completionRate', label: '완료율순' },
	{ value: 'avgTime', label: '평균시간순' },
	{ value: 'lastResponse', label: '최근 응답순' },
	{ value: 'createdAt', label: '생성일순' },
];

export const TEST_DETAIL_TABS = [
	{ value: 'overview', label: '개요' },
	{ value: 'trend', label: '트렌드' },
	{ value: 'questions', label: '질문별 분석' },
	{ value: 'results', label: '결과 분포' },
];

export const COMPLETION_RATE_THRESHOLDS = {
	high: 70,
	medium: 40,
};

export const DROPOFF_RATE_THRESHOLDS = {
	high: 30,
	medium: 15,
};

export const TEST_ANALYTICS_GUIDES = {
	list: {
		title: '테스트별 성과란?',
		purpose: '모든 테스트의 핵심 지표를 한눈에 비교하여 어떤 테스트가 잘 되고 있는지, 개선이 필요한지 파악합니다.',
		keyQuestions: [
			'응답수가 가장 많은 테스트는? (인기 콘텐츠)',
			'완료율이 낮은 테스트는? (개선 필요)',
			'최근 응답이 뜸한 테스트는? (홍보 필요)',
		],
		actionTip: '완료율 70% 이상이면 좋은 테스트, 40% 이하면 질문 수나 난이도를 점검하세요.',
	},
	comparison: {
		title: '테스트 비교란?',
		purpose: '2개 이상의 테스트를 나란히 비교하여 성공 요인과 실패 요인을 분석합니다.',
		keyQuestions: [
			'비슷한 주제인데 완료율 차이가 큰 이유는?',
			'어떤 테스트 형식이 더 효과적인가?',
			'썸네일/제목이 응답수에 영향을 주는가?',
		],
		actionTip: '잘 되는 테스트의 질문 수, 형식, 결과 구성을 벤치마킹하세요.',
	},
	detail_overview: {
		title: '테스트 개요란?',
		purpose: '특정 테스트의 전체 성과를 요약합니다. 응답수, 완료율, 디바이스 분포 등을 확인하세요.',
		keyQuestions: [
			'완료율이 목표(70%)에 도달했나?',
			'모바일 vs 데스크톱 비율은 적절한가?',
			'평균 소요시간이 너무 길지 않은가?',
		],
		actionTip: '모바일 비율이 높으면 짧고 간결한 질문이 유리합니다.',
	},
	detail_trend: {
		title: '일별 트렌드란?',
		purpose: '시간에 따른 응답 패턴을 파악합니다. 홍보 효과, 계절성, 트렌드 변화를 확인하세요.',
		keyQuestions: [
			'특정 날짜에 응답이 급증한 이유는?',
			'주말 vs 평일 패턴이 다른가?',
			'응답수가 지속적으로 감소하고 있나?',
		],
		actionTip: '급증 시점의 마케팅 활동을 기록해두면 재현 가능합니다.',
	},
	detail_questions: {
		title: '질문별 분석이란?',
		purpose: '각 질문에서 얼마나 많은 사용자가 이탈하는지 파악합니다. 문제 질문을 찾아내세요.',
		keyQuestions: [
			'이탈률이 가장 높은 질문은 어디인가?',
			'초반 질문에서 이탈이 많으면 → 흥미 부족',
			'후반 질문에서 이탈이 많으면 → 피로감',
		],
		actionTip: '이탈률 30% 이상인 질문은 삭제하거나, 더 쉽고 재미있게 수정하세요.',
	},
	detail_results: {
		title: '결과 분포란?',
		purpose: '어떤 결과가 가장 많이 나오는지 확인합니다. 결과가 편중되면 질문 설계를 검토하세요.',
		keyQuestions: [
			'특정 결과에 80% 이상 몰리지 않는가?',
			'모든 결과가 골고루 나오는가?',
			'결과별 평균 점수가 적절한가?',
		],
		actionTip: '결과가 너무 편중되면 질문 배점을 조정하거나 결과 기준을 수정하세요.',
	},
};
