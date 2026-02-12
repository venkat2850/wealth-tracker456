import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DbHolding {
  id: string;
  symbol: string;
  name: string;
  type: string;
  units: number;
  avg_buy_price: number;
  current_price: number;
  change_24h: number;
}

export function useHoldings() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["holdings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("holdings").select("*").order("created_at");
      if (error) throw error;
      return data as DbHolding[];
    },
    enabled: !!user,
  });

  return { holdings: query.data ?? [], isLoading: query.isLoading };
}
