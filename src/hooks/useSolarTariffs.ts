import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export const useSolarTariffs = (region: string = "Maranhão", state: string = "MA") => {
  const [tariffs, setTariffs] = useState<SolarTariff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial data
    const fetchTariffs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('solar_tariffs')
          .select('*')
          .eq('region', region)
          .eq('state', state)
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching tariffs:', error);
          setError(error.message);
          return;
        }

        setTariffs(data);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError('Erro ao carregar tarifas');
      } finally {
        setLoading(false);
      }
    };

    fetchTariffs();

    // Set up real-time subscription
    const channel = supabase
      .channel('solar-tariffs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'solar_tariffs',
          filter: `region=eq.${region},state=eq.${state},is_active=eq.true`
        },
        (payload) => {
          console.log('Real-time tariff update received:', payload);
          
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setTariffs(payload.new as SolarTariff);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [region, state]);

  return { tariffs, loading, error };
};