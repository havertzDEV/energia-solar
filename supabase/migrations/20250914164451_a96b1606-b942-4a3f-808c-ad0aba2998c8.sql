-- Inserir dados atualizados de tarifas solares para todos os estados
INSERT INTO solar_tariffs (
  state, region, utility_company, energy_tariff, distribution_tariff, 
  icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active
) VALUES 
-- Sudeste
('SP', 'Sudeste', 'CPFL/Elektro/EDP/Enel SP', 0.5485, 0.3025, 0.18, 0.0165, 0.0760, 4.95, 4750, true),
('RJ', 'Sudeste', 'Light/Enel RJ', 0.6125, 0.3380, 0.18, 0.0165, 0.0760, 5.35, 4750, true),
('MG', 'Sudeste', 'CEMIG', 0.5240, 0.2890, 0.18, 0.0165, 0.0760, 5.25, 4750, true),
('ES', 'Sudeste', 'EDP Espírito Santo', 0.5320, 0.2935, 0.17, 0.0165, 0.0760, 5.55, 4750, true),
-- Sul
('RS', 'Sul', 'CEEE/RGE Sul', 0.4925, 0.2715, 0.17, 0.0165, 0.0760, 4.35, 4600, true),
('PR', 'Sul', 'COPEL', 0.4785, 0.2640, 0.18, 0.0165, 0.0760, 4.75, 4600, true),
('SC', 'Sul', 'CELESC', 0.5065, 0.2795, 0.17, 0.0165, 0.0760, 4.55, 4600, true),
-- Nordeste
('BA', 'Nordeste', 'Neoenergia Coelba', 0.4745, 0.2615, 0.17, 0.0165, 0.0760, 6.05, 4400, true),
('CE', 'Nordeste', 'Enel Ceará', 0.4625, 0.2550, 0.17, 0.0165, 0.0760, 6.15, 4400, true),
('PE', 'Nordeste', 'Neoenergia Pernambuco', 0.4885, 0.2695, 0.17, 0.0165, 0.0760, 5.85, 4400, true),
('PB', 'Nordeste', 'Energisa Paraíba', 0.4605, 0.2540, 0.17, 0.0165, 0.0760, 5.75, 4400, true),
('RN', 'Nordeste', 'Neoenergia Cosern', 0.4685, 0.2585, 0.17, 0.0165, 0.0760, 6.05, 4400, true),
('AL', 'Nordeste', 'Equatorial Alagoas', 0.4725, 0.2605, 0.17, 0.0165, 0.0760, 5.65, 4400, true),
('SE', 'Nordeste', 'Energisa Sergipe', 0.4665, 0.2575, 0.17, 0.0165, 0.0760, 5.85, 4400, true),
('PI', 'Nordeste', 'Equatorial Piauí', 0.4645, 0.2565, 0.17, 0.0165, 0.0760, 6.00, 4400, true),
('MA', 'Nordeste', 'Equatorial Maranhão', 0.4925, 0.2715, 0.17, 0.0165, 0.0760, 5.35, 4400, true),
-- Centro-Oeste
('GO', 'Centro-Oeste', 'Enel Goiás', 0.4985, 0.2750, 0.17, 0.0165, 0.0760, 5.45, 4900, true),
('DF', 'Centro-Oeste', 'CEB Distribuição', 0.5145, 0.2840, 0.18, 0.0165, 0.0760, 5.45, 4900, true),
('MT', 'Centro-Oeste', 'Energisa Mato Grosso', 0.4865, 0.2685, 0.17, 0.0165, 0.0760, 5.65, 4900, true),
('MS', 'Centro-Oeste', 'Energisa Mato Grosso do Sul', 0.4945, 0.2725, 0.17, 0.0165, 0.0760, 5.35, 4900, true),
-- Norte
('TO', 'Norte', 'Energisa Tocantins', 0.4985, 0.2750, 0.17, 0.0165, 0.0760, 5.55, 5200, true),
('AM', 'Norte', 'Amazonas Energia', 0.5585, 0.3080, 0.17, 0.0165, 0.0760, 4.45, 5200, true),
('PA', 'Norte', 'Equatorial Pará', 0.5195, 0.2865, 0.17, 0.0165, 0.0760, 4.95, 5200, true),
('RO', 'Norte', 'Energisa Rondônia', 0.5125, 0.2830, 0.17, 0.0165, 0.0760, 5.05, 5200, true),
('AC', 'Norte', 'Energisa Acre', 0.5485, 0.3025, 0.17, 0.0165, 0.0760, 4.65, 5200, true),
('RR', 'Norte', 'Roraima Energia', 0.5385, 0.2970, 0.17, 0.0165, 0.0760, 4.85, 5200, true),
('AP', 'Norte', 'CEA - Amapá', 0.5285, 0.2915, 0.17, 0.0165, 0.0760, 4.75, 5200, true);