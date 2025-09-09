-- Inserir tarifas para todos os estados brasileiros com dados realistas
INSERT INTO solar_tariffs (
  region, state, utility_company, energy_tariff, distribution_tariff, 
  icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active
) VALUES
-- Nordeste
('Nordeste', 'BA', 'Coelba', 0.52500, 0.31200, 0.1950, 0.0165, 0.0760, 6.2, 4200, true),
('Nordeste', 'CE', 'Enel Ceará', 0.54100, 0.32800, 0.2200, 0.0165, 0.0760, 6.0, 4300, true),
('Nordeste', 'PE', 'Neoenergia Pernambuco', 0.53200, 0.31900, 0.2100, 0.0165, 0.0760, 5.8, 4400, true),
('Nordeste', 'RN', 'Cosern', 0.51800, 0.30500, 0.2000, 0.0165, 0.0760, 6.1, 4350, true),
('Nordeste', 'PB', 'Energisa Paraíba', 0.50900, 0.30200, 0.1950, 0.0165, 0.0760, 5.9, 4450, true),
('Nordeste', 'AL', 'Equatorial Alagoas', 0.52800, 0.31400, 0.1970, 0.0165, 0.0760, 5.7, 4500, true),
('Nordeste', 'SE', 'Energisa Sergipe', 0.51200, 0.30800, 0.1900, 0.0165, 0.0760, 5.8, 4400, true),
('Nordeste', 'PI', 'Equatorial Piauí', 0.53500, 0.32100, 0.2050, 0.0165, 0.0760, 6.0, 4300, true),

-- Sudeste
('Sudeste', 'SP', 'Enel São Paulo', 0.68500, 0.42300, 0.1800, 0.0165, 0.0760, 5.2, 4800, true),
('Sudeste', 'RJ', 'Light', 0.72100, 0.45200, 0.2000, 0.0165, 0.0760, 4.9, 5200, true),
('Sudeste', 'MG', 'Cemig', 0.65200, 0.39800, 0.1800, 0.0165, 0.0760, 5.5, 4600, true),
('Sudeste', 'ES', 'EDP Espírito Santo', 0.61800, 0.37500, 0.1700, 0.0165, 0.0760, 5.3, 4700, true),

-- Sul
('Sul', 'RS', 'CEEE-D', 0.58900, 0.35600, 0.1700, 0.0165, 0.0760, 4.8, 5000, true),
('Sul', 'SC', 'Celesc', 0.56200, 0.33800, 0.1700, 0.0165, 0.0760, 4.9, 4900, true),
('Sul', 'PR', 'Copel', 0.55800, 0.33200, 0.1800, 0.0165, 0.0760, 5.0, 4750, true),

-- Centro-Oeste
('Centro-Oeste', 'GO', 'Enel Goiás', 0.54800, 0.32900, 0.1700, 0.0165, 0.0760, 5.8, 4400, true),
('Centro-Oeste', 'MT', 'Energisa Mato Grosso', 0.53100, 0.31800, 0.1700, 0.0165, 0.0760, 6.0, 4200, true),
('Centro-Oeste', 'MS', 'Energisa Mato Grosso do Sul', 0.52700, 0.31500, 0.1700, 0.0165, 0.0760, 5.9, 4300, true),
('Centro-Oeste', 'DF', 'Neoenergia Brasília', 0.57200, 0.34500, 0.1800, 0.0165, 0.0760, 5.7, 4650, true),

-- Norte
('Norte', 'AM', 'Amazonas Energia', 0.49200, 0.28900, 0.1800, 0.0165, 0.0760, 4.5, 5500, true),
('Norte', 'PA', 'Equatorial Pará', 0.51500, 0.30300, 0.1700, 0.0165, 0.0760, 5.2, 5200, true),
('Norte', 'RO', 'Energisa Rondônia', 0.50800, 0.29800, 0.1700, 0.0165, 0.0760, 4.8, 5300, true),
('Norte', 'AC', 'Energisa Acre', 0.52300, 0.30900, 0.1700, 0.0165, 0.0760, 4.6, 5600, true),
('Norte', 'RR', 'Roraima Energia', 0.48900, 0.28500, 0.1700, 0.0165, 0.0760, 5.0, 5400, true),
('Norte', 'AP', 'CEA', 0.50100, 0.29200, 0.1800, 0.0165, 0.0760, 4.9, 5500, true),
('Norte', 'TO', 'Energisa Tocantins', 0.53800, 0.32200, 0.1800, 0.0165, 0.0760, 5.5, 4800, true);