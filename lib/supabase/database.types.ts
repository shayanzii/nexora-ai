/**
 * Supabase `leads` table row shape.
 * Column names use snake_case to match PostgreSQL conventions.
 */
export type LeadRow = {
  id: string;
  full_name: string;
  email: string;
  company: string | null;
  budget: string | null;
  project_description: string;
  status: string;
  created_at: string;
};

export type LeadInsert = Omit<LeadRow, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
