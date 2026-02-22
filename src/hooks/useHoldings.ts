import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["holdings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("holdings").select("*").order("created_at");
      if (error) throw error;
      return data as DbHolding[];
    },
    enabled: !!user,
  });

  const createHolding = useMutation({
    mutationFn: async (holding: { symbol: string; name: string; type: string; units: number; avg_buy_price: number; current_price: number }) => {
      const { error } = await supabase.from("holdings").insert({ ...holding, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holdings"] });
      toast({ title: "Holding added" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateHolding = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; symbol?: string; name?: string; type?: string; units?: number; avg_buy_price?: number; current_price?: number }) => {
      const { error } = await supabase.from("holdings").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holdings"] });
      toast({ title: "Holding updated" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteHolding = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("holdings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["holdings"] }),
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return { holdings: query.data ?? [], isLoading: query.isLoading, createHolding, updateHolding, deleteHolding };
}
