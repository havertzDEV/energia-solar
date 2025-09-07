import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SolarTariff {
  id: string;
  region: string;
  state: string;
  utility_company: string;
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

export const useSolarTariffs = (region?: string, state?: string) => {
  const [tariffs, setTariffs] = useState<SolarTariff[]>([]);
  const [currentTariff, setCurrentTariff] = useState<SolarTariff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTariffs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('solar_tariffs')
        .select('*')
        .eq('is_active', true);

      if (region) {
        query = query.eq('region', region);
      }
      if (state) {
        query = query.eq('state', state);
      }

      const { data, error: fetchError } = await query.order('updated_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setTariffs(data || []);
      
      // Set current tariff to the most recent one for the region
      if (data && data.length > 0) {
        setCurrentTariff(data[0]);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar tarifas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTariffs();
  }, [region, state]);

  // Setup realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('solar_tariffs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'solar_tariffs',
          filter: 'is_active=eq.true'
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
  }, [region, state]);

  return {
    tariffs,
    currentTariff,
    loading,
    error,
    refetch: fetchTariffs
  };
};