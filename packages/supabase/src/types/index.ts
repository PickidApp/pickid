export type { Database, Json } from './database';
import type { Database } from './database';

type TableRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type TableInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
type TableUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
type Enum<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Categories
export type Category = TableRow<'test_categories'>;
export type CategoryInsert = TableInsert<'test_categories'>;
export type CategoryUpdate = TableUpdate<'test_categories'>;
export type CategoryStatus = Enum<'test_category_status'>;

// Tests
export type Test = TableRow<'tests'>;
export type TestInsert = TableInsert<'tests'>;
export type TestUpdate = TableUpdate<'tests'>;

// Test Questions
export type TestQuestion = TableRow<'test_questions'>;
export type TestQuestionInsert = TableInsert<'test_questions'>;
export type TestQuestionUpdate = TableUpdate<'test_questions'>;

// Test Choices
export type TestChoice = TableRow<'test_choices'>;
export type TestChoiceInsert = TableInsert<'test_choices'>;
export type TestChoiceUpdate = TableUpdate<'test_choices'>;

// Test Results
export type TestResult = TableRow<'test_results'>;
export type TestResultInsert = TableInsert<'test_results'>;
export type TestResultUpdate = TableUpdate<'test_results'>;

// Test 응답 관련
export type TestSession = TableRow<'test_sessions'>;
export type TestSessionInsert = TableInsert<'test_sessions'>;
export type TestSessionUpdate = TableUpdate<'test_sessions'>;
export type TestSessionStatus = Enum<'test_session_status'>;

// Users
export type User = TableRow<'users'>;
export type UserInsert = TableInsert<'users'>;
export type UserUpdate = TableUpdate<'users'>;

// Feedback
export type Feedback = TableRow<'feedback'>;
export type FeedbackInsert = TableInsert<'feedback'>;
export type FeedbackUpdate = TableUpdate<'feedback'>;

// Series & Themes
export type TestSeries = TableRow<'test_series'>;
export type TestSeriesInsert = TableInsert<'test_series'>;
export type TestSeriesUpdate = TableUpdate<'test_series'>;
export type TestTheme = TableRow<'test_themes'>;
export type TestThemeInsert = TableInsert<'test_themes'>;
export type TestThemeUpdate = TableUpdate<'test_themes'>;

// Enums
export type TestType = Enum<'test_type'>;
export type TestStatus = Enum<'test_status'>;
export type QuestionType = Enum<'question_type'>;
export type ResultConditionType = Enum<'result_condition_type'>;
export type FeedbackCategory = Enum<'feedback_category'>;
export type FeedbackStatus = Enum<'feedback_status'>;
export type FunnelStep = Enum<'funnel_step'>;
export type DeviceType = Enum<'device_type'>;
export type ChannelType = Enum<'channel_type'>;
export type ConversionType = Enum<'conversion_type'>;
export type RecommendedSlotType = Enum<'recommended_slot_type'>;
export type ProductionPriority = Enum<'production_priority'>;

// RPC Function Return Types
type FunctionReturn<T extends keyof Database['public']['Functions']> =
	Database['public']['Functions'][T]['Returns'];

// Dashboard RPC
export type DashboardSummary = FunctionReturn<'get_dashboard_summary'>[number];
export type ChannelShare = FunctionReturn<'get_channel_share'>[number];
export type GlobalFunnel = FunctionReturn<'get_global_funnel'>[number];
export type TestFunnel = FunctionReturn<'get_test_funnel'>[number];

// Growth & Analytics RPC
export type GrowthSummary = FunctionReturn<'get_growth_summary'>[number];
export type ChannelAnalysis = FunctionReturn<'get_channel_analysis'>[number];
export type FunnelAnalysis = FunctionReturn<'get_funnel_analysis'>[number];
export type LandingPageAnalysis = FunctionReturn<'get_landing_page_analysis'>[number];
export type CohortAnalysis = FunctionReturn<'get_cohort_analysis'>[number];

// User RPC
export type UserSummary = FunctionReturn<'get_user_summary'>[number];

// Admin Session RPC
export type AdminTestSession = FunctionReturn<'get_admin_test_sessions'>[number];

// Viral Analytics RPC
export type ViralMetrics = FunctionReturn<'get_viral_metrics'>[number];
export type ShareChannelStats = FunctionReturn<'get_share_channel_stats'>[number];
export type ShareBasedSessions = FunctionReturn<'get_share_based_sessions'>[number];

// Dashboard RPC (Extended)
export type FeaturedTest = FunctionReturn<'get_featured_test'>[number];
export type CurrentTheme = FunctionReturn<'get_current_theme'>[number];
export type ThemeTest = FunctionReturn<'get_theme_tests'>[number];

// Series & Themes List (for form selects)
export type SeriesListItem = FunctionReturn<'get_series_list'>[number];
export type ThemesListItem = FunctionReturn<'get_themes_list'>[number];
