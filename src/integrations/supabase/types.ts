export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      traffic_data: {
        Row: {
          average_speed: number | null
          congestion_level: number
          created_at: string
          id: string
          latitude: number
          location_id: number
          location_name: string
          longitude: number
          timestamp: string
          traffic_status: string
          vehicle_count: number | null
        }
        Insert: {
          average_speed?: number | null
          congestion_level: number
          created_at?: string
          id?: string
          latitude: number
          location_id: number
          location_name: string
          longitude: number
          timestamp?: string
          traffic_status: string
          vehicle_count?: number | null
        }
        Update: {
          average_speed?: number | null
          congestion_level?: number
          created_at?: string
          id?: string
          latitude?: number
          location_id?: number
          location_name?: string
          longitude?: number
          timestamp?: string
          traffic_status?: string
          vehicle_count?: number | null
        }
        Relationships: []
      }
      traffic_incidents: {
        Row: {
          created_at: string
          description: string
          estimated_end_time: string | null
          id: string
          incident_type: string
          latitude: number
          location_id: number
          longitude: number
          resolved: boolean | null
          severity: string
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          estimated_end_time?: string | null
          id?: string
          incident_type: string
          latitude: number
          location_id: number
          longitude: number
          resolved?: boolean | null
          severity: string
          start_time?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          estimated_end_time?: string | null
          id?: string
          incident_type?: string
          latitude?: number
          location_id?: number
          longitude?: number
          resolved?: boolean | null
          severity?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      traffic_signals: {
        Row: {
          created_at: string
          current_phase: string
          cycle_time: number
          id: string
          is_optimized: boolean | null
          last_optimized: string | null
          latitude: number
          location_id: number
          location_name: string
          longitude: number
          next_phase_in: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_phase: string
          cycle_time?: number
          id?: string
          is_optimized?: boolean | null
          last_optimized?: string | null
          latitude: number
          location_id: number
          location_name: string
          longitude: number
          next_phase_in?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_phase?: string
          cycle_time?: number
          id?: string
          is_optimized?: boolean | null
          last_optimized?: string | null
          latitude?: number
          location_id?: number
          location_name?: string
          longitude?: number
          next_phase_in?: number
          updated_at?: string
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          created_at: string
          humidity: number | null
          icon: string | null
          id: string
          location: string
          temperature: number | null
          timestamp: string
          visibility: number | null
          weather_condition: string | null
          weather_description: string | null
          wind_speed: number | null
        }
        Insert: {
          created_at?: string
          humidity?: number | null
          icon?: string | null
          id?: string
          location?: string
          temperature?: number | null
          timestamp?: string
          visibility?: number | null
          weather_condition?: string | null
          weather_description?: string | null
          wind_speed?: number | null
        }
        Update: {
          created_at?: string
          humidity?: number | null
          icon?: string | null
          id?: string
          location?: string
          temperature?: number | null
          timestamp?: string
          visibility?: number | null
          weather_condition?: string | null
          weather_description?: string | null
          wind_speed?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
