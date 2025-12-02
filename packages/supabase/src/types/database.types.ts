// Supabase Database Types
// 이 파일은 `pnpm types-local` 또는 `pnpm types` 명령어로 자동 생성됩니다.
// 로컬 타입 생성: pnpm types-local (로컬 Supabase 실행 필요)
// 프로덕션 타입 생성: pnpm types (SUPABASE_PROJECT_ID 환경 변수 필요)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      [key: string]: string;
    };
  };
};
