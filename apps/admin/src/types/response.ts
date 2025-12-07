import type { AdminTestSession } from '@pickid/supabase';

// AdminTestSession의 status, device_type은 string 타입
// 컴포넌트에서 as const로 타입 단언 필요
export type ResponseStatus = 'completed' | 'in_progress' | 'abandoned';
export type ResponseDeviceType = 'mobile' | 'desktop' | 'tablet';

// Re-export AdminTestSession as Response for convenience
export type Response = AdminTestSession;

export interface IFetchResponsesOptions {
	testId?: string;
	status?: ResponseStatus;
	deviceType?: ResponseDeviceType;
	resultId?: string;
	search?: string;
	startDate?: string;
	endDate?: string;
	page?: number;
	pageSize?: number;
}

export interface ResponsesResponse {
	responses: Response[];
	count: number;
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
