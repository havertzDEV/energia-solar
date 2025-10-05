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
      const { data, error: fetchError } = await supabase
        .from('solar_tariffs')
        .select('*')
        .eq('utility_id', utilityId)
        .eq('is_active', true)
        .maybeSingle();

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