import { useMutation, useQueryClient } from '@tanstack/react-query';
import { themeService } from '@/services/theme.service';
import type { ThemePayload } from '@/types/theme';
import { themeQueryKeys, testQueryKeys } from '../query-keys';

export function useCreateTheme() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: ThemePayload) => themeService.createTheme(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: themeQueryKeys._def });
			queryClient.invalidateQueries({ queryKey: testQueryKeys.themesList.queryKey });
		},
	});
}

export function useUpdateTheme() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ themeId, payload }: { themeId: string; payload: ThemePayload }) =>
			themeService.updateTheme(themeId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: themeQueryKeys._def });
			queryClient.invalidateQueries({ queryKey: testQueryKeys.themesList.queryKey });
		},
	});
}

export function useDeleteTheme() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (themeId: string) => themeService.deleteTheme(themeId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: themeQueryKeys._def });
			queryClient.invalidateQueries({ queryKey: testQueryKeys.themesList.queryKey });
		},
	});
}

export function useUpdateThemeStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ themeId, is_active }: { themeId: string; is_active: boolean }) =>
			themeService.updateThemeStatus(themeId, is_active),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: themeQueryKeys._def });
			queryClient.invalidateQueries({ queryKey: testQueryKeys.themesList.queryKey });
		},
	});
}

export function useAddTestsToTheme() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ themeId, testIds }: { themeId: string; testIds: string[] }) =>
			themeService.addTestsToTheme(themeId, testIds),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: themeQueryKeys._def });
			queryClient.invalidateQueries({ queryKey: testQueryKeys._def });
		},
	});
}

export function useRemoveTestFromTheme() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (testId: string) => themeService.removeTestFromTheme(testId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: themeQueryKeys._def });
			queryClient.invalidateQueries({ queryKey: testQueryKeys._def });
		},
	});
}
