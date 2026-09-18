import { Database } from "@/lib/types/supabase";

export type Event = Database['public']['Tables']['events']['Row']