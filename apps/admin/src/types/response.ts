import type { TestSessionStatus, DeviceType } from '@pickid/supabase';

export interface IFetchResponsesOptions {
	testId?: string;
	status?: TestSessionStatus;
	deviceType?: DeviceType;
	resultId?: string;
	search?: string;
	startDate?: string;
	endDate?: string;
	page?: number;
	pageSize?: number;
}

export interface ResponseStats {
	total: number;
	completed: number;
	in_progress: number;
	abandoned: number;
	completion_rate: number;
	avg_completion_time_seconds: number;
	mobile_count: number;
	desktop_count: number;
	tablet_count: number;
	mobile_rate: number;
}
