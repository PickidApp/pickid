export const queryKeys = {
	auth: {
		all: ['auth'] as const,
		user: () => [...queryKeys.auth.all, 'user'] as const,
	},
	test: {
		all: ['test'] as const,
		list: () => [...queryKeys.test.all, 'list'] as const,
		detail: (id: string) => [...queryKeys.test.all, 'detail', id] as const,
		results: (id: string) => [...queryKeys.test.all, 'results', id] as const,
	},
	user: {
		all: ['user'] as const,
		profile: () => [...queryKeys.user.all, 'profile'] as const,
		responses: (id: string) => [...queryKeys.user.all, 'responses', id] as const,
	},
} as const;
