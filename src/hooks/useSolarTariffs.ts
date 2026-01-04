import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SolarTariff {
  id: string;
  region: string;
  state: string;
  utility_company: string;
  utility_id: string;
  energy_tariff: number;
  distribution_tariff: number;
  icms_rate: number;
  pis_rate: number;
  cofins_rate: number;
  solar_irradiation: number;
  installation_cost_per_kwp: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSolarTariffs = (utilityId?: string) => {
  const [currentTariff, setCurrentTariff] = useState<SolarTariff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTariffs = useCallback(async () => {
    if (!utilityId) {
      setCurrentTariff(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Try to find by utility_id first, then by id (for cases where utility_id is null)
      let data = null;
      let fetchError = null;
      
      // First try by utility_id
      const result1 = await supabase
        .from('solar_tariffs')
        .select('*')
        .eq('utility_id', utilityId)
        .eq('is_active', true)
        .maybeSingle();
      
      if (result1.data) {
        data = result1.data;
      } else {
        // Fallback: try by id (UUID)
        const result2 = await supabase
          .from('solar_tariffs')
          .select('*')
          .eq('id', utilityId)
          .eq('is_active', true)
          .maybeSingle();
        
        data = result2.data;
        fetchError = result2.error;
      }

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setCurrentTariff(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar tarifas');
    } finally {
      setLoading(false);
    }
  }, [utilityId]);

  useEffect(() => {
    fetchTariffs();
  }, [utilityId]);

  // Setup realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('solar_tariffs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'solar_tariffs'
        },
        (payload) => {
          console.log('Tariff updated:', payload);
          // Only refetch if the change affects our current utility
          const newData = payload.new as any;
          const oldData = payload.old as any;
          if (!utilityId || newData?.utility_id === utilityId || oldData?.utility_id === utilityId) {
            fetchTariffs();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [utilityId, fetchTariffs]);

  return {
    currentTariff,
    loading,
    error,
    refetch: fetchTariffs
  };
};