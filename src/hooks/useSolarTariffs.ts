import { useState, useEffect } from 'react';
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

  const fetchTariffs = async () => {
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
  };

  useEffect(() => {
    fetchTariffs();
  }, [utilityId]);

  // Setup realtime subscription
  useEffect(() => {
    if (!utilityId) return;

    const channel = supabase
      .channel('solar_tariffs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'solar_tariffs',
          filter: `utility_id=eq.${utilityId}`
        },
        (payload) => {
          console.log('Tariff updated:', payload);
          fetchTariffs(); // Refetch when data changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [utilityId]);

  return {
    currentTariff,
    loading,
    error,
    refetch: fetchTariffs
  };
};