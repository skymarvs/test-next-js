import { Database } from "@/lib/types/supabase";

export type Event = Database['public']['Tables']['events']['Row']
export type Profile = Database['public']['Tables']['profile']['Row']