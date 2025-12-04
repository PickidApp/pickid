import type { TestType, TestStatus } from '@pickid/supabase';
import type { CategoryStatus } from '@/services/category.service';
import type { UserStatus, UserProvider } from '@/services/user.service';

export interface TTestListFilters {
	type?: TestType;
	status?: TestStatus;
	search?: string;
}

export interface TCategoryListFilters {
	status?: CategoryStatus;
	search?: string;
}

export interface TUserListFilters {
	status?: UserStatus;
	provider?: UserProvider;
	search?: string;
}
