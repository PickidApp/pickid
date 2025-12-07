import { useMutation, useQueryClient } from '@tanstack/react-query';
import { seriesService } from '@/services/series.service';
import type { SeriesPayload } from '@/types/series';
import { seriesQueryKeys, testQueryKeys } from '../query-keys';

export function useCreateSeries() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: SeriesPayload) => seriesService.createSeries(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: seriesQueryKeys._def });
			queryClient.invalidateQueries({ queryKey: testQueryKeys.seriesList.queryKey });
		},
	});
}

export function useUpdateSeries() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ seriesId, payload }: { seriesId: string; payload: SeriesPayload }) =>
			seriesService.updateSeries(seriesId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: seriesQueryKeys._def });
			queryClient.invalidateQueries({ queryKey: testQueryKeys.seriesList.queryKey });
		},
	});
}

export function useDeleteSeries() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (seriesId: string) => seriesService.deleteSeries(seriesId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: seriesQueryKeys._def });
			queryClient.invalidateQueries({ queryKey: testQueryKeys.seriesList.queryKey });
		},
	});
}

export function useUpdateSeriesStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ seriesId, is_active }: { seriesId: string; is_active: boolean }) =>
			seriesService.updateSeriesStatus(seriesId, is_active),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: seriesQueryKeys._def });
			queryClient.invalidateQueries({ queryKey: testQueryKeys.seriesList.queryKey });
		},
	});
}

export function useAddTestsToSeries() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ seriesId, testIds }: { seriesId: string; testIds: string[] }) =>
			seriesService.addTestsToSeries(seriesId, testIds),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: seriesQueryKeys._def });
			queryClient.invalidateQueries({ queryKey: testQueryKeys._def });
		},
	});
}

export function useRemoveTestFromSeries() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (testId: string) => seriesService.removeTestFromSeries(testId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: seriesQueryKeys._def });
			queryClient.invalidateQueries({ queryKey: testQueryKeys._def });
		},
	});
}

export function useUpdateSeriesTestOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ seriesId, testIds }: { seriesId: string; testIds: string[] }) =>
			seriesService.updateSeriesTestOrder(seriesId, testIds),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: seriesQueryKeys._def });
		},
	});
}
