export const ROUTES = {
	home: '/',
	auth: '/auth',

	tests: '/tests',
	testCreate: '/tests/create',

	categories: '/categories',
	users: '/users',
	responses: '/responses',
	feedbacks: '/feedbacks',

	analytics: '/analytics',

	growth: '/growth',
	growthFunnel: '/growth/funnel',
	growthChannels: '/growth/channels',
	growthLandings: '/growth/landings',
	growthCohorts: '/growth/cohorts',
} as const;

// 동적 경로
export const HREF = {
	testEdit: (testId: string | number) => `/tests/${testId}/edit`,
	testDetail: (testId: string | number) => `/tests/${testId}`,
	analyticsTest: (testId: string | number) => `/analytics/tests/${testId}`,
} as const;
