export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
export type TimeSlot = Database["public"]["Tables"]["time_slots"]["Row"];
export type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type Status = Database["public"]["Tables"]["status"]["Row"];
export type Patient = Database["public"]["Tables"]["patients"]["Row"];
export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type Inventory = Database["public"]["Tables"]["inventory"]["Row"];
export type User = Database["public"]["Tables"]["profiles"]["Row"];
export type Doctor = Database["public"]["Tables"]["doctors"]["Row"];

export type PatientCol = Tables<"patients"> & {
  name: string | null;
  sex: string | null;
  email: string | null;
  address: {
    id?: number;
    address: string;
    latitude: number;
    longitude: number;
  } | null; // Ensure it's defined as an object
  dob: string | null;
  age: number | null;
  phone_number: number | null;
};
export type AppointmentsCol = Tables<"appointments"> & {
  branch: Tables<"branch"> | null; // Example: Relationship to branch table
  patients: Tables<"patients"> | null; // Example: Relationship to patients table
  services: Tables<"services"> | null; // Example: Relationship to services table
  status: Tables<"status"> | null; // Example: Relationship to status table
  time_slots: Tables<"time_slots"> | null; // Example: Relationship to time_slots table
};
export type InventoryCol = Tables<"inventory"> & {
  branch: Tables<"branch"> | null;
  name: string | null;
  quantity: number | null;
  description: string | null;
};
export type ServicesCol = Tables<"services"> & {
  name: string | null;
  description: string | null;
  price: number | null;
};
export type UserCol = Tables<"profiles"> & {
  name: string | null;
  email: string | null;
};
export type DoctorCol = Tables<"doctors"> & {
  name: string | null;
  contact_info: string | null;
  email: string | null;
  
};


export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          address: string;
          id: number;
          latitude: number;
          longitude: number;
        };
        Insert: {
          address: string;
          id?: number;
          latitude: number;
          longitude: number;
        };
        Update: {
          address?: string;
          id?: number;
          latitude?: number;
          longitude?: number;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          patients: any;
          appointment_ticket: string | null;
          branch: number | null;
          date: string | null;
          deleteOn: string | null;
          id: number;
          patient_id: number | null;
          service: number | null;
          status: number | null;
          time: number | null;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          appointment_ticket?: string | null;
          branch?: number | null;
          date?: string | null;
          deleteOn?: string | null;
          id?: number;
          patient_id?: number | null;
          service?: number | null;
          status?: number | null;
          time?: number | null;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          appointment_ticket?: string | null;
          branch?: number | null;
          date?: string | null;
          deleteOn?: string | null;
          id?: number;
          patient_id?: number | null;
          service?: number | null;
          status?: number | null;
          time?: number | null;
          type?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_branch_fkey";
            columns: ["branch"];
            isOneToOne: false;
            referencedRelation: "branch";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_patient_id_foreign";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_service_fkey";
            columns: ["service"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_status_fkey";
            columns: ["status"];
            isOneToOne: false;
            referencedRelation: "status";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_time_fkey";
            columns: ["time"];
            isOneToOne: false;
            referencedRelation: "time_slots";
            referencedColumns: ["id"];
          }
        ];
      };
      branch: {
        Row: {
          addr: number | null;
          address: string | null;
          id: number;
          name: string | null;
        };
        Insert: {
          addr?: number | null;
          address?: string | null;
          id?: number;
          name?: string | null;
        };
        Update: {
          addr?: number | null;
          address?: string | null;
          id?: number;
          name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "branch_addr_fkey";
            columns: ["addr"];
            isOneToOne: false;
            referencedRelation: "addresses";
            referencedColumns: ["id"];
          }
        ];
      };
      doctors: {
        Row: {
          deleteOn: string | null;
          contact_info: string | null;
          id: number;
          name: string | null;
          branch?: number | null;
          updated_at: string | null;
          email?: string | null;
        };
        Insert: {
          deleteOn: string | null;
          contact_info: string | null;
          id: number;
          name: string | null;
          branch?: number | null;
          updated_at: string | null;
          email?: string | null;
        };
        Update: {
          deleteOn: string | null;
          contact_info: string | null;
          id: number;
          name: string | null;
          branch?: number | null;
          updated_at: string | null;
          email?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "doctors_branch_fkey";
            columns: ["branch"];
            isOneToOne: false;
            referencedRelation: "branch";
            referencedColumns: ["id"];
          }
        ];
      };
      inventory: {
        Row: {
          deleteOn: string | null;
          description: string;
          id: number;
          name: string;
          quantity: number;
          updated_at: string | null;
          branch: number | null;
        };
        Insert: {
          deleteOn?: string | null;
          description: string;
          id?: number;
          name: string;
          quantity: number;
          updated_at?: string | null;
          branch?: number | null;
        };
        Update: {
          deleteOn?: string | null;
          description?: string;
          id?: number;
          name?: string;
          quantity?: number;
          updated_at?: string | null;
          branch?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_branch_fkey";
            columns: ["branch"];
            isOneToOne: false;
            referencedRelation: "branch";
            referencedColumns: ["id"];
          }
        ];
      };
      patients: {
        Row: {
          address: number | null;
          age: number | null;
          created_at: string | null;
          deleteOn: string | null;
          dob: string | null;
          email: string | null;
          id: number;
          name: string | null;
          phone_number: number | null;
          sex: string | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          address?: number | null;
          age?: number | null;
          created_at?: string | null;
          deleteOn?: string | null;
          dob?: string | null;
          email?: string | null;
          id?: number;
          name?: string | null;
          phone_number?: number | null;
          sex?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          address?: number | null;
          age?: number | null;
          created_at?: string | null;
          deleteOn?: string | null;
          dob?: string | null;
          email?: string | null;
          id?: number;
          name?: string | null;
          phone_number?: number | null;
          sex?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "patients_address_fkey";
            columns: ["address"];
            isOneToOne: false;
            referencedRelation: "addresses";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          email: string | null;
          id: string;
          name: string | null;
          updated_at: string | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          email?: string | null;
          id: string;
          name?: string | null;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          email?: string | null;
          id?: string;
          name?: string | null;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      services: {
        Row: {
          email: string;
          deleteOn: string | null;
          description: string | null;
          id: number;
          name: string | null;
          price: number | null;
          updated_at: string | null;
        };
        Insert: {
          deleteOn?: string | null;
          description?: string | null;
          id?: number;
          name?: string | null;
          price?: number | null;
          updated_at?: string | null;
        };
        Update: {
          deleteOn?: string | null;
          description?: string | null;
          id?: number;
          name?: string | null;
          price?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      status: {
        Row: {
          id: number;
          name: string | null;
        };
        Insert: {
          id?: number;
          name?: string | null;
        };
        Update: {
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      time_slots: {
        Row: {
          id: number;
          time: string;
        };
        Insert: {
          id?: number;
          time: string;
        };
        Update: {
          id?: number;
          time?: string;
        };
        Relationships: [];
      };
      treatment_records: {
        Row: {
          amount: number | null;
          date: string | null;
          description: string | null;
          doctor_id: number | null;
          id: number;
          patient_id: number | null;
          service_id: number | null;
        };
        Insert: {
          amount?: number | null;
          date?: string | null;
          description?: string | null;
          doctor_id?: number | null;
          id?: number;
          patient_id?: number | null;
          service_id?: number | null;
        };
        Update: {
          amount?: number | null;
          date?: string | null;
          description?: string | null;
          doctor_id?: number | null;
          id?: number;
          patient_id?: number | null;
          service_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "treatment_records_doctor_id_foreign";
            columns: ["doctor_id"];
            isOneToOne: false;
            referencedRelation: "doctors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "treatment_records_patient_id_foreign";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "treatment_records_service_id_foreign";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_all_tables_data: {
        Args: Record<PropertyKey, never>;
        Returns: {
          table_name: string;
          row_data: Json;
        }[];
      };
      get_appointments_by_time: {
        Args: {
          date_param: string;
        };
        Returns: Json;
      };
      get_patient_appointments: {
        Args: {
          patient_id: number;
        };
        Returns: {
          id: number;
          name: string;
          appointments: Json;
        }[];
      };
      get_patient_with_appointments: {
        Args: {
          p_id: number;
        };
        Returns: {
          id: number;
          name: string;
          email: string;
          age: number;
          address: Json;
          appointments: Json;
        }[];
      };
      get_specific_tables_data: {
        Args: Record<PropertyKey, never>;
        Returns: {
          table_name: string;
          row_data: Json;
        }[];
      };
      get_time_slot_appointments: {
        Args: {
          query_date: string;
        };
        Returns: {
          time_slot_id: string;
          time_slot_time: string;
          appointment_count: number;
        }[];
      };
      get_time_slots_with_accepted_appointments_for_date: {
        Args: {
          target_date: string;
        };
        Returns: {
          time_slot_id: number;
          time_slot_time: string;
          appointment_count: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
