-- Desativar registros duplicados com utility_id NULL
-- Esses registros estão causando erro na interface porque não podem ser selecionados

-- MG - Desativar registro NULL duplicado (já existe mg_cemig_default)
UPDATE public.solar_tariffs
SET is_active = false
WHERE state = 'MG' AND utility_id IS NULL AND is_active = true;

-- RJ - Desativar registro NULL duplicado (já existe rj_light_enel_group)
UPDATE public.solar_tariffs
SET is_active = false
WHERE state = 'RJ' AND utility_id IS NULL AND is_active = true;

-- RS - Desativar registro NULL duplicado (já existe rs_ceee_rge_group)
UPDATE public.solar_tariffs
SET is_active = false
WHERE state = 'RS' AND utility_id IS NULL AND is_active = true;

-- SP - Desativar registro NULL duplicado (já existe sp_cpfl_group_all)
UPDATE public.solar_tariffs
SET is_active = false
WHERE state = 'SP' AND utility_id IS NULL AND is_active = true;