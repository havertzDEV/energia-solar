-- Criar tabela para tarifas de energia solar
CREATE TABLE public.solar_tariffs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  utility_company VARCHAR(100) NOT NULL,
  energy_tariff DECIMAL(10,5) NOT NULL, -- R$/kWh - TE (Tarifa de Energia)
  distribution_tariff DECIMAL(10,5) NOT NULL, -- R$/kWh - TUSD (Tarifa de Uso do Sistema de Distribuição)
  icms_rate DECIMAL(5,4) NOT NULL, -- Taxa ICMS (ex: 0.27 para 27%)
  pis_rate DECIMAL(5,4) NOT NULL, -- Taxa PIS (ex: 0.0165 para 1.65%)
  cofins_rate DECIMAL(5,4) NOT NULL, -- Taxa COFINS (ex: 0.076 para 7.6%)
  solar_irradiation DECIMAL(4,2) NOT NULL, -- kWh/m²/dia
  installation_cost_per_kwp DECIMAL(10,2) NOT NULL, -- R$ por kWp
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.solar_tariffs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Solar tariffs are viewable by everyone" 
ON public.solar_tariffs 
FOR SELECT 
USING (is_active = true);

-- Create policy for admin updates (usando auth.jwt() para admin role)
CREATE POLICY "Admins can manage solar tariffs" 
ON public.solar_tariffs 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');

-- Insert initial data for Maranhão
INSERT INTO public.solar_tariffs (
  region, state, utility_company, energy_tariff, distribution_tariff, 
  icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp
) VALUES (
  'Maranhão', 'MA', 'Equatorial Maranhão', 
  0.52840, 0.31450, 0.27, 0.0165, 0.076, 5.5, 4500.00
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_solar_tariffs_updated_at
BEFORE UPDATE ON public.solar_tariffs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_solar_tariffs_region_state ON public.solar_tariffs(region, state, is_active);

-- Add replica identity for realtime
ALTER TABLE public.solar_tariffs REPLICA IDENTITY FULL;