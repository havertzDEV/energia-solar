import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UtilityCompany {
  id: string;
  utility_id: string;
  utility_company: string;
  energy_tariff: number;
  distribution_tariff: number;
  icms_rate: number;
  pis_rate: number;
  cofins_rate: number;
  solar_irradiation: number;
  installation_cost_per_kwp: number;
}

export const useUtilityCompanies = (state?: string) => {
  const [companies, setCompanies] = useState<UtilityCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!state) {
        setCompanies([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('solar_tariffs')
          .select('id, utility_id, utility_company, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp')
          .eq('state', state)
          .eq('is_active', true)
          .order('utility_company');

        if (error) throw error;
        
        // Remove duplicates based on utility_company name and ensure valid id
        const uniqueCompanies = (data || []).reduce((acc: UtilityCompany[], current) => {
          const exists = acc.find(item => item.utility_company === current.utility_company);
          if (!exists) {
            acc.push({
              ...current,
              // Use id as fallback if utility_id is null
              utility_id: current.utility_id || current.id
            });
          }
          return acc;
        }, []);
        
        setCompanies(uniqueCompanies);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching utility companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [state]);

  return { companies, loading, error };
};
