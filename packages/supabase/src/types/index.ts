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

// Users
export type User = TableRow<'users'>;
export type UserInsert = TableInsert<'users'>;
export type UserUpdate = TableUpdate<'users'>;

// Enums
export type TestType = Enum<'test_type'>;
export type TestStatus = Enum<'test_status'>;
export type QuestionType = Enum<'question_type'>;
export type ResultConditionType = Enum<'result_condition_type'>;
