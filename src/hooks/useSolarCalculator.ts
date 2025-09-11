import { useMemo } from "react";
import { SolarTariff } from "./useSolarTariffs";

export interface SolarCalculation {
  monthly: number;
  yearly: number;
  systemSize: number;
  investment: number;
  payback: number;
  monthlyConsumption: number;
  totalTariff: number;
  inverterPower: number;
  moduleQuantity: number;
  moduleUnitPower: number;
}

export const useSolarCalculator = (
  monthlyBill: number,
  consumption: number,
  tariffs: SolarTariff | null
): SolarCalculation | null => {
  return useMemo(() => {
    if (!tariffs || (!monthlyBill && !consumption)) {
      return null;
    }

    // Calcular tarifa total com impostos
    const baseTariff = tariffs.energy_tariff + tariffs.distribution_tariff;
    const totalTaxRate = 1 + tariffs.icms_rate + tariffs.pis_rate + tariffs.cofins_rate;
    const totalTariff = baseTariff * totalTaxRate;

    let monthlyConsumption: number;

    if (consumption > 0) {
      monthlyConsumption = consumption;
    } else {
      // Estimar consumo baseado na conta
      monthlyConsumption = monthlyBill / totalTariff;
    }

    // Economia com energia solar (95% da conta - taxa mínima permanece)
    const monthlyEconomy = monthlyBill > 0 ? monthlyBill * 0.95 : monthlyConsumption * totalTariff * 0.95;
    const yearlyEconomy = monthlyEconomy * 12;

    // Dimensionamento do sistema
    const dailyGeneration = monthlyConsumption / 30;
    const systemSize = dailyGeneration / tariffs.solar_irradiation;

    // Especificações do equipamento
    const moduleUnitPower = 0.55; // 550W por módulo (padrão mercado)
    const moduleQuantity = Math.ceil(systemSize / moduleUnitPower);
    const inverterPower = Math.round(systemSize * 1.2 * 100) / 100; // 20% acima do sistema

    // Investimento estimado
    const investmentCost = systemSize * tariffs.installation_cost_per_kwp;

    // Payback (tempo de retorno do investimento)
    const paybackYears = investmentCost / yearlyEconomy;

    return {
      monthly: monthlyEconomy,
      yearly: yearlyEconomy,
      systemSize: Math.round(systemSize * 100) / 100,
      investment: investmentCost,
      payback: Math.round(paybackYears * 10) / 10,
      monthlyConsumption,
      totalTariff,
      inverterPower,
      moduleQuantity,
      moduleUnitPower
    };
  }, [monthlyBill, consumption, tariffs]);
};