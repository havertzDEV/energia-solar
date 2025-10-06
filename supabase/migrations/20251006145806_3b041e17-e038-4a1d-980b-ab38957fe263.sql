-- Corrigir utility_ids faltantes com IDs únicos que não conflitam

-- AC - Acre
UPDATE public.solar_tariffs
SET utility_id = 'ac_energisa_main'
WHERE id = '9a71f54c-5e35-4097-ba73-f01ccb81e62f';

-- AL - Alagoas  
UPDATE public.solar_tariffs
SET utility_id = 'al_equatorial_main'
WHERE id = '68bfb69a-dffa-4833-bf4a-6a2c1d65b7e7';

-- AM - Amazonas
UPDATE public.solar_tariffs
SET utility_id = 'am_amazonas_main'
WHERE id = '963beccb-5fa6-4dfd-bbbe-8c0d47037e7c';

-- AP - Amapá
UPDATE public.solar_tariffs
SET utility_id = 'ap_cea_main'
WHERE id = '9ea283ba-1c18-464d-b4dd-65414f0e5876';

-- BA - Bahia
UPDATE public.solar_tariffs
SET utility_id = 'ba_neoenergia_main'
WHERE id = '63c989a2-8c2f-4435-ab23-3debe5e96473';

-- CE - Ceará
UPDATE public.solar_tariffs
SET utility_id = 'ce_enel_main'
WHERE id = '98157966-b390-4c9a-9b29-4048f9d96e70';

-- DF - Distrito Federal
UPDATE public.solar_tariffs
SET utility_id = 'df_ceb_main'
WHERE id = '436bb53c-efb2-432f-920d-fc5f5d53f71f';

-- ES - Espírito Santo
UPDATE public.solar_tariffs
SET utility_id = 'es_edp_main'
WHERE id = '3d1c6a7f-10e2-4082-a415-ff4692032cc9';

-- GO - Goiás
UPDATE public.solar_tariffs
SET utility_id = 'go_enel_main'
WHERE id = 'f956f834-decb-467c-9c99-36190dc47338';

-- MA - Maranhão
UPDATE public.solar_tariffs
SET utility_id = 'ma_equatorial_main'
WHERE id = 'fcb660fe-9f61-4477-906c-0b2aa6e5c1e1';

-- MG - Minas Gerais (registro agrupado/default)
UPDATE public.solar_tariffs
SET utility_id = 'mg_cemig_default'
WHERE id = 'cb989bee-fb62-4586-b858-98667fc48d7a';

-- MS - Mato Grosso do Sul
UPDATE public.solar_tariffs
SET utility_id = 'ms_energisa_main'
WHERE id = '2ebc71fe-dac0-4cf3-8136-95c9bbbbb237';

-- MT - Mato Grosso
UPDATE public.solar_tariffs
SET utility_id = 'mt_energisa_main'
WHERE id = '4ff88fb2-3722-454d-91ce-f7b3b38d6b4d';

-- PA - Pará
UPDATE public.solar_tariffs
SET utility_id = 'pa_equatorial_main'
WHERE id = '2d04c4eb-c8e1-4299-92cc-b397161c288c';

-- PB - Paraíba
UPDATE public.solar_tariffs
SET utility_id = 'pb_energisa_main'
WHERE id = 'a91531dc-4827-4847-81cb-c3cc4dbb4ad1';

-- PE - Pernambuco
UPDATE public.solar_tariffs
SET utility_id = 'pe_neoenergia_main'
WHERE id = '9c75556d-14ed-4331-a00d-de31df90496e';

-- PI - Piauí
UPDATE public.solar_tariffs
SET utility_id = 'pi_equatorial_main'
WHERE id = 'd1f90746-61f1-4796-8826-633871efe5eb';

-- PR - Paraná
UPDATE public.solar_tariffs
SET utility_id = 'pr_copel_main'
WHERE id = '63e6d075-97d4-4af1-9030-859a44ce1202';

-- RJ - Rio de Janeiro (registro agrupado)
UPDATE public.solar_tariffs
SET utility_id = 'rj_light_enel_group'
WHERE id = 'ac43aacb-5b66-48f3-a52a-fca9b0a10543';

-- RN - Rio Grande do Norte
UPDATE public.solar_tariffs
SET utility_id = 'rn_neoenergia_main'
WHERE id = 'c3dae141-d907-45be-aab5-461d392427ba';

-- RO - Rondônia
UPDATE public.solar_tariffs
SET utility_id = 'ro_energisa_main'
WHERE id = '10df6018-df7c-452a-ad53-405a610b406d';

-- RR - Roraima
UPDATE public.solar_tariffs
SET utility_id = 'rr_roraima_main'
WHERE id = 'c70dd149-ed7d-431c-9ade-e65d5e37d2a3';

-- RS - Rio Grande do Sul (registro agrupado)
UPDATE public.solar_tariffs
SET utility_id = 'rs_ceee_rge_group'
WHERE id = '8a9f9322-a6e1-4c17-93ed-232f6504a3b2';

-- SC - Santa Catarina
UPDATE public.solar_tariffs
SET utility_id = 'sc_celesc_main'
WHERE id = '78b5f4a0-3de8-4fbd-8541-ea6411fc1396';

-- SE - Sergipe
UPDATE public.solar_tariffs
SET utility_id = 'se_energisa_main'
WHERE id = 'd0ec99ae-8dbe-46c0-a288-5696f68dd21b';

-- SP - São Paulo (registro agrupado)
UPDATE public.solar_tariffs
SET utility_id = 'sp_cpfl_group_all'
WHERE id = '401fb9cc-10b0-4b52-89d7-6dbbaf150d61';

-- TO - Tocantins
UPDATE public.solar_tariffs
SET utility_id = 'to_energisa_main'
WHERE id = 'e69a1d21-e768-4860-a990-3e5322b0209b';