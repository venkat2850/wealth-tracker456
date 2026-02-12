import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DbTransaction {
  id: string;
  symbol: string;
  type: string;
  units: number | null;
  price: number;
  date: string;
}

export function useTransactions() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data as DbTransaction[];
    },
    enabled: !!user,
  });

  return { transactions: query.data ?? [], isLoading: query.isLoading };
}
