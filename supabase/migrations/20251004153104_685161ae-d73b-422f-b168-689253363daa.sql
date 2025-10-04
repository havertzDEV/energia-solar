-- Adicionar coluna para identificador único de concessionária se não existir
ALTER TABLE public.solar_tariffs 
ADD COLUMN IF NOT EXISTS utility_id VARCHAR UNIQUE;

-- Adicionar índice para melhorar performance nas buscas por estado e concessionária
CREATE INDEX IF NOT EXISTS idx_solar_tariffs_state_utility 
ON public.solar_tariffs(state, utility_company);

-- Deletar todos os registros existentes para começar do zero
DELETE FROM public.solar_tariffs;

-- Inserir tarifas detalhadas por concessionária para cada estado
-- São Paulo
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Sudeste', 'SP', 'CPFL Paulista', 'sp_cpfl_paulista', 0.54850, 0.30250, 0.1800, 0.0165, 0.0760, 4.95, 4750.00, true),
('Sudeste', 'SP', 'Elektro', 'sp_elektro', 0.52340, 0.29180, 0.1800, 0.0165, 0.0760, 4.95, 4750.00, true),
('Sudeste', 'SP', 'EDP São Paulo', 'sp_edp_sao_paulo', 0.53120, 0.30890, 0.1800, 0.0165, 0.0760, 4.95, 4750.00, true),
('Sudeste', 'SP', 'Enel São Paulo', 'sp_enel_sao_paulo', 0.55670, 0.31420, 0.1800, 0.0165, 0.0760, 4.95, 4750.00, true);

-- Rio de Janeiro
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Sudeste', 'RJ', 'Light', 'rj_light', 0.72480, 0.35620, 0.2100, 0.0165, 0.0760, 4.82, 4900.00, true),
('Sudeste', 'RJ', 'Enel Rio', 'rj_enel_rio', 0.68950, 0.34180, 0.2100, 0.0165, 0.0760, 4.82, 4900.00, true);

-- Minas Gerais
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Sudeste', 'MG', 'CEMIG', 'mg_cemig', 0.63240, 0.32150, 0.1800, 0.0165, 0.0760, 5.12, 4650.00, true),
('Sudeste', 'MG', 'CPFL Santa Cruz', 'mg_cpfl_santa_cruz', 0.59870, 0.30980, 0.1800, 0.0165, 0.0760, 5.12, 4650.00, true);

-- Espírito Santo
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Sudeste', 'ES', 'EDP Espírito Santo', 'es_edp_espirito_santo', 0.57230, 0.31240, 0.1700, 0.0165, 0.0760, 5.18, 4800.00, true);

-- Paraná
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Sul', 'PR', 'Copel', 'pr_copel', 0.61580, 0.30890, 0.1900, 0.0165, 0.0760, 4.72, 4550.00, true);

-- Santa Catarina
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Sul', 'SC', 'Celesc', 'sc_celesc', 0.58960, 0.29740, 0.1700, 0.0165, 0.0760, 4.65, 4500.00, true);

-- Rio Grande do Sul
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Sul', 'RS', 'CEEE', 'rs_ceee', 0.64320, 0.31560, 0.1700, 0.0165, 0.0760, 4.58, 4450.00, true),
('Sul', 'RS', 'RGE', 'rs_rge', 0.62150, 0.30420, 0.1700, 0.0165, 0.0760, 4.58, 4450.00, true);

-- Bahia
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Nordeste', 'BA', 'Coelba', 'ba_coelba', 0.65780, 0.33240, 0.2100, 0.0165, 0.0760, 5.85, 4350.00, true);

-- Ceará
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Nordeste', 'CE', 'Enel Ceará', 'ce_enel_ceara', 0.60890, 0.31450, 0.2100, 0.0165, 0.0760, 5.92, 4300.00, true);

-- Pernambuco
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Nordeste', 'PE', 'Neoenergia Pernambuco', 'pe_neoenergia_pernambuco', 0.62340, 0.32180, 0.2100, 0.0165, 0.0760, 5.78, 4320.00, true);

-- Rio Grande do Norte
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Nordeste', 'RN', 'Cosern', 'rn_cosern', 0.59760, 0.30890, 0.2100, 0.0165, 0.0760, 5.88, 4280.00, true);

-- Paraíba
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Nordeste', 'PB', 'Energisa Paraíba', 'pb_energisa_paraiba', 0.61230, 0.31560, 0.2100, 0.0165, 0.0760, 5.82, 4290.00, true);

-- Alagoas
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Nordeste', 'AL', 'Equatorial Alagoas', 'al_equatorial_alagoas', 0.63450, 0.32780, 0.2100, 0.0165, 0.0760, 5.75, 4310.00, true);

-- Sergipe
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Nordeste', 'SE', 'Energisa Sergipe', 'se_energisa_sergipe', 0.60340, 0.31120, 0.2100, 0.0165, 0.0760, 5.70, 4330.00, true);

-- Piauí
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Nordeste', 'PI', 'Equatorial Piauí', 'pi_equatorial_piaui', 0.58920, 0.30450, 0.2100, 0.0165, 0.0760, 5.95, 4270.00, true);

-- Maranhão
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Nordeste', 'MA', 'Equatorial Maranhão', 'ma_equatorial_maranhao', 0.62180, 0.32340, 0.2100, 0.0165, 0.0760, 5.68, 4340.00, true);

-- Goiás
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Centro-Oeste', 'GO', 'Enel Goiás', 'go_enel_goias', 0.59340, 0.30780, 0.1700, 0.0165, 0.0760, 5.42, 4400.00, true);

-- Mato Grosso
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Centro-Oeste', 'MT', 'Energisa Mato Grosso', 'mt_energisa_mato_grosso', 0.61450, 0.31890, 0.1700, 0.0165, 0.0760, 5.58, 4380.00, true);

-- Mato Grosso do Sul
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Centro-Oeste', 'MS', 'Energisa Mato Grosso do Sul', 'ms_energisa_mato_grosso_do_sul', 0.58760, 0.30230, 0.1700, 0.0165, 0.0760, 5.35, 4420.00, true);

-- Distrito Federal
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Centro-Oeste', 'DF', 'CEB', 'df_ceb', 0.60120, 0.31340, 0.2000, 0.0165, 0.0760, 5.48, 4850.00, true);

-- Pará
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Norte', 'PA', 'Equatorial Pará', 'pa_equatorial_para', 0.64890, 0.33560, 0.2500, 0.0165, 0.0760, 5.22, 4600.00, true);

-- Amazonas
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Norte', 'AM', 'Amazonas Energia', 'am_amazonas_energia', 0.68450, 0.35230, 0.2500, 0.0165, 0.0760, 4.98, 4950.00, true);

-- Tocantins
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Norte', 'TO', 'Energisa Tocantins', 'to_energisa_tocantins', 0.60780, 0.31450, 0.2500, 0.0165, 0.0760, 5.52, 4450.00, true);

-- Rondônia
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Norte', 'RO', 'Energisa Rondônia', 'ro_energisa_rondonia', 0.62340, 0.32120, 0.2500, 0.0165, 0.0760, 5.18, 4550.00, true);

-- Acre
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Norte', 'AC', 'Energisa Acre', 'ac_energisa_acre', 0.63120, 0.32680, 0.2500, 0.0165, 0.0760, 5.05, 4700.00, true);

-- Roraima
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Norte', 'RR', 'Roraima Energia', 'rr_roraima_energia', 0.65890, 0.34120, 0.2500, 0.0165, 0.0760, 5.32, 4800.00, true);

-- Amapá
INSERT INTO public.solar_tariffs (region, state, utility_company, utility_id, energy_tariff, distribution_tariff, icms_rate, pis_rate, cofins_rate, solar_irradiation, installation_cost_per_kwp, is_active) VALUES
('Norte', 'AP', 'CEA', 'ap_cea', 0.67230, 0.34890, 0.2500, 0.0165, 0.0760, 5.12, 4850.00, true);