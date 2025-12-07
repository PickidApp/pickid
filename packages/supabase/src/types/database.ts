export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      feedback: {
        Row: {
          admin_note: string | null
          category: Database["public"]["Enums"]["feedback_category"]
          content: string
          created_at: string
          id: string
          session_id: string | null
          status: Database["public"]["Enums"]["feedback_status"]
          test_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_note?: string | null
          category: Database["public"]["Enums"]["feedback_category"]
          content: string
          created_at?: string
          id?: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
          test_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_note?: string | null
          category?: Database["public"]["Enums"]["feedback_category"]
          content?: string
          created_at?: string
          id?: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
          test_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "admin_test_sessions_view"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "test_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_admin_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_events: {
        Row: {
          created_at: string
          event_type: string
          funnel_step: Database["public"]["Enums"]["funnel_step"]
          id: string
          metadata: Json
          occurred_at: string
          session_id: string | null
          share_channel: string | null
          test_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          funnel_step: Database["public"]["Enums"]["funnel_step"]
          id?: string
          metadata?: Json
          occurred_at?: string
          session_id?: string | null
          share_channel?: string | null
          test_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          funnel_step?: Database["public"]["Enums"]["funnel_step"]
          id?: string
          metadata?: Json
          occurred_at?: string
          session_id?: string | null
          share_channel?: string | null
          test_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funnel_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "web_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funnel_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_admin_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funnel_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      test_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["test_category_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["test_category_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["test_category_status"]
          updated_at?: string
        }
        Relationships: []
      }
      test_category_map: {
        Row: {
          category_id: string
          created_at: string
          test_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          test_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_category_map_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "test_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_category_map_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_choices: {
        Row: {
          code: string | null
          created_at: string
          id: string
          image_url: string | null
          is_correct: boolean | null
          order: number
          question_id: string
          score: number
          text: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_correct?: boolean | null
          order: number
          question_id: string
          score?: number
          text: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_correct?: boolean | null
          order?: number
          question_id?: string
          score?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_choices_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "test_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      test_questions: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          order: number
          question_type: Database["public"]["Enums"]["question_type"]
          settings: Json
          test_id: string
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          order: number
          question_type: Database["public"]["Enums"]["question_type"]
          settings?: Json
          test_id: string
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          order?: number
          question_type?: Database["public"]["Enums"]["question_type"]
          settings?: Json
          test_id?: string
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_results: {
        Row: {
          background_image_url: string | null
          condition_type: Database["public"]["Enums"]["result_condition_type"]
          created_at: string
          description: string | null
          id: string
          match_condition: Json
          metadata: Json
          name: string
          order: number
          slug: string | null
          test_id: string
          theme_color: string | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          background_image_url?: string | null
          condition_type: Database["public"]["Enums"]["result_condition_type"]
          created_at?: string
          description?: string | null
          id?: string
          match_condition?: Json
          metadata?: Json
          name: string
          order?: number
          slug?: string | null
          test_id: string
          theme_color?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          background_image_url?: string | null
          condition_type?: Database["public"]["Enums"]["result_condition_type"]
          created_at?: string
          description?: string | null
          id?: string
          match_condition?: Json
          metadata?: Json
          name?: string
          order?: number
          slug?: string | null
          test_id?: string
          theme_color?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_series: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      test_session_answers: {
        Row: {
          answer_text: string | null
          answered_at: string
          choice_id: string | null
          id: string
          order: number
          question_id: string
          session_id: string
        }
        Insert: {
          answer_text?: string | null
          answered_at?: string
          choice_id?: string | null
          id?: string
          order: number
          question_id: string
          session_id: string
        }
        Update: {
          answer_text?: string | null
          answered_at?: string
          choice_id?: string | null
          id?: string
          order?: number
          question_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_session_answers_choice_id_fkey"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "test_choices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_session_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "test_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_session_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "admin_test_sessions_view"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "test_session_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "test_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      test_sessions: {
        Row: {
          completed_at: string | null
          completion_time_seconds: number | null
          created_at: string
          device_type: Database["public"]["Enums"]["device_type"] | null
          id: string
          ip_address: string | null
          referrer: string | null
          result_id: string | null
          started_at: string
          status: Database["public"]["Enums"]["test_session_status"]
          test_id: string
          total_score: number | null
          updated_at: string
          user_agent: string | null
          user_id: string | null
          web_session_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_time_seconds?: number | null
          created_at?: string
          device_type?: Database["public"]["Enums"]["device_type"] | null
          id?: string
          ip_address?: string | null
          referrer?: string | null
          result_id?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["test_session_status"]
          test_id: string
          total_score?: number | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
          web_session_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_time_seconds?: number | null
          created_at?: string
          device_type?: Database["public"]["Enums"]["device_type"] | null
          id?: string
          ip_address?: string | null
          referrer?: string | null
          result_id?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["test_session_status"]
          test_id?: string
          total_score?: number | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
          web_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_sessions_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "test_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_sessions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_admin_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_sessions_web_session_id_fkey"
            columns: ["web_session_id"]
            isOneToOne: false
            referencedRelation: "web_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      test_themes: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          start_date: string | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          start_date?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          start_date?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tests: {
        Row: {
          created_at: string
          description: string | null
          estimated_time_minutes: number | null
          id: string
          intro_text: string | null
          operation_memo: string | null
          production_priority: Database["public"]["Enums"]["production_priority"] | null
          published_at: string | null
          recommended_slot: Database["public"]["Enums"]["recommended_slot_type"] | null
          requires_gender: boolean
          scheduled_at: string | null
          series_id: string | null
          series_order: number | null
          settings: Json
          slug: string
          status: Database["public"]["Enums"]["test_status"]
          target_release_date: string | null
          theme_id: string | null
          thumbnail_url: string | null
          title: string
          type: Database["public"]["Enums"]["test_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_time_minutes?: number | null
          id?: string
          intro_text?: string | null
          operation_memo?: string | null
          production_priority?: Database["public"]["Enums"]["production_priority"] | null
          published_at?: string | null
          recommended_slot?: Database["public"]["Enums"]["recommended_slot_type"] | null
          requires_gender?: boolean
          scheduled_at?: string | null
          series_id?: string | null
          series_order?: number | null
          settings?: Json
          slug: string
          status?: Database["public"]["Enums"]["test_status"]
          target_release_date?: string | null
          theme_id?: string | null
          thumbnail_url?: string | null
          title: string
          type: Database["public"]["Enums"]["test_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_time_minutes?: number | null
          id?: string
          intro_text?: string | null
          operation_memo?: string | null
          production_priority?: Database["public"]["Enums"]["production_priority"] | null
          published_at?: string | null
          recommended_slot?: Database["public"]["Enums"]["recommended_slot_type"] | null
          requires_gender?: boolean
          scheduled_at?: string | null
          series_id?: string | null
          series_order?: number | null
          settings?: Json
          slug?: string
          status?: Database["public"]["Enums"]["test_status"]
          target_release_date?: string | null
          theme_id?: string | null
          thumbnail_url?: string | null
          title?: string
          type?: Database["public"]["Enums"]["test_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tests_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "test_series"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tests_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "test_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_user_id: string | null
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          meta: Json | null
          name: string | null
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          meta?: Json | null
          name?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          meta?: Json | null
          name?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      web_sessions: {
        Row: {
          channel: Database["public"]["Enums"]["channel_type"]
          conversion_type: Database["public"]["Enums"]["conversion_type"]
          converted: boolean
          created_at: string
          device_type: Database["public"]["Enums"]["device_type"]
          ended_at: string | null
          id: string
          landing_page: string
          page_views: number
          referrer: string | null
          started_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          channel?: Database["public"]["Enums"]["channel_type"]
          conversion_type?: Database["public"]["Enums"]["conversion_type"]
          converted?: boolean
          created_at?: string
          device_type?: Database["public"]["Enums"]["device_type"]
          ended_at?: string | null
          id?: string
          landing_page: string
          page_views?: number
          referrer?: string | null
          started_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          channel?: Database["public"]["Enums"]["channel_type"]
          conversion_type?: Database["public"]["Enums"]["conversion_type"]
          converted?: boolean
          created_at?: string
          device_type?: Database["public"]["Enums"]["device_type"]
          ended_at?: string | null
          id?: string
          landing_page?: string
          page_views?: number
          referrer?: string | null
          started_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "web_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_admin_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "web_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_test_sessions_view: {
        Row: {
          completed_at: string | null
          completion_time_seconds: number | null
          created_at: string | null
          device_type: Database["public"]["Enums"]["device_type"] | null
          ip_address: string | null
          referrer: string | null
          result_id: string | null
          result_name: string | null
          session_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["test_session_status"] | null
          test_id: string | null
          test_slug: string | null
          test_title: string | null
          test_type: Database["public"]["Enums"]["test_type"] | null
          total_score: number | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
          web_session_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_sessions_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "test_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_sessions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_admin_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_sessions_web_session_id_fkey"
            columns: ["web_session_id"]
            isOneToOne: false
            referencedRelation: "web_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_growth_view: {
        Row: {
          completed_sessions: number | null
          date: string | null
          test_sessions: number | null
          web_sessions: number | null
        }
        Relationships: []
      }
      user_admin_view: {
        Row: {
          auth_user_id: string | null
          avatar_url: string | null
          completed_sessions: number | null
          created_at: string | null
          email: string | null
          feedback_count: number | null
          id: string | null
          last_completed_at: string | null
          name: string | null
          role: string | null
          status: string | null
          total_sessions: number | null
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          avatar_url?: string | null
          completed_sessions?: never
          created_at?: string | null
          email?: string | null
          feedback_count?: never
          id?: string | null
          last_completed_at?: never
          name?: string | null
          role?: string | null
          status?: string | null
          total_sessions?: never
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          avatar_url?: string | null
          completed_sessions?: never
          created_at?: string | null
          email?: string | null
          feedback_count?: never
          id?: string | null
          last_completed_at?: never
          name?: string | null
          role?: string | null
          status?: string | null
          total_sessions?: never
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_test_session: { Args: { p_session_id: string }; Returns: boolean }
      duplicate_test: {
        Args: { p_new_slug?: string; p_new_title?: string; p_test_id: string }
        Returns: Json
      }
      get_admin_session_detail: {
        Args: { p_session_id: string }
        Returns: Json
      }
      get_admin_session_stats: {
        Args: {
          p_device_type?: string
          p_end_date?: string
          p_result_id?: string
          p_search?: string
          p_start_date?: string
          p_status?: string
          p_test_id?: string
        }
        Returns: Json
      }
      get_admin_test_sessions: {
        Args: {
          p_device_type?: string
          p_end_date?: string
          p_page?: number
          p_page_size?: number
          p_result_id?: string
          p_search?: string
          p_start_date?: string
          p_status?: string
          p_test_id?: string
        }
        Returns: {
          categories: string[]
          completed_at: string
          completion_time_seconds: number
          device_type: string
          result_name: string
          session_id: string
          started_at: string
          status: string
          test_id: string
          test_slug: string
          test_title: string
          test_type: string
          total_count: number
          total_score: number
        }[]
      }
      get_channel_analysis: {
        Args: { p_from: string; p_to: string }
        Returns: {
          channel: string
          completions: number
          conversion_rate: number
          label: string
          sessions: number
        }[]
      }
      get_channel_share: {
        Args: { p_from: string; p_to: string }
        Returns: {
          channel: string
          converted_sessions: number
          sessions: number
        }[]
      }
      get_cohort_analysis: {
        Args: { p_weeks?: number }
        Returns: {
          cohort: string
          retention: number
          users: number
          week_index: number
        }[]
      }
      get_current_theme: {
        Args: never
        Returns: {
          description: string
          end_date: string
          id: string
          name: string
          slug: string
          start_date: string
          test_count: number
          thumbnail_url: string
        }[]
      }
      get_dashboard_summary: {
        Args: { p_from: string; p_to: string }
        Returns: {
          avg_tests_per_session: number
          completed_sessions: number
          completion_rate: number
          new_feedback: number
          new_users: number
          published_tests: number
          today_shares: number
          total_sessions: number
          total_web_sessions: number
          web_conversion_rate: number
        }[]
      }
      get_featured_test: {
        Args: never
        Returns: {
          category_name: string
          completion_rate: number
          id: string
          score: number
          slug: string
          thumbnail_url: string
          title: string
          today_responses: number
          today_shares: number
        }[]
      }
      get_funnel_analysis: {
        Args: { p_from: string; p_to: string }
        Returns: {
          count: number
          dropoff: number
          label: string
          rate: number
          step: string
        }[]
      }
      get_global_funnel: {
        Args: { p_from: string; p_to: string }
        Returns: {
          count: number
          funnel_step: string
        }[]
      }
      get_growth_summary: {
        Args: { p_from: string; p_to: string }
        Returns: {
          avg_duration_change: number
          avg_session_duration: number
          completion_rate: number
          completion_rate_change: number
          total_sessions: number
          total_sessions_change: number
          total_visits: number
          total_visits_change: number
        }[]
      }
      get_landing_page_analysis: {
        Args: { p_from: string; p_to: string }
        Returns: {
          completions: number
          conversion_rate: number
          path: string
          sessions: number
          visits: number
        }[]
      }
      get_session_categories: { Args: { p_test_id: string }; Returns: string[] }
      get_share_based_sessions: {
        Args: { p_from: string; p_to: string }
        Returns: {
          new_user_rate: number
          new_user_sessions: number
          total_sessions: number
        }[]
      }
      get_share_channel_stats: {
        Args: { p_from: string; p_to: string }
        Returns: {
          channel: string
          label: string
          percentage: number
          shares: number
        }[]
      }
      get_test_funnel: {
        Args: { p_from: string; p_test_id: string; p_to: string }
        Returns: {
          count: number
          funnel_step: string
        }[]
      }
      get_test_with_details: { Args: { p_test_id: string }; Returns: Json }
      get_theme_tests: {
        Args: { p_limit?: number; p_theme_id: string }
        Returns: {
          id: string
          response_count: number
          slug: string
          thumbnail_url: string
          title: string
        }[]
      }
      get_series_list: {
        Args: never
        Returns: {
          id: string
          name: string
          slug: string
          is_active: boolean
          test_count: number
        }[]
      }
      get_themes_list: {
        Args: never
        Returns: {
          id: string
          name: string
          slug: string
          is_active: boolean
          start_date: string | null
          end_date: string | null
          test_count: number
        }[]
      }
      get_user_summary: {
        Args: never
        Returns: {
          active_count: number
          deleted_count: number
          inactive_count: number
          total_count: number
        }[]
      }
      get_viral_metrics: {
        Args: { p_from: string; p_to: string }
        Returns: {
          avg_tests_per_session: number
          share_conversion_rate: number
          total_completions: number
          total_shares: number
        }[]
      }
      is_admin: { Args: { uid?: string }; Returns: boolean }
      publish_test: {
        Args: { p_scheduled_at?: string; p_test_id: string }
        Returns: Json
      }
      sync_test_questions: {
        Args: { p_questions: Json; p_test_id: string }
        Returns: Json
      }
      sync_test_results: {
        Args: { p_results: Json; p_test_id: string }
        Returns: Json
      }
      upsert_test_metadata: { Args: { p_test: Json }; Returns: Json }
    }
    Enums: {
      channel_type:
        | "direct"
        | "search"
        | "social"
        | "email"
        | "external"
        | "other"
      conversion_type:
        | "none"
        | "signup"
        | "test_start"
        | "test_complete"
        | "other"
      device_type: "mobile" | "desktop" | "tablet"
      feedback_category: "bug" | "feature" | "ui" | "etc"
      feedback_status: "new" | "in_progress" | "resolved" | "rejected"
      funnel_step:
        | "visit"
        | "signup"
        | "test_start"
        | "test_complete"
        | "revisit"
        | "share"
      question_type: "single_choice" | "multiple_choice" | "short_answer"
      result_condition_type:
        | "score_range"
        | "choice_ratio"
        | "quiz_score"
        | "custom"
      test_category_status: "active" | "inactive"
      test_session_status: "in_progress" | "completed" | "abandoned"
      test_status: "draft" | "published" | "scheduled" | "archived"
      test_type: "psychology" | "balance" | "quiz" | "other"
      recommended_slot_type: "none" | "today_pick" | "theme_pick"
      production_priority: "low" | "medium" | "high"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      channel_type: [
        "direct",
        "search",
        "social",
        "email",
        "external",
        "other",
      ],
      conversion_type: [
        "none",
        "signup",
        "test_start",
        "test_complete",
        "other",
      ],
      device_type: ["mobile", "desktop", "tablet"],
      feedback_category: ["bug", "feature", "ui", "etc"],
      feedback_status: ["new", "in_progress", "resolved", "rejected"],
      funnel_step: [
        "visit",
        "signup",
        "test_start",
        "test_complete",
        "revisit",
        "share",
      ],
      question_type: ["single_choice", "multiple_choice", "short_answer"],
      result_condition_type: [
        "score_range",
        "choice_ratio",
        "quiz_score",
        "custom",
      ],
      test_category_status: ["active", "inactive"],
      test_session_status: ["in_progress", "completed", "abandoned"],
      test_status: ["draft", "published", "scheduled", "archived"],
      test_type: ["psychology", "balance", "quiz", "other"],
      recommended_slot_type: ["none", "today_pick", "theme_pick"],
      production_priority: ["low", "medium", "high"],
    },
  },
} as const
