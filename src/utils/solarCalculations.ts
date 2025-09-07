import { SolarTariff } from '@/hooks/useSolarTariffs';

export interface SolarSavings {
  monthly: number;
  yearly: number;
  systemSize: number;
  investment: number;
  payback: number;
  totalTariff: number;
  monthlyConsumption: number;
}

export const calculateSolarSavings = (
  monthlyBill: number,
  consumption: number,
  tariff: SolarTariff
): SolarSavings | null => {
  if (!tariff || (monthlyBill <= 0 && consumption <= 0)) {
    return null;
  }

  // Calcular tarifa total
  const baseTariff = tariff.energy_tariff + tariff.distribution_tariff;
  
  // Calcular impostos totais
  const totalTaxRate = 1 + tariff.icms_rate + tariff.pis_rate + tariff.cofins_rate;
  const totalTariff = baseTariff * totalTaxRate;

  let monthlyConsumption: number;

  if (consumption > 0) {
    monthlyConsumption = consumption;
  } else {
    // Estimar consumo baseado na conta
    monthlyConsumption = monthlyBill / totalTariff;
  }

  // Economia com energia solar (95% da conta - taxa mínima permanece)
  const actualBill = monthlyBill > 0 ? monthlyBill : monthlyConsumption * totalTariff;
  const monthlyEconomy = actualBill * 0.95;
  const yearlyEconomy = monthlyEconomy * 12;

  // Dimensionamento do sistema (considerando irradiação)
  const dailyGeneration = monthlyConsumption / 30;
  const systemSize = dailyGeneration / tariff.solar_irradiation;

  // Investimento estimado
  const investmentCost = systemSize * tariff.installation_cost_per_kwp;

  // Payback (tempo de retorno do investimento)
  const paybackYears = investmentCost / yearlyEconomy;

  return {
    monthly: monthlyEconomy,
    yearly: yearlyEconomy,
    systemSize: Math.round(systemSize * 100) / 100,
    investment: investmentCost,
    payback: Math.round(paybackYears * 10) / 10,
    totalTariff,
    monthlyConsumption: Math.round(monthlyConsumption)
  };
};